import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardApproval } from "@/types/dashboard";
import { formatDistanceToNowStrict } from "@/lib/time";
import { cn } from "@/lib/utils";

const priorityStyles: Record<DashboardApproval["priority"], string> = {
  high: "bg-red-50 text-red-700 border-red-100 dark:bg-red-400/10 dark:text-red-200",
  medium:
    "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-400/10 dark:text-amber-100",
  low: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-400/10 dark:text-emerald-100",
};

const typeLabels: Record<DashboardApproval["type"], string> = {
  merchant: "Đối tác",
  payout: "Chi trả",
  product: "Sản phẩm",
  order: "Đơn hàng",
};

type PendingApprovalsProps = {
  approvals: DashboardApproval[];
};

export function PendingApprovals({ approvals }: PendingApprovalsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Yêu cầu chờ duyệt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {approvals.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border bg-background/70 p-3 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {typeLabels[item.type]} •{" "}
                  {formatDistanceToNowStrict(item.submittedAt)}
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize border",
                  priorityStyles[item.priority]
                )}
              >
                {item.priority}
              </Badge>
            </div>
          </div>
        ))}
        {!approvals.length && (
          <p className="text-sm text-muted-foreground">
            Không có yêu cầu mới.
          </p>
        )}
      </CardContent>
    </Card>
  );
}


