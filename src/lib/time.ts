const rtf = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });

const UNITS = [
  { unit: "day", ms: 1000 * 60 * 60 * 24 },
  { unit: "hour", ms: 1000 * 60 * 60 },
  { unit: "minute", ms: 1000 * 60 },
];

export function formatDistanceToNowStrict(
  value: string | number | Date
): string {
  const target = new Date(value).getTime();
  const diff = target - Date.now();

  for (const { unit, ms } of UNITS) {
    if (Math.abs(diff) >= ms || unit === "minute") {
      const amount = Math.round(diff / ms);
      return rtf.format(amount, unit as Intl.RelativeTimeFormatUnit);
    }
  }

  return rtf.format(0, "minute");
}


