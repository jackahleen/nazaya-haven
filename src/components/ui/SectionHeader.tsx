type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-medium uppercase tracking-wider text-purple-soft">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
