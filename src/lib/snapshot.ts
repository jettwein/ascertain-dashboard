import { promises as fs } from "node:fs";
import path from "node:path";
import type { Snapshot } from "./types";

/**
 * Snapshot I/O. The snapshot lives in `data/snapshot.json` at the repo root,
 * committed to git. The fetcher script writes it; the Next.js app reads it.
 */

const SNAPSHOT_PATH = path.join(process.cwd(), "data", "snapshot.json");

export async function readSnapshot(): Promise<Snapshot | null> {
  try {
    const raw = await fs.readFile(SNAPSHOT_PATH, "utf8");
    return JSON.parse(raw) as Snapshot;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function writeSnapshot(snapshot: Snapshot): Promise<void> {
  await fs.mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
  await fs.writeFile(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2) + "\n");
}
