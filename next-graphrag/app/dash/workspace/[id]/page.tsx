"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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

  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // 获取 Workspace 详情
  async function fetchWorkspace() {
    const res = await fetch(`/api/workspace/${workspaceId}`);
    if (res.ok) {
      const data = await res.json();
      setWorkspaceName(data.name);
      setFiles(data.files ?? []);
    }
  }

  async function fetchJobs() {
    const res = await fetch(`/api/jobs/jobs/`);
    if (res.ok) {
      const data = await res.json();
      setJobs(data.filter((j: any) => j.workspaceId === workspaceId));
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
    if (!selectedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch(`/api/file/upload/${workspaceId}`, {
      method: "POST",
      body: formData,
    });
    setLoading(false);
    if (res.ok) {
      setSelectedFile(null);
      fetchWorkspace();
    }
  }

  // 创建任务
  async function handleCreateJob() {
    const res = await fetch(`/api/jobs/jobs/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workspaceId }),
    });
    if (res.ok) {
      fetchJobs();
    }
  }

  return (
    <div className="p-6 space-y-8">
      <Button variant="link" onClick={() => router.back()}>
        ← 返回
      </Button>
      <h1 className="text-2xl font-bold">工作空间：{workspaceName}</h1>

      {/* 文件上传 */}
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>文件上传</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-center">
            <Input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            />
            <Button onClick={handleUpload} disabled={!selectedFile || loading}>
              上传
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold">已上传文件</h3>
            {files.length === 0 && (
              <p className="text-muted-foreground">暂无文件</p>
            )}
            {files.map((f) => (
              <div
                key={f.id}
                className="flex justify-between items-center border p-2 rounded-md"
              >
                <span>{f.filename}</span>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    await fetch(`/api/file/${f.id}`, { method: "DELETE" });
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

      {/* 任务调度 */}
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>任务调度</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleCreateJob}>创建任务</Button>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold">任务列表</h3>
            {jobs.length === 0 && (
              <p className="text-muted-foreground">暂无任务</p>
            )}
            {jobs.map((j) => (
              <div
                key={j.id}
                className="flex justify-between items-center border p-2 rounded-md"
              >
                <span>{j.id}</span>
                <span className="text-sm text-muted-foreground">
                  {j.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 