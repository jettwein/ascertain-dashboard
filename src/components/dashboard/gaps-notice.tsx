import type { Snapshot } from "@/lib/types";

interface GapsNoticeProps {
  errors: Snapshot["errors"];
}

/** An errata note — honest about what the snapshot couldn't reach. */
export function GapsNotice({ errors }: GapsNoticeProps) {
  if (errors.length === 0) return null;

  return (
    <section className="flex flex-col gap-2 pt-3" style={{ borderTop: "2px solid var(--st-paused)" }}>
      <h2 className="flex items-center gap-2 font-display text-xl font-medium">
        Data Gaps
        <span className="font-mono text-[11px] font-normal tracking-wide text-muted-foreground tabular-nums">
          {errors.length}
        </span>
      </h2>
      <div className="flex flex-col gap-1.5">
        {errors.map((err) => (
          <div
            key={err.source}
            className="flex flex-wrap items-baseline gap-x-2 border-b border-border/70 py-1.5 last:border-0"
          >
            <code
              className="font-mono text-xs"
              style={{ color: "var(--st-paused)" }}
            >
              {err.source}
            </code>
            <span className="text-xs text-muted-foreground">{err.message}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
