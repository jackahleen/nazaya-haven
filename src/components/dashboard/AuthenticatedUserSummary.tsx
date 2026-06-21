import { demoSession } from "@/data/demo-session";

export function AuthenticatedUserSummary() {
  return (
    <section className="mb-8 grid gap-4 rounded-3xl bg-lavender-light p-5 sm:p-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium uppercase tracking-wider text-purple-soft">
            Signed in as
          </p>
          <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-purple-deep">
            {demoSession.status.label}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          {demoSession.user.name}
        </h2>
        <p className="mt-1 text-sm font-medium text-purple-deep">
          {demoSession.user.role}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
          {demoSession.user.householdContext}
        </p>
        <p className="mt-2 text-sm text-ink-muted">{demoSession.user.location}</p>
      </div>

      <div className="rounded-2xl bg-cream p-4">
        <p className="text-sm font-semibold text-ink">
          {demoSession.status.summary}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          {demoSession.status.description}
        </p>
        <div className="mt-4 space-y-2">
          {demoSession.queuedTasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col gap-1 rounded-2xl bg-cream-dark/80 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-sm font-medium text-ink">{task.label}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-soft">
                {task.owner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
