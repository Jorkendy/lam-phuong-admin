import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ApiHealth } from "@/types/dashboard";
import { CircleAlert, Server } from "lucide-react";

type ApiHealthCardProps = {
  health: ApiHealth;
};

export function ApiHealthCard({ health }: ApiHealthCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Tình trạng API</CardTitle>
        <Server className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-xs text-muted-foreground">Uptime</p>
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>{health.uptime.toFixed(2)}%</span>
            <span className="text-muted-foreground">99.9% mục tiêu</span>
          </div>
          <Progress value={health.uptime} className="mt-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg border bg-background/70 p-3">
            <p className="text-xs text-muted-foreground">Độ trễ TB</p>
            <p className="text-lg font-semibold">{health.avgLatency} ms</p>
          </div>
          <div className="rounded-lg border bg-background/70 p-3">
            <p className="text-xs text-muted-foreground">Tỷ lệ lỗi</p>
            <p className="text-lg font-semibold">{health.errorRate}%</p>
          </div>
        </div>

        {health.errorRate > 0.5 && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-400/50 dark:bg-amber-400/10 dark:text-amber-100">
            <CircleAlert className="h-4 w-4 shrink-0" />
            <p>Phát hiện tỷ lệ lỗi tăng. Hãy kiểm tra logs của lam-phuong-api.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


