"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashSidebar } from "@/components/dash/dash-sidebar";
import { useSession } from "next-auth/react";
import { DashHeader } from "@/components/dash/dash-header";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  // 使用会话中的用户信息
  const currentUser = session.data?.user;

  return (
    <SidebarProvider>
      <DashSidebar user={currentUser} />
      <SidebarInset>
        <div className="flex flex-col min-w-0 h-dvh bg-background">
          <DashHeader />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
