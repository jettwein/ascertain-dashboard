import { statusColor } from "@/lib/dashboard";
import type { LinearIssue } from "@/lib/types";

interface IssueRowProps {
  issue: LinearIssue;
}

export function IssueRow({ issue }: IssueRowProps) {
  const urgent = issue.priority === "Urgent";
  const high = issue.priority === "High";

  return (
    <a
      href={issue.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 border-b border-border/70 py-2 transition-colors last:border-0 hover:bg-foreground/[0.025]"
    >
      <span
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: statusColor(issue.status) }}
        aria-hidden
      />
      <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums transition-colors group-hover:text-signal">
        {issue.id}
      </span>
      <span className="flex-1 truncate text-sm text-foreground/90">
        {issue.title}
      </span>
      {(urgent || high) && (
        <span
          className="shrink-0 font-mono text-[10px] font-medium tracking-[0.12em] uppercase"
          style={{ color: "var(--destructive)" }}
        >
          {urgent ? "● Urgent" : "High"}
        </span>
      )}
      {issue.assignee && (
        <span className="hidden w-16 shrink-0 truncate text-right text-xs text-muted-foreground sm:inline">
          {issue.assignee.split(" ")[0]}
        </span>
      )}
    </a>
  );
}
