"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Workspace {
  id: string;
  name: string;
  createdAt?: string;
}

export default function WorkspaceListPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // 获取工作空间列表
  async function fetchWorkspaces() {
    const res = await fetch("/api/workspace/");
    if (res.ok) {
      const data = await res.json();
      setWorkspaces(data);
    }
  }

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // 创建工作空间
  async function handleCreate() {
    if (!name) return;
    setLoading(true);
    const res = await fetch("/api/workspace/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    setLoading(false);
    if (res.ok) {
      setName("");
      fetchWorkspaces();
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
            <CardContent className="flex justify-between items-center">
              <Link href={`/dash/workspace/${ws.id}`} passHref legacyBehavior>
                <Button variant="outline" size="sm">
                  进入
                </Button>
              </Link>
              <Button
                size="icon"
                variant="destructive"
                onClick={async () => {
                  if (!confirm("确定删除此工作空间？")) return;
                  await fetch(`/api/workspace/${ws.id}`, { method: "DELETE" });
                  fetchWorkspaces();
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
    </div>
  );
} 