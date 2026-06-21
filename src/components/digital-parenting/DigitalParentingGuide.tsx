import {
  agentNavigationHandoffs,
  digitalParentingCheckIn,
  digitalParentingTopics,
  notificationHandoffConcepts,
} from "@/data/digital-parenting";

export function DigitalParentingGuide() {
  return (
    <section className="mt-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-purple-soft">
            Caregiver guide
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">
            Digital Parenting Literacy
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
            Adult-facing guidance for internet access, screen-time habits,
            platform privacy, and safer family routines. The tone stays
            practical and non-shaming: help caregivers understand what is
            happening, then choose one next step.
          </p>
        </div>
        <div className="rounded-2xl bg-lavender-light px-4 py-3 text-sm text-purple-deep">
          <span className="font-semibold">Guided help:</span> tutorials can
          point caregivers to the next safe step.
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-4">
        {digitalParentingTopics.map((topic) => (
          <article
            key={topic.id}
            className="rounded-2xl border border-lavender-deep/40 bg-cream p-4"
          >
            <h3 className="text-sm font-semibold text-ink">{topic.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {topic.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-2xl border border-lavender-deep/40 bg-lavender-light p-5">
          <h3 className="text-lg font-semibold text-ink">
            Caregiver habit check-in
          </h3>
          <div className="mt-4 space-y-3">
            {digitalParentingCheckIn.map((item) => (
              <div key={item.id} className="rounded-2xl bg-cream/80 p-4">
                <p className="text-sm font-semibold text-ink">{item.prompt}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  {item.support}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-purple/20 bg-cream p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-ink">
                Guided navigation queue
              </h3>
              <p className="mt-1 text-sm text-ink-muted">
                Scripted tutorial affordances now; Agent-S-backed dispatch once
                integration keys and teammate lane contracts are ready.
              </p>
            </div>
            <span className="rounded-full bg-pastel-mint px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
              Preview
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {agentNavigationHandoffs.map((handoff) => (
              <article
                key={handoff.id}
                className="rounded-2xl border border-lavender-deep/40 bg-lavender-light p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-ink">
                      {handoff.label}
                    </h4>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-purple-soft">
                      {handoff.mode}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-purple-deep">
                    {handoff.destination}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {handoff.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-2xl border border-lavender-deep/40 bg-cream p-5">
        <h3 className="text-lg font-semibold text-ink">
          Notification handoffs for agent work
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {notificationHandoffConcepts.map((concept) => (
            <article
              key={concept.id}
              className="rounded-2xl bg-pastel-butter/70 p-4"
            >
              <h4 className="text-sm font-semibold text-ink">
                {concept.label}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {concept.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
