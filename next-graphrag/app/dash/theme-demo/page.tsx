"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeDemo() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">后台管理系统组件演示</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
          <span className="sr-only">切换主题</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>按钮</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>默认按钮</Button>
            <Button variant="outline">轮廓按钮</Button>
            <Button variant="secondary">次要按钮</Button>
            <Button variant="destructive">危险按钮</Button>
            <Button variant="ghost">幽灵按钮</Button>
            <Button variant="link">链接按钮</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>输入框</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Input placeholder="默认输入框" />
            <Input type="email" placeholder="邮箱输入框" />
            <Input type="password" placeholder="密码输入框" />
            <Input disabled placeholder="禁用的输入框" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>标题示例</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">H1 标题</h1>
            <h2 className="text-2xl font-semibold">H2 标题</h2>
            <h3 className="text-xl font-medium">H3 标题</h3>
            <h4 className="text-lg font-normal">H4 标题</h4>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
