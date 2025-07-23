"use client";

import Link from "next/link";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { MessageCircleCodeIcon } from "lucide-react";
import { memo } from "react";

function PureDashHeader({}: {}) {
  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />
      <Button
        className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 hidden md:flex py-1.5 px-2 h-fit md:h-[34px] order-4 md:ml-auto"
        asChild
      >
        <Link href={`/`} target="_noblank">
          <MessageCircleCodeIcon size={16} />
          ChatBot
        </Link>
      </Button>
    </header>
  );
}

export const DashHeader = memo(PureDashHeader, (prevProps, nextProps) => {
  return prevProps.session === nextProps.session;
});
