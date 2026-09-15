import Link from "next/link";
import clsx from "clsx";

export function Logo({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={clsx(
        "font-display tracking-wide text-2xl sm:text-3xl uppercase select-none",
        dark ? "text-white" : "chrome-text",
        className
      )}
      aria-label="Clifstone — accueil"
    >
      Clifstone
    </Link>
  );
}
