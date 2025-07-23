"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function SectionCards() {
  const cards = [
    { title: "工作空间", value: 12 },
    { title: "上传文件", value: 56 },
    { title: "运行任务", value: 8 },
    { title: "团队成员", value: 4 },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 px-4 lg:grid-cols-4 lg:px-6">
      {cards.map((c) => (
        <Card key={c.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {c.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{c.value}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChartAreaInteractive() {
  return (
    <Card className="h-64">
      <CardHeader>
        <CardTitle>统计图表（占位）</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full text-muted-foreground">
        数据可视化区域
      </CardContent>
    </Card>
  );
}

function DataTable() {
  const rows = Array.from({ length: 5 }).map((_, i) => ({
    id: i + 1,
    name: `示例项 ${i + 1}`,
    status: i % 2 === 0 ? "完成" : "进行中",
  }));
  return (
    <Card className="px-4 lg:px-6">
      <CardHeader>
        <CardTitle>最新记录</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">ID</th>
              <th>名称</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b last:border-none">
                <td className="py-2">{r.id}</td>
                <td>{r.name}</td>
                <td>
                  <span
                    className={cn(
                      "inline-block rounded px-2 py-0.5 text-xs",
                      r.status === "完成"
                        ? "bg-green-500/10 text-green-700 dark:text-green-400"
                        : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                    )}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable />
        </div>
      </div>
    </div>
  );
}
