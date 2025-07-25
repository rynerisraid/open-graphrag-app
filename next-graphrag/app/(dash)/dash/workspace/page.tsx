"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  listWorkspaces,
  createWorkspace,
  deleteWorkspace,
  updateWorkspace,
} from "./actions";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Workspace {
  id: string;
  name: string;
  createdAt?: string;
}

export default function WorkspaceListPage() {
  const { data: session } = useSession();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState<string>("");
  const [showRenameDialog, setShowRenameDialog] = useState(false);

  // 获取工作空间列表
  async function fetchWorkspaces() {
    if (!session) return;
    try {
      const data = await listWorkspaces(session);
      setWorkspaces(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (session) {
      fetchWorkspaces();
    }
  }, [session]);

  // 创建工作空间
  async function handleCreate() {
    if (!name || !session) return;
    setLoading(true);
    try {
      await createWorkspace(name, session);
      setName("");
      fetchWorkspaces();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // 删除工作空间
  async function handleDelete() {
    if (!deleteId || !session) return;

    const deletePromise = deleteWorkspace(deleteId, session);

    toast.promise(deletePromise, {
      loading: "正在删除工作空间...",
      success: () => "工作空间已删除",
      error: "删除失败，请重试",
    });

    try {
      await deletePromise;
      setShowDeleteDialog(false);
      setDeleteId(null);
      fetchWorkspaces();
    } catch (e) {
      console.error(e);
    }
  }

  // 重命名并进入工作空间
  async function handleRenameAndEnter() {
    if (!renameId || !session || !renameName) return;

    const updatePromise = updateWorkspace(renameId, renameName, session);

    toast.promise(updatePromise, {
      loading: "正在更新名称...",
      success: () => "更新成功",
      error: "更新失败",
    });

    try {
      await updatePromise;
      setShowRenameDialog(false);
      fetchWorkspaces();
      //router.push(`/dash/workspace/${renameId}`);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">工作空间</h1>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>创建新的工作空间</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="工作空间名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button onClick={handleCreate} disabled={loading || !name}>
              创建
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((ws) => (
          <Card key={ws.id} className="hover:ring ring-primary/30">
            <CardHeader>
              <CardTitle className="truncate">{ws.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-end items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  if (!session) return;
                  router.push(`/dash/workspace/${ws.id}`);
                }}
              >
                进入
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  if (!session) return;
                  setRenameId(ws.id);
                  setRenameName(ws.name);
                  setShowRenameDialog(true);
                }}
              >
                进入
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => {
                  if (!session) return;
                  setDeleteId(ws.id);
                  setShowDeleteDialog(true);
                }}
              >
                删除
              </Button>
            </CardContent>
          </Card>
        ))}
        {workspaces.length === 0 && (
          <p className="text-muted-foreground">暂无工作空间</p>
        )}
      </div>

      {/* 删除确认弹窗 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定删除工作空间？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作不可撤销，将永久删除该工作空间及其相关内容。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 重命名并进入弹窗 */}
      <AlertDialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>输入新的工作空间名称</AlertDialogTitle>
            <AlertDialogDescription>
              请输入工作空间名称后点击确认进入。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            placeholder="工作空间名称"
            className="mt-2"
          />
          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              disabled={!renameName}
              onClick={handleRenameAndEnter}
            >
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
