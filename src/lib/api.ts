import type { DashboardData } from "@/types/dashboard";

const API_BASE_URL = process.env.NEXT_PUBLIC_LP_API_URL;

const FALLBACK_DASHBOARD: DashboardData = {
  stats: [
    {
      key: "revenue",
      label: "Tổng doanh thu",
      value: 128_450_000,
      change: 12.4,
      format: "currency",
      trendLabel: "so với tuần trước",
    },
    {
      key: "orders",
      label: "Đơn hàng mới",
      value: 214,
      change: 8.1,
      format: "number",
      trendLabel: "7 ngày qua",
    },
    {
      key: "partners",
      label: "Đối tác đang hoạt động",
      value: 47,
      change: 4.3,
      format: "number",
      trendLabel: "đang online",
    },
    {
      key: "payouts",
      label: "Đơn chờ xử lý",
      value: 32,
      change: -5.6,
      format: "number",
      trendLabel: "ưu tiên trong ngày",
    },
  ],
  recentOrders: [
    {
      id: "ORD-2094",
      partner: "Nhà thuốc Lâm Phượng",
      total: 1_250_000,
      status: "processing",
      createdAt: "2025-11-14T02:45:00.000Z",
    },
    {
      id: "ORD-2095",
      partner: "Clinic Hạnh Phúc",
      total: 3_940_000,
      status: "completed",
      createdAt: "2025-11-14T01:12:00.000Z",
    },
    {
      id: "ORD-2096",
      partner: "Tiệm thuốc An Khang",
      total: 860_000,
      status: "pending",
      createdAt: "2025-11-13T23:33:00.000Z",
    },
    {
      id: "ORD-2097",
      partner: "Khoa Dược Minh Tâm",
      total: 5_420_000,
      status: "failed",
      createdAt: "2025-11-13T20:05:00.000Z",
    },
  ],
  approvals: [
    {
      id: "APR-811",
      name: "Xuất kho đơn hàng ORD-2098",
      type: "order",
      priority: "high",
      submittedAt: "2025-11-14T01:30:00.000Z",
    },
    {
      id: "APR-812",
      name: "Đăng ký đối tác Kim Ngân",
      type: "merchant",
      priority: "medium",
      submittedAt: "2025-11-13T18:10:00.000Z",
    },
    {
      id: "APR-813",
      name: "Lệnh chi trả tháng 11",
      type: "payout",
      priority: "low",
      submittedAt: "2025-11-13T15:55:00.000Z",
    },
  ],
  apiHealth: {
    uptime: 99.4,
    avgLatency: 182,
    errorRate: 0.4,
  },
  lastSyncedAt: "2025-11-14T02:50:00.000Z",
};

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    if (!API_BASE_URL) {
      return FALLBACK_DASHBOARD;
    }

    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to load dashboard (${response.status})`);
    }

    const payload = (await response.json()) as Partial<DashboardData>;

    return {
      stats: payload.stats ?? FALLBACK_DASHBOARD.stats,
      recentOrders: payload.recentOrders ?? FALLBACK_DASHBOARD.recentOrders,
      approvals: payload.approvals ?? FALLBACK_DASHBOARD.approvals,
      apiHealth: payload.apiHealth ?? FALLBACK_DASHBOARD.apiHealth,
      lastSyncedAt: payload.lastSyncedAt ?? FALLBACK_DASHBOARD.lastSyncedAt,
    };
  } catch (error) {
    console.error("fetchDashboardData error", error);
    return FALLBACK_DASHBOARD;
  }
}


