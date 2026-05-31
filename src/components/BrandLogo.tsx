import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  size?: "sm" | "lg";
};

export function BrandLogo({ href = "/", size = "lg" }: BrandLogoProps) {
  const titleClass =
    size === "lg"
      ? "text-3xl font-semibold tracking-tight sm:text-4xl"
      : "text-xl font-semibold tracking-tight";

  const markClass = size === "lg" ? "h-14 w-14 text-2xl" : "h-10 w-10 text-lg";

  const content = (
    <div className="flex items-center gap-3">
      <div
        className={`${markClass} flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple to-purple-deep text-cream shadow-md shadow-purple/20`}
        aria-hidden
      >
        NH
      </div>
      <div>
        <p className={`${titleClass} text-ink`}>Nazaya Haven</p>
        {size === "lg" && (
          <p className="text-sm text-ink-muted">Family &amp; child advocacy</p>
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
