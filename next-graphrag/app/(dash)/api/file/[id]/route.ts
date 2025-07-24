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

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  let found = false;
  (g.workspaces as Workspace[]).forEach((ws: Workspace) => {
    const before = ws.files.length;
    ws.files = ws.files.filter((f) => f.id !== params.id);
    if (ws.files.length !== before) found = true;
  });
  if (!found) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({}, { status: 204 });
} 