import { Surface } from "@/components/ui/Surface";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { legalForms } from "@/data/legal-forms";

export function DocumentVaultPreview() {
  return (
    <Surface className="mt-8">
      <SectionHeader
        eyebrow="Documents + legal forms"
        title="Guided form library"
        description="Upload, categorization, and PDF fill are staged behind this first preview.
        The current slice gives caregivers plain-language form guidance and source links."
      />

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {legalForms.map((form) => (
          <article key={form.id} className="rounded-2xl bg-lavender-light p-4">
            <h3 className="text-base font-semibold text-ink">{form.id}</h3>
            <p className="mt-1 text-sm font-semibold text-purple-deep">{form.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{form.useCase}</p>
            <a
              className="mt-3 inline-block text-sm font-semibold text-purple hover:underline"
              href={form.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View court source
            </a>
          </article>
        ))}
      </div>

      <p className="mt-5 rounded-2xl bg-pastel-butter/70 px-4 py-3 text-sm text-ink-muted">
        Nazaya Haven provides legal information, not legal advice. Families should
        contact a qualified attorney or legal aid organization for legal advice or
        review.
      </p>
    </Surface>
  );
}
