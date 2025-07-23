"use client";

import type { User } from "next-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { NavMain } from "@/components/nav-main";
import { NavDocuments } from "@/components/nav-documents";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";

// Lucide icons
import {
  LayoutDashboardIcon,
  ListTodoIcon,
  BarChart3Icon,
  FolderIcon,
  UsersIcon,
  DatabaseIcon,
  FileBarChart2Icon,
  FileTextIcon,
  SettingsIcon,
  HelpCircleIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react";

export function DashSidebar({ user }: { user: User | undefined }) {
  const data = {
    user: {
      name: user?.name ?? "Guest",
      email: user?.email ?? "guest@example.com",
      avatar: user?.image ?? "/avatars/shadcn.jpg",
    },
    navMain: [
      { title: "总览", url: "/dash", icon: LayoutDashboardIcon },
      { title: "工作空间", url: "/dash/workspace", icon: FolderIcon },
      { title: "数据分析", url: "#", icon: BarChart3Icon },
      { title: "任务列表", url: "#", icon: ListTodoIcon },
      { title: "团队", url: "#", icon: UsersIcon },
    ],
    documents: [
      { name: "数据仓库", url: "#", icon: DatabaseIcon },
      { name: "报告", url: "#", icon: FileBarChart2Icon },
      { name: "文档", url: "#", icon: FileTextIcon },
    ],
    navSecondary: [
      { title: "设置", url: "#", icon: SettingsIcon },
      { title: "帮助", url: "#", icon: HelpCircleIcon },
      { title: "搜索", url: "#", icon: SearchIcon },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" className="group-data-[side=left]:border-r-0">
      {/* 顶部品牌 */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/dash" className="flex items-center gap-2">
                <SparklesIcon className="size-5 text-primary" />
                <span className="text-base font-semibold">Open Graphrag</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* 主体导航 */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      {/* 用户信息 */}
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
