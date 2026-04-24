/**
 * Shared types for the Ascertain dashboard snapshot.
 *
 * A snapshot is a single JSON document produced periodically by the fetcher
 * script. The Next.js app reads it (via `lib/snapshot.ts`) and renders the
 * dashboard. Keep this file stable — the shape is the contract between the
 * fetcher and the UI.
 */

export type TeamKey = "expansion" | "automation" | "platform";

export interface LinearIssue {
  id: string; // e.g. "EXP-211"
  title: string;
  url: string;
  status: string;
  priority?: string;
  assignee: string | null;
  project: string | null;
  labels: string[];
  updatedAt: string; // ISO
  completedAt: string | null;
}

export interface LinearProject {
  id: string;
  name: string;
  url: string;
  status: string; // "In Progress", "Backlog", "Completed", ...
  priority?: string;
  startDate: string | null;
  targetDate: string | null;
  lead: string | null;
  teamKeys: string[]; // Linear team keys, e.g. ["EXP", "ENG"]
  summary: string | null;
}

export interface SlackMessage {
  ts: string;
  user: string | null;
  text: string;
  channel: string; // channel name, e.g. "team-expand"
  permalink?: string;
}

export interface TeamSection {
  key: TeamKey;
  displayName: string;
  linearTeamKey: string | null; // null for Platform until we create a team
  activeIssues: LinearIssue[];
  recentMessages: SlackMessage[];
  slackChannel: string | null;
}

export interface NotionDocLink {
  id: string;
  title: string;
  url: string;
  lastEdited: string;
}

export interface Snapshot {
  generatedAt: string; // ISO timestamp
  teams: TeamSection[];
  projects: LinearProject[];
  keyDocs: NotionDocLink[];
  errors: Array<{ source: string; message: string }>;
}
