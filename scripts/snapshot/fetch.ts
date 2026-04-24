/**
 * Fetches a fresh dashboard snapshot from Linear, Notion, and Slack and
 * writes it to data/snapshot.json.
 *
 * Run locally:   npm run snapshot
 * Run in CI:     same, with secrets supplied as env vars
 *
 * The script is intentionally tolerant: if one source fails, we still write
 * a snapshot with an `errors` array so the dashboard can display what we
 * did get.
 */

import { fetchActiveIssues, fetchProjects } from "../../src/lib/sources/linear";
import {
  TEAM_CHANNELS,
  fetchRecentMessagesByChannel,
} from "../../src/lib/sources/slack";
import { fetchCuratedDocs } from "../../src/lib/sources/notion";
import { writeSnapshot } from "../../src/lib/snapshot";
import type { Snapshot, TeamKey, TeamSection } from "../../src/lib/types";

const TEAMS: Array<{
  key: TeamKey;
  displayName: string;
  linearTeamKey: string | null;
}> = [
  { key: "expansion", displayName: "Expansion", linearTeamKey: "EXP" },
  { key: "automation", displayName: "Automation", linearTeamKey: "AUT" },
  { key: "platform", displayName: "Platform", linearTeamKey: null },
];

async function safe<T>(
  source: string,
  fn: () => Promise<T>,
  fallback: T,
  errors: Array<{ source: string; message: string }>,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const message = (err as Error).message ?? String(err);
    console.warn(`[${source}] failed: ${message}`);
    errors.push({ source, message });
    return fallback;
  }
}

async function main() {
  const errors: Array<{ source: string; message: string }> = [];

  const [issues, projects, docs] = await Promise.all([
    safe("linear.issues", fetchActiveIssues, [], errors),
    safe("linear.projects", fetchProjects, [], errors),
    safe("notion.docs", fetchCuratedDocs, [], errors),
  ]);

  const teams: TeamSection[] = await Promise.all(
    TEAMS.map(async (team) => {
      const channelName = TEAM_CHANNELS[team.key];
      const recentMessages = channelName
        ? await safe(
            `slack.${team.key}`,
            () => fetchRecentMessagesByChannel(channelName, 20),
            [],
            errors,
          )
        : [];
      const activeIssues = team.linearTeamKey
        ? issues.filter((i) => i.id.startsWith(`${team.linearTeamKey}-`))
        : [];
      return {
        key: team.key,
        displayName: team.displayName,
        linearTeamKey: team.linearTeamKey,
        activeIssues,
        recentMessages,
        slackChannel: channelName,
      };
    }),
  );

  const snapshot: Snapshot = {
    generatedAt: new Date().toISOString(),
    teams,
    projects,
    keyDocs: docs,
    errors,
  };

  await writeSnapshot(snapshot);
  console.log(
    `Snapshot written: ${snapshot.teams.length} teams, ${snapshot.projects.length} projects, ${snapshot.keyDocs.length} docs, ${snapshot.errors.length} errors`,
  );
}

main().catch((err) => {
  console.error("Snapshot fetcher crashed:", err);
  process.exit(1);
});
