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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <DashSidebar user={currentUser} />
      <SidebarInset>
        <DashHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
      {/* <SidebarInset>
        <div className="flex flex-col min-w-0 h-dvh bg-background">
          <DashHeader />
          {children}
        </div>
      </SidebarInset> */}
    </SidebarProvider>
  );
}
