/**
 * Presentation helpers for the dashboard UI. Pure functions only — no I/O.
 * These translate raw snapshot values (statuses, priorities, dates) into the
 * labels, ordering, and color tokens the components render.
 */

import type { LinearIssue, LinearProject } from "./types";

/** Maps a status to a CSS custom property holding its color (see globals.css). */
const STATUS_VAR: Record<string, string> = {
  // Issue workflow states
  Todo: "--st-todo",
  "In Progress": "--st-progress",
  "In Review": "--st-review",
  "Needs QA": "--st-qa",
  // Project states
  Backlog: "--st-todo",
  Planned: "--st-planned",
  Discovery: "--st-discovery",
  Paused: "--st-paused",
  Completed: "--st-done",
  Accepted: "--st-done",
};

/** Returns a `var(--st-*)` color reference for inline `style`. */
export function statusColor(status: string): string {
  return `var(${STATUS_VAR[status] ?? "--st-todo"})`;
}

/** Ordering for issue workflow columns, most-active first. */
const ISSUE_STATUS_ORDER = ["In Progress", "In Review", "Needs QA", "Todo"];

/** Ordering for project columns, most-active first. */
export const PROJECT_STATUS_ORDER = [
  "In Progress",
  "Discovery",
  "Planned",
  "Paused",
  "Backlog",
  "Accepted",
  "Completed",
];

const PRIORITY_RANK: Record<string, number> = {
  Urgent: 0,
  High: 1,
  Medium: 2,
  Low: 3,
  None: 4,
};

export function priorityRank(priority?: string): number {
  return PRIORITY_RANK[priority ?? "None"] ?? 4;
}

/** Badge variant for a priority label. */
export function priorityVariant(
  priority?: string
): "destructive" | "secondary" | "outline" {
  if (priority === "Urgent" || priority === "High") return "destructive";
  if (priority === "Medium") return "secondary";
  return "outline";
}

/** Count issues by status, returned in workflow order. */
export function issueStatusBreakdown(
  issues: LinearIssue[]
): Array<{ status: string; count: number }> {
  const counts = new Map<string, number>();
  for (const issue of issues) {
    counts.set(issue.status, (counts.get(issue.status) ?? 0) + 1);
  }
  return ISSUE_STATUS_ORDER.filter((s) => counts.has(s))
    .concat([...counts.keys()].filter((s) => !ISSUE_STATUS_ORDER.includes(s)))
    .map((status) => ({ status, count: counts.get(status) ?? 0 }));
}

/** Sort issues for display: priority first, then most recently updated. */
export function sortIssues(issues: LinearIssue[]): LinearIssue[] {
  return [...issues].sort((a, b) => {
    const p = priorityRank(a.priority) - priorityRank(b.priority);
    if (p !== 0) return p;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

/** Group projects by status into ordered columns, dropping empty ones. */
export function projectsByStatus(
  projects: LinearProject[]
): Array<{ status: string; projects: LinearProject[] }> {
  const groups = new Map<string, LinearProject[]>();
  for (const project of projects) {
    const list = groups.get(project.status) ?? [];
    list.push(project);
    groups.set(project.status, list);
  }
  const ordered = PROJECT_STATUS_ORDER.filter((s) => groups.has(s)).concat(
    [...groups.keys()].filter((s) => !PROJECT_STATUS_ORDER.includes(s))
  );
  return ordered.map((status) => ({
    status,
    projects: groups.get(status) ?? [],
  }));
}

/** "Apr 24, 2026" — stable across server render (no locale/timezone drift). */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** "Jun 4, 2026, 8:56 PM UTC" for the snapshot timestamp. */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

/** Whole-day age of the snapshot, for the freshness indicator. */
export function daysAgo(iso: string, now: string): number {
  const ms = new Date(now).getTime() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}
