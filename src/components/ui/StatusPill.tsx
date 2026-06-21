import type { ReactNode } from "react";

type StatusPillProps = {
  children: ReactNode;
  tone?: "lavender" | "mint" | "butter";
};

const toneClass = {
  lavender: "bg-lavender-light text-purple-deep",
  mint: "bg-pastel-mint text-ink",
  butter: "bg-pastel-butter text-ink",
};

export function StatusPill({
  children,
  tone = "lavender",
}: StatusPillProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}
