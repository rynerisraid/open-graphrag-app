import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

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

export async function GET() {
  return NextResponse.json(g.jobs as Job[]);
}

export async function POST(req: Request) {
  const body = await req.json();
  const job: Job = {
    id: nanoid(),
    workspaceId: body.workspaceId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  g.jobs.push(job);
  return NextResponse.json(job, { status: 201 });
} 