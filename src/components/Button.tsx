import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-purple text-cream shadow-md shadow-purple/25 hover:bg-purple-deep focus-visible:ring-purple",
  secondary:
    "border-2 border-purple/30 bg-lavender-light text-purple-deep hover:border-purple/50 hover:bg-lavender focus-visible:ring-purple-soft",
  ghost:
    "bg-transparent text-purple-deep hover:bg-lavender/60 focus-visible:ring-purple-soft",
};

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps & {
  href: string;
};

export function Button({
  children,
  variant = "primary",
  className = "",
  href,
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-60";

  const styles = `${base} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...rest } = props as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={type} className={styles} {...rest}>
      {children}
    </button>
  );
}
