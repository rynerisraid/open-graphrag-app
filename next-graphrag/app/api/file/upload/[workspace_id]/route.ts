import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

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

export async function POST(
  req: Request,
  { params }: { params: { workspace_id: string } }
) {
  const formData = await req.formData();
  const file = formData.get("file") as any;
  const ws: Workspace | undefined = (g.workspaces as Workspace[]).find(
    (w) => w.id === params.workspace_id
  );
  if (!ws) return NextResponse.json({ message: "Workspace not found" }, { status: 404 });
  if (!file) return NextResponse.json({ message: "No file" }, { status: 400 });

  const newFile = { id: nanoid(), filename: file.name };
  ws.files.push(newFile);
  return NextResponse.json(newFile, { status: 201 });
} 