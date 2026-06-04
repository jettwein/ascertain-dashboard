import { IssueRow } from "./issue-row";
import { StatusBar } from "./status-bar";
import { issueStatusBreakdown, sortIssues, statusColor } from "@/lib/dashboard";
import type { TeamSection } from "@/lib/types";

interface TeamCardProps {
  team: TeamSection;
  /** How many issues to list before collapsing into a "+N more" line. */
  limit?: number;
}

export function TeamCard({ team, limit = 6 }: TeamCardProps) {
  const total = team.activeIssues.length;
  const breakdown = issueStatusBreakdown(team.activeIssues);
  const sorted = sortIssues(team.activeIssues);
  const visible = sorted.slice(0, limit);
  const remaining = sorted.length - visible.length;

  return (
    <section className="rule-top flex flex-col gap-3 pt-3">
      <header className="flex items-baseline justify-between gap-2">
        <h3 className="font-display text-xl leading-none font-medium">
          {team.displayName}
        </h3>
        <span className="font-mono text-[11px] tracking-wide text-muted-foreground tabular-nums">
          {total > 0 ? `${total} ACTIVE` : "QUIET"}
        </span>
      </header>

      {total === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">
          No active issues tracked
          {team.linearTeamKey ? "." : " — no Linear team yet."}
        </p>
      ) : (
        <>
          <StatusBar breakdown={breakdown} total={total} />

          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {breakdown.map(({ status, count }) => (
              <span
                key={status}
                className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground"
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: statusColor(status) }}
                  aria-hidden
                />
                {status}
                <span className="font-medium text-foreground tabular-nums">
                  {count}
                </span>
              </span>
            ))}
          </div>

          <div className="mt-1 flex flex-col">
            {visible.map((issue) => (
              <IssueRow key={issue.id} issue={issue} />
            ))}
          </div>

          {remaining > 0 && (
            <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
              + {remaining} more
            </p>
          )}
        </>
      )}
    </section>
  );
}
