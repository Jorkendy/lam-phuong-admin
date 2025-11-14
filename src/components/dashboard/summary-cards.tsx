import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStat } from "@/types/dashboard";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type SummaryCard = DashboardStat & {
  icon: LucideIcon;
};

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
});

function formatValue(stat: DashboardStat) {
  switch (stat.format) {
    case "currency":
      return currencyFormatter.format(stat.value);
    case "percent":
      return `${stat.value.toFixed(1)}%`;
    default:
      return numberFormatter.format(stat.value);
  }
}

export function SummaryCards({ cards }: { cards: SummaryCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isPositive = card.change >= 0;
        const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

        return (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(card)}</div>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <TrendIcon
                  className={`h-3.5 w-3.5 ${
                    isPositive ? "text-emerald-500" : "text-red-500"
                  }`}
                />
                <span
                  className={`font-medium ${
                    isPositive ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {card.change.toFixed(1)}%
                </span>
                <span>{card.trendLabel || "vs kỳ trước"}</span>
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


