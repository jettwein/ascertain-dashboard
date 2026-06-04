import { projectsByStatus, statusColor } from "@/lib/dashboard";
import type { LinearProject } from "@/lib/types";

interface ProjectBoardProps {
  projects: LinearProject[];
}

/** Statuses shown as full project lists; the rest collapse to a count chip. */
const FEATURED_STATUSES = ["In Progress", "Discovery", "Planned"];

export function ProjectBoard({ projects }: ProjectBoardProps) {
  const groups = projectsByStatus(projects);
  const featured = groups.filter((g) => FEATURED_STATUSES.includes(g.status));
  const rest = groups.filter((g) => !FEATURED_STATUSES.includes(g.status));

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between border-b border-border pb-2">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          Projects
        </h2>
        <span className="font-mono text-[11px] tracking-wide text-muted-foreground tabular-nums">
          {projects.length} TOTAL
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map(({ status, projects }) => (
          <div key={status} className="rule-top flex flex-col gap-1 pt-3">
            <h3 className="mb-1 flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: statusColor(status) }}
                aria-hidden
              />
              {status}
              <span className="font-medium text-foreground tabular-nums">
                {projects.length}
              </span>
            </h3>
            {projects.map((project) => (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate border-b border-border/60 py-1.5 text-sm text-foreground/90 transition-colors last:border-0 hover:text-signal"
              >
                {project.name}
              </a>
            ))}
          </div>
        ))}
      </div>

      {rest.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          {rest.map(({ status, projects }) => (
            <span
              key={status}
              className="inline-flex items-center gap-1.5 border border-border px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted-foreground"
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: statusColor(status) }}
                aria-hidden
              />
              {status}
              <span className="font-medium text-foreground tabular-nums">
                {projects.length}
              </span>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
