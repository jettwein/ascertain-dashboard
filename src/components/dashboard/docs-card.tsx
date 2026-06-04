import { formatDate } from "@/lib/dashboard";
import type { NotionDocLink } from "@/lib/types";

interface DocsCardProps {
  docs: NotionDocLink[];
}

export function DocsCard({ docs }: DocsCardProps) {
  return (
    <section className="rule-top flex flex-col gap-2 pt-3">
      <h2 className="font-display text-xl font-medium">Key Docs</h2>
      <div className="flex flex-col">
        {docs.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">No docs linked.</p>
        ) : (
          docs.map((doc) => (
            <a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline justify-between gap-3 border-b border-border/70 py-2 transition-colors last:border-0 hover:bg-foreground/[0.025]"
            >
              <span className="flex-1 truncate text-sm text-foreground/90 transition-colors group-hover:text-signal">
                {doc.title}
              </span>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                {formatDate(doc.lastEdited)}
              </span>
            </a>
          ))
        )}
      </div>
    </section>
  );
}
