import { confidenceExercises, moodFaces } from "@/data/child-corner";
import { ToastPreview } from "@/components/notifications/ToastPreview";
import { Surface } from "@/components/ui/Surface";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ChildCornerPreview() {
  return (
    <Surface className="mt-10">
      <SectionHeader
        eyebrow="Supervised mode"
        title="For Your Child"
        description="Child Corner lives inside the parent dashboard. It supports confidence exercises, mood check-ins, and trusted adult summaries without creating a separate child login."
      />

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {confidenceExercises.map((exercise) => (
          <article
            key={exercise.id}
            className="rounded-2xl bg-lavender-light p-4"
          >
            <h3 className="text-base font-semibold text-ink">
              {exercise.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {exercise.prompt}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-cream-dark/80 p-4">
        <h3 className="text-base font-semibold text-ink">
          5-face mood check-in
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {moodFaces.map((face) => (
            <span
              key={face}
              className="rounded-full bg-pastel-butter px-3 py-1 text-sm font-semibold text-ink"
            >
              {face}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-muted">
          Trusted adult summary: trends are shown to the caregiver as
          supportive observations, not diagnoses.
        </p>
      </div>

      <div className="mt-5">
        <ToastPreview />
      </div>
    </Surface>
  );
}
