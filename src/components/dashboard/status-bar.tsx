import { statusColor } from "@/lib/dashboard";

interface StatusBarProps {
  breakdown: Array<{ status: string; count: number }>;
  total: number;
}

/** A thin segmented bar showing the proportion of issues in each status. */
export function StatusBar({ breakdown, total }: StatusBarProps) {
  if (total === 0) return null;

  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
      {breakdown.map(({ status, count }) => (
        <div
          key={status}
          style={{
            width: `${(count / total) * 100}%`,
            backgroundColor: statusColor(status),
          }}
          title={`${status}: ${count}`}
        />
      ))}
    </div>
  );
}
