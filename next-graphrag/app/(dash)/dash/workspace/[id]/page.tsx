"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  getWorkspace,
  listJobs,
  uploadFile,
  createJob,
  deleteFile,
} from "../actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface FileItem {
  id: string;
  filename: string;
}

interface JobItem {
  id: string;
  status: string;
}

export default function WorkspaceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const workspaceId = params.id;

  const { data: session } = useSession();

  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // 获取 Workspace 详情
  async function fetchWorkspace() {
    if (!session) return;
    try {
      const data: any = await getWorkspace(workspaceId as string, session);
      setWorkspaceName(data.name);
      setFiles(data.files ?? []);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchJobs() {
    if (!session) return;
    try {
      const data = await listJobs(session);
      setJobs(data.filter((j: any) => j.workspaceId === workspaceId));
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspace();
      fetchJobs();
    }
  }, [workspaceId]);

  // 上传文件
  async function handleUpload() {
    if (!selectedFile || !session) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await uploadFile(workspaceId as string, selectedFile, session);
      setSelectedFile(null);
      fetchWorkspace();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // 创建任务
  async function handleCreateJob() {
    if (!session) return;
    try {
      await createJob(workspaceId as string, session);
      fetchJobs();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Button variant="link" onClick={() => router.back()}>
        ← 返回
      </Button>
      <h1 className="text-3xl font-extrabold tracking-wide mb-4 text-center md:text-left">
        知识库：{workspaceName}
      </h1>

      {/* 主体两栏布局 */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* 左侧功能清单 */}
        <div className="md:col-span-2 space-y-8">
          {/* 文件上传卡片 */}
          <Card className="border-[#d4af37]/40 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#f5e4c3] to-[#e8d3a1] rounded-t-md">
              <CardTitle className="text-[#5c4a1f]">文件上传</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 items-center">
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                />
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || loading}
                  className="bg-[#5c4a1f] hover:bg-[#4a3b19] text-white"
                >
                  上传
                </Button>
              </div>
              <Separator />
              <div className="space-y-2 max-h-60 overflow-auto">
                <h3 className="font-semibold">已上传文件</h3>
                {files.length === 0 && (
                  <p className="text-muted-foreground">暂无文件</p>
                )}
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="flex justify-between items-center border p-2 rounded-md hover:bg-accent/20"
                  >
                    <span className="truncate max-w-[70%]">{f.filename}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        if (!session) return;
                        await deleteFile(f.id, session);
                        fetchWorkspace();
                      }}
                    >
                      删除
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 任务调度卡片 */}
          <Card className="border-[#d4af37]/40 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#f5e4c3] to-[#e8d3a1] rounded-t-md">
              <CardTitle className="text-[#5c4a1f]">任务调度</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleCreateJob}
                className="bg-[#5c4a1f] hover:bg-[#4a3b19] text-white"
              >
                创建任务
              </Button>
              <Separator />
              <div className="space-y-2 max-h-60 overflow-auto">
                <h3 className="font-semibold">任务列表</h3>
                {jobs.length === 0 && (
                  <p className="text-muted-foreground">暂无任务</p>
                )}
                {jobs.map((j) => (
                  <div
                    key={j.id}
                    className="flex justify-between items-center border p-2 rounded-md"
                  >
                    <span className="truncate max-w-[70%]">{j.id}</span>
                    <span className="text-sm text-muted-foreground">
                      {j.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧预览占位 */}
        <div className="hidden md:block">
          <Card className="h-full flex flex-col justify-center items-center border-dashed border-2 border-[#d4af37]/50">
            <CardHeader>
              <CardTitle className="text-[#5c4a1f]">预览 / 简介</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">敬请期待…</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
