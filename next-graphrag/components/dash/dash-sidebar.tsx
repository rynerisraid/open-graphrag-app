"use client";

import type { User } from "next-auth";
import { useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export function DashSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link href="/dash" className="flex flex-row gap-3 items-center">
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                Dashboard
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    router.push("/dash");
                    router.refresh();
                  }}
                >
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Toggle sidebar</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  );
}
