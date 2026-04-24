import { LinearClient } from "@linear/sdk";
import type { LinearIssue, LinearProject } from "../types";

/**
 * Wraps the Linear SDK with the queries the dashboard needs.
 * Auth: LINEAR_API_KEY env var (personal API key from linear.app/settings/api).
 */

function getClient(): LinearClient {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    throw new Error("LINEAR_API_KEY is not set");
  }
  return new LinearClient({ apiKey });
}

const TEAM_KEYS_TO_TRACK = ["EXP", "AUT", "ENG"] as const;

export async function fetchActiveIssues(): Promise<LinearIssue[]> {
  const client = getClient();
  // Pull issues that are actively in flight: started, in review, in QA, etc.
  // "completed"/"canceled" issues are excluded at the filter level.
  const issues = await client.issues({
    first: 100,
    filter: {
      team: { key: { in: [...TEAM_KEYS_TO_TRACK] } },
      state: { type: { in: ["started", "unstarted"] } },
    },
    orderBy: "updatedAt" as never,
  });

  const results: LinearIssue[] = [];
  for (const node of issues.nodes) {
    const [state, assignee, project, team, labels] = await Promise.all([
      node.state,
      node.assignee,
      node.project,
      node.team,
      node.labels(),
    ]);
    results.push({
      id: node.identifier,
      title: node.title,
      url: node.url,
      status: state?.name ?? "Unknown",
      priority: priorityLabel(node.priority),
      assignee: assignee?.name ?? null,
      project: project?.name ?? null,
      labels: labels.nodes.map((l) => l.name),
      updatedAt: node.updatedAt.toISOString(),
      completedAt: node.completedAt?.toISOString() ?? null,
    });
    // Keep team reference alive for type checker (suppress unused warning).
    void team;
  }
  return results;
}

export async function fetchProjects(): Promise<LinearProject[]> {
  const client = getClient();
  const projects = await client.projects({ first: 50 });
  const results: LinearProject[] = [];
  for (const node of projects.nodes) {
    const [status, lead, teams] = await Promise.all([
      node.status,
      node.lead,
      node.teams(),
    ]);
    results.push({
      id: node.id,
      name: node.name,
      url: node.url,
      status: status?.name ?? "Unknown",
      priority: priorityLabel(node.priority),
      startDate: node.startDate ? String(node.startDate) : null,
      targetDate: node.targetDate ? String(node.targetDate) : null,
      lead: lead?.name ?? null,
      teamKeys: teams.nodes.map((t) => t.key),
      summary: node.description ?? null,
    });
  }
  return results;
}

function priorityLabel(p: number | null | undefined): string | undefined {
  if (p == null) return undefined;
  return (
    {
      0: "None",
      1: "Urgent",
      2: "High",
      3: "Medium",
      4: "Low",
    } as Record<number, string>
  )[p];
}
