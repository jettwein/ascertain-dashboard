interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
}

/** One figure in the masthead stats strip — big serif numeral, mono label. */
export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="flex flex-col gap-2 px-5 first:pl-0 last:pr-0">
      <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="font-display text-5xl leading-none font-light text-foreground tabular-nums">
        {value}
      </span>
      {hint && (
        <span className="font-mono text-[11px] tracking-wide text-muted-foreground">
          {hint}
        </span>
      )}
    </div>
  );
}
