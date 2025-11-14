export type DashboardStatFormat = "currency" | "number" | "percent";

export type DashboardStat = {
  key: string;
  label: string;
  value: number;
  change: number;
  format: DashboardStatFormat;
  trendLabel?: string;
};

export type OrderStatus = "pending" | "processing" | "completed" | "failed";

export type DashboardOrder = {
  id: string;
  partner: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export type ApprovalType = "merchant" | "product" | "payout" | "order";
export type ApprovalPriority = "high" | "medium" | "low";

export type DashboardApproval = {
  id: string;
  name: string;
  type: ApprovalType;
  submittedAt: string;
  priority: ApprovalPriority;
};

export type ApiHealth = {
  uptime: number;
  avgLatency: number;
  errorRate: number;
};

export type DashboardData = {
  stats: DashboardStat[];
  recentOrders: DashboardOrder[];
  approvals: DashboardApproval[];
  apiHealth: ApiHealth;
  lastSyncedAt: string;
};


