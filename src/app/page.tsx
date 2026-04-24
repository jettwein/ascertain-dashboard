import { readSnapshot } from "@/lib/snapshot";

export default async function Home() {
  const snapshot = await readSnapshot();
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">
        Ascertain Dashboard
      </h1>
      <p className="mt-2 text-muted-foreground">
        Product &amp; engineering activity across Expansion, Automation, and
        Platform.
      </p>
      <div className="mt-8 rounded-lg border p-4 text-sm text-muted-foreground">
        Snapshot last generated:{" "}
        <code>{snapshot?.generatedAt ?? "never"}</code>
        <br />
        Teams: {snapshot?.teams.length ?? 0} · Projects:{" "}
        {snapshot?.projects.length ?? 0} · Docs:{" "}
        {snapshot?.keyDocs.length ?? 0}
        {snapshot?.errors && snapshot.errors.length > 0 && (
          <div className="mt-2 text-red-600">
            Errors: {snapshot.errors.map((e) => e.source).join(", ")}
          </div>
        )}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        UI coming in step 4. Run <code>npm run snapshot</code> to populate
        data.
      </p>
    </main>
  );
}
