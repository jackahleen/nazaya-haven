import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  size?: "sm" | "lg" | "hero";
  layout?: "row" | "stacked";
};

export function BrandLogo({
  href = "/",
  size = "lg",
  layout,
}: BrandLogoProps) {
  const isStacked = layout === "stacked" || size === "hero";
  const titleClass =
    size === "hero"
      ? "text-4xl font-semibold tracking-tight sm:text-5xl"
      : size === "lg"
        ? "text-3xl font-semibold tracking-tight sm:text-4xl"
        : "text-xl font-semibold tracking-tight";

  const markClass =
    size === "hero"
      ? "h-20 w-20 text-3xl sm:h-24 sm:w-24"
      : size === "lg"
        ? "h-14 w-14 text-2xl"
        : "h-10 w-10 text-lg";

  const content = (
    <div
      className={
        isStacked
          ? "flex flex-col items-center gap-4 text-center"
          : "flex items-center gap-3"
      }
    >
      <div
        className={`${markClass} flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple to-purple-deep text-cream shadow-md shadow-purple/20`}
        aria-hidden
      >
        NH
      </div>
      <div>
        <p className={`${titleClass} text-ink`}>Nazaya Haven</p>
        {(size === "lg" || size === "hero") && (
          <p className="text-sm text-ink-muted sm:text-base">
            Family &amp; child advocacy
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
