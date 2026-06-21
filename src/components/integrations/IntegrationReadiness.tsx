import {
  demoAgentTasks,
  demoNotificationEvents,
  demoResourceHandoffs,
  visibleIntegrationProviders,
} from "@/integrations/provider-registry";
import type { IntegrationReadiness as Readiness } from "@/integrations/contracts";

const readinessLabels: Record<Readiness, string> = {
  "direct-preview": "Direct preview",
  "account-needed": "Account needed",
  "service-needed": "Service needed",
  bookmarked: "Bookmarked",
};

export function IntegrationReadiness() {
  return (
    <section className="mt-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-purple-soft">
            Sponsor tool layer
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">
            Integration Readiness
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
            Each selected tool is tracked as a direct Nazaya Haven consumer first,
            with a separate PLAI adapter queue so the substrate can catch up
            without blocking the hackathon demo.
          </p>
        </div>
        <div className="rounded-2xl bg-pastel-mint px-4 py-3 text-sm text-ink">
          <span className="font-semibold">Now:</span> Agent-S demo handoff,
          Browserbase testing, and Sentry observability.
        </div>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleIntegrationProviders.map((provider) => (
          <article
            key={provider.id}
            className="rounded-2xl border border-lavender-deep/40 bg-cream p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-ink">
                  {provider.name}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-purple-soft">
                  {provider.category.replaceAll("-", " ")}
                </p>
              </div>
              <span className="w-fit rounded-full bg-lavender-light px-3 py-1 text-xs font-semibold text-purple-deep">
                {readinessLabels[provider.readiness]}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {provider.appUse}
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="font-semibold text-ink">CI role</dt>
                <dd className="mt-1 leading-relaxed text-ink-muted">
                  {provider.ciUse}
                </dd>
              </div>
              <div className="flex flex-wrap gap-2">
                <dd className="rounded-full bg-pastel-butter px-3 py-1 text-xs font-semibold text-ink">
                  {provider.directConsumer
                    ? "Direct app consumer"
                    : "Bookmark only"}
                </dd>
                <dd className="rounded-full bg-cream-dark px-3 py-1 text-xs font-semibold text-purple-deep">
                  {provider.plaiAdapterStatus}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-purple/20 bg-lavender-light p-5">
          <h3 className="text-lg font-semibold text-ink">Agent task contracts</h3>
          <div className="mt-4 space-y-3">
            {demoAgentTasks.map((task) => (
              <article key={task.id} className="rounded-2xl bg-cream p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-ink">
                      {task.label}
                    </h4>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-purple-soft">
                      {task.kind.replaceAll("-", " ")}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-pastel-mint px-3 py-1 text-xs font-semibold text-ink">
                    {task.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-muted">
                  Target route: {task.targetRoute}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-lavender-deep/40 bg-cream p-5">
          <h3 className="text-lg font-semibold text-ink">
            Handoffs and notifications
          </h3>
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-ink">
                Resource handoffs
              </h4>
              <div className="mt-2 space-y-2">
                {demoResourceHandoffs.map((handoff) => (
                  <p
                    key={handoff.id}
                    className="rounded-2xl bg-pastel-butter/70 px-3 py-2 text-sm leading-relaxed text-ink-muted"
                  >
                    {handoff.summary}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink">
                Notification triggers
              </h4>
              <div className="mt-2 space-y-2">
                {demoNotificationEvents.map((event) => (
                  <p
                    key={event.id}
                    className="rounded-2xl bg-lavender-light px-3 py-2 text-sm leading-relaxed text-ink-muted"
                  >
                    <span className="font-semibold text-ink">
                      {event.label}:
                    </span>{" "}
                    {event.trigger}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
