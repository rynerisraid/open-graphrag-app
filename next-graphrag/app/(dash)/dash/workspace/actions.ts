// 新建，封装 Workspace 相关 API 调用，所有客户端组件可复用
"use client";
import type { Session } from "next-auth";

export interface Workspace {
    id: string;
    name: string;
    createdAt?: string;
    description?: string | null;
}

export interface FileItem {
    id: string;
    filename: string;
}

export interface JobItem {
    id: string;
    status: string;
    workspaceId: string;
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL as string;

function getAuthHeaders(session: Session | null): HeadersInit {
    const token = (session as any)?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function listWorkspaces(session: Session | null): Promise<Workspace[]> {
    const res = await fetch(`${apiBase}/workspace?skip=0&limit=100`, {
        headers: getAuthHeaders(session),
    });
    if (!res.ok) throw new Error("Failed to list workspaces");
    return res.json();
}

export async function createWorkspace(name: string, session: Session | null) {
    const res = await fetch(`${apiBase}/workspace`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(session),
        },
        body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to create workspace");
    return res.json();
}

export async function deleteWorkspace(id: string, session: Session | null) {
    const res = await fetch(`${apiBase}/workspace/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(session),
    });
    if (!res.ok) throw new Error("Failed to delete workspace");
    return res.json();
}

export async function getWorkspace(id: string, session: Session | null) {
    const res = await fetch(`${apiBase}/workspace/${id}`, {
        headers: getAuthHeaders(session),
    });
    if (!res.ok) throw new Error("Failed to get workspace");
    return res.json();
}

export async function listJobs(session: Session | null): Promise<JobItem[]> {
    const res = await fetch(`${apiBase}/jobs/jobs/`, {
        headers: getAuthHeaders(session),
    });
    if (!res.ok) throw new Error("Failed to list jobs");
    return res.json();
}

export async function uploadFile(workspaceId: string, file: File, session: Session | null) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${apiBase}/file/upload/${workspaceId}`, {
        method: "POST",
        headers: getAuthHeaders(session),
        body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload file");
    return res.json();
}

export async function deleteFile(fileId: string, session: Session | null) {
    const res = await fetch(`${apiBase}/file/${fileId}`, {
        method: "DELETE",
        headers: getAuthHeaders(session),
    });
    if (!res.ok) throw new Error("Failed to delete file");
    return res.json();
}

export async function createJob(workspaceId: string, session: Session | null) {
    const res = await fetch(`${apiBase}/jobs/jobs/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(session),
        },
        body: JSON.stringify({ workspaceId }),
    });
    if (!res.ok) throw new Error("Failed to create job");
    return res.json();
}

// 更新 Workspace 名称
export async function updateWorkspace(id: string, name: string, session: Session | null) {
    const res = await fetch(`${apiBase}/workspace/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(session),
        },
        body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to update workspace");
    return res.json();
} 