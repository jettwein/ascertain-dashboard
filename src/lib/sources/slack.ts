import { WebClient } from "@slack/web-api";
import type { SlackMessage } from "../types";

/**
 * Slack data source.
 * Auth: SLACK_BOT_TOKEN env var (xoxb-... token from a Slack app with
 * channels:history, groups:history, users:read scopes).
 *
 * For each channel, we pull the most recent N messages and return them in
 * the snapshot. The UI trims further if needed.
 */

function getClient(): WebClient {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    throw new Error("SLACK_BOT_TOKEN is not set");
  }
  return new WebClient(token);
}

export const TEAM_CHANNELS: Record<string, string | null> = {
  expansion: "team-expand",
  automation: "team-autobots",
  platform: null, // no dedicated channel yet
};

export async function fetchRecentMessagesByChannel(
  channelName: string,
  limit = 20,
): Promise<SlackMessage[]> {
  const client = getClient();

  // Resolve channel name -> ID.
  const list = await client.conversations.list({
    types: "public_channel,private_channel",
    limit: 1000,
  });
  const channel = list.channels?.find((c) => c.name === channelName);
  if (!channel?.id) {
    throw new Error(`Slack channel not found: ${channelName}`);
  }

  const history = await client.conversations.history({
    channel: channel.id,
    limit,
  });

  // Resolve user IDs -> display names in bulk.
  const userIds = Array.from(
    new Set(
      (history.messages ?? [])
        .map((m) => m.user)
        .filter((id): id is string => Boolean(id)),
    ),
  );
  const userMap = new Map<string, string>();
  for (const uid of userIds) {
    try {
      const info = await client.users.info({ user: uid });
      userMap.set(uid, info.user?.real_name ?? info.user?.name ?? uid);
    } catch {
      userMap.set(uid, uid);
    }
  }

  return (history.messages ?? [])
    .filter((m) => m.type === "message" && !m.subtype) // skip join/leave noise
    .map((m) => ({
      ts: m.ts ?? "",
      user: m.user ? (userMap.get(m.user) ?? null) : null,
      text: m.text ?? "",
      channel: channelName,
    }));
}
