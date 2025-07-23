import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  files: { id: string; filename: string }[];
}

// 使用全局变量在开发环境中持久化内存数据
const g = globalThis as any;
if (!g.workspaces) {
  g.workspaces = [] as Workspace[];
}

export async function GET() {
  return NextResponse.json(g.workspaces as Workspace[]);
}

export async function POST(req: Request) {
  const body = await req.json();
  const ws: Workspace = {
    id: nanoid(),
    name: body.name ?? "未命名",
    createdAt: new Date().toISOString(),
    files: [],
  };
  g.workspaces.push(ws);
  return NextResponse.json(ws, { status: 201 });
} 