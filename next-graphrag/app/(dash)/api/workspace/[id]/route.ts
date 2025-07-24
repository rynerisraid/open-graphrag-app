import { NextResponse } from "next/server";

interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  files: { id: string; filename: string }[];
}

const g = globalThis as any;
if (!g.workspaces) {
  g.workspaces = [] as Workspace[];
}

function findWorkspace(id: string) {
  return (g.workspaces as Workspace[]).find((w) => w.id === id);
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const ws = findWorkspace(params.id);
  if (!ws) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(ws);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const ws = findWorkspace(params.id);
  if (!ws) return NextResponse.json({ message: "Not found" }, { status: 404 });
  ws.name = body.name ?? ws.name;
  return NextResponse.json(ws);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  g.workspaces = (g.workspaces as Workspace[]).filter((w) => w.id !== params.id);
  return NextResponse.json({}, { status: 204 });
} 