import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DashboardOrder } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const statusStyles: Record<
  DashboardOrder["status"],
  string
> = {
  completed:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-200",
  processing:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/40 dark:bg-blue-400/10 dark:text-blue-200",
  pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-200",
  failed:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-400/40 dark:bg-red-400/10 dark:text-red-200",
};

type RecentOrdersProps = {
  orders: DashboardOrder[];
};

export function RecentOrdersTable({ orders }: RecentOrdersProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Hoạt động gần đây
        </p>
        <h2 className="text-xl font-semibold">Đơn hàng mới nhất</h2>
      </div>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="text-xs uppercase tracking-wide text-muted-foreground">
              <TableHead>Mã đơn</TableHead>
              <TableHead>Đối tác</TableHead>
              <TableHead className="text-right">Giá trị</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">{order.id}</TableCell>
                <TableCell>{order.partner}</TableCell>
                <TableCell className="text-right font-semibold">
                  {currencyFormatter.format(order.total)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      statusStyles[order.status] ?? statusStyles.pending
                    )}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("vi-VN", {
                    hour12: false,
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


