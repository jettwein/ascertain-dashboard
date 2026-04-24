import { Client } from "@notionhq/client";
import type { NotionDocLink } from "../types";

/**
 * Notion data source — lightweight.
 * For v1 we just surface a small, curated set of doc links (team roadmaps,
 * cycle planning). We can deepen this later to pull in page content.
 *
 * Auth: NOTION_API_KEY env var (internal integration token). The integration
 * must have access to the relevant pages.
 */

function getClient(): Client {
  const auth = process.env.NOTION_API_KEY;
  if (!auth) {
    throw new Error("NOTION_API_KEY is not set");
  }
  return new Client({ auth });
}

// Curated list of docs the dashboard surfaces. IDs from the Notion workspace.
const CURATED_DOC_IDS = [
  "3102b7f759ed8089a5f7e26d032e8b6d", // Automation Team (Autobots)
  "3112b7f759ed80208acddc7e0f520dd3", // Expand Team
  "3372b7f759ed80158c45d5a6cd788706", // Cycle Planning 61
  "30c2b7f759ed806596dfc2730bbb693f", // Expansion team Roadmap
  "3252b7f759ed808a91b2dc8ce90b4dd1", // Expand Team Capacity & Prioritization
];

export async function fetchCuratedDocs(): Promise<NotionDocLink[]> {
  const client = getClient();
  const results: NotionDocLink[] = [];
  for (const id of CURATED_DOC_IDS) {
    try {
      const page = await client.pages.retrieve({ page_id: id });
      if (!("properties" in page)) continue;
      const title = extractTitle(page) ?? "(untitled)";
      results.push({
        id,
        title,
        url: `https://www.notion.so/${id.replace(/-/g, "")}`,
        lastEdited: "last_edited_time" in page ? page.last_edited_time : "",
      });
    } catch (err) {
      // Integration may not have access; skip silently so one bad doc doesn't
      // break the whole snapshot.
      console.warn(`Notion: could not fetch ${id}: ${(err as Error).message}`);
    }
  }
  return results;
}

// Notion page titles live on a "title" property whose name varies ("Name",
// "Title", etc.). Walk properties looking for the first title-type prop.
function extractTitle(page: unknown): string | null {
  if (!page || typeof page !== "object") return null;
  const props = (page as { properties?: Record<string, unknown> }).properties;
  if (!props) return null;
  for (const value of Object.values(props)) {
    if (
      value &&
      typeof value === "object" &&
      (value as { type?: string }).type === "title"
    ) {
      const title = (value as { title?: Array<{ plain_text?: string }> }).title;
      if (Array.isArray(title) && title.length > 0) {
        return title.map((t) => t.plain_text ?? "").join("").trim();
      }
    }
  }
  return null;
}
