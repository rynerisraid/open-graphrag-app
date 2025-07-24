import { NextResponse } from "next/server";

interface Job {
  id: string;
  workspaceId: string;
  status: string;
  createdAt: string;
}

const g = globalThis as any;
if (!g.jobs) {
  g.jobs = [] as Job[];
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const job = (g.jobs as Job[]).find((j) => j.id === params.id);
  if (!job) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(job);
} 