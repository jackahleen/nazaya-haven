import { IconSearch } from "@/components/icons";

export function HeroSearch() {
  return (
    <form
      role="search"
      action="/ai"
      method="get"
      className="mx-auto w-full max-w-2xl"
    >
      <label htmlFor="haven-search" className="sr-only">
        How can we support you today?
      </label>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-purple-soft"
          aria-hidden
        >
          <IconSearch />
        </span>
        <input
          id="haven-search"
          name="q"
          type="search"
          placeholder="How can we support you today?"
          className="w-full rounded-full border-2 border-lavender-deep/50 bg-cream py-4 pl-14 pr-28 text-base text-ink shadow-lg shadow-purple/10 placeholder:text-ink-muted/60 focus:border-purple focus:outline-none focus:ring-4 focus:ring-purple/15 sm:py-5 sm:pr-32 sm:text-lg"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-purple px-5 py-2.5 text-sm font-semibold text-cream shadow-md shadow-purple/25 transition hover:bg-purple-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:px-6 sm:py-3"
        >
          Nazaya AI
        </button>
      </div>
    </form>
  );
}
