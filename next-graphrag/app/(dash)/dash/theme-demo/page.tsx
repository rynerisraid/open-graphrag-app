"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
// 统一的卡片发光样式
const cardGlowClass =
  "shadow-lg ring-1 ring-primary/10 hover:ring-primary/40 hover:shadow-xl transition-shadow";

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

      <Card className={cardGlowClass}>
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

      <Card className={cardGlowClass}>
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

      <Card className={cardGlowClass}>
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

      {/* Alert Dialog 示例 */}
      <Card className={cardGlowClass}>
        <CardHeader>
          <CardTitle>对话框（AlertDialog）</CardTitle>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">删除数据</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>你确定要删除吗？</AlertDialogTitle>
                <AlertDialogDescription>
                  此操作无法撤销，将永久删除服务器上的相关数据。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction>确认删除</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* DropdownMenu 示例 */}
      <Card className={cardGlowClass}>
        <CardHeader>
          <CardTitle>下拉菜单（DropdownMenu）</CardTitle>
        </CardHeader>
        <CardContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">打开菜单</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>操作</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => alert("编辑")}>编辑</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => alert("复制")}>复制</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => alert("分享")}>分享</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onSelect={() => alert("删除")}
              >
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      {/* Select 示例 */}
      <Card className={cardGlowClass}>
        <CardHeader>
          <CardTitle>选择器（Select）</CardTitle>
        </CardHeader>
        <CardContent>
          <Select defaultValue="react">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择框架" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="vue">Vue</SelectItem>
              <SelectItem value="svelte">Svelte</SelectItem>
              <SelectItem value="solid">Solid</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Textarea 示例 */}
      <Card className={cardGlowClass}>
        <CardHeader>
          <CardTitle>文本区域（Textarea）</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea rows={4} placeholder="请输入多行文本..." />
        </CardContent>
      </Card>

      {/* Tooltip 与 Separator 示例 */}
      <Card className={cardGlowClass}>
        <CardHeader>
          <CardTitle>提示（Tooltip）与分割线（Separator）</CardTitle>
        </CardHeader>
        <CardContent>
          <TooltipProvider delayDuration={0}>
            <div className="flex items-center space-x-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">悬停查看提示</Button>
                </TooltipTrigger>
                <TooltipContent>这里是一段提示文字</TooltipContent>
              </Tooltip>
              <Separator orientation="vertical" className="h-6" />
              <span>与分割线隔开的文字</span>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Skeleton 示例 */}
      <Card className={cardGlowClass}>
        <CardHeader>
          <CardTitle>骨架屏（Skeleton）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>

      {/* 侧边抽屉（Sheet）示例 */}
      <Card className={cardGlowClass}>
        <CardHeader>
          <CardTitle>侧边抽屉（Sheet）</CardTitle>
        </CardHeader>
        <CardContent>
          <Sheet>
            <SheetTrigger asChild>
              <Button>打开侧边抽屉</Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>侧边抽屉标题</SheetTitle>
              </SheetHeader>
              <div className="p-4 space-y-2 text-sm">
                <p>你可以在这里放置表单、导航或其他内容。</p>
                <p>这是一个从右侧滑入的抽屉组件示例。</p>
              </div>
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>
    </div>
  );
}
