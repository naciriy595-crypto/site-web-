import Link from "next/link";
import Image from "next/image";
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
      aria-label="Clifstone — accueil"
      className={clsx(
        "inline-flex w-auto shrink-0 items-center overflow-hidden rounded-md select-none",
        !className && "h-9 sm:h-10",
        dark && "ring-1 ring-white/15",
        className
      )}
    >
      <Image
        src="/brand/logo-wordmark.webp"
        alt="Clifstone"
        width={815}
        height={345}
        className="h-full w-auto object-cover"
        priority
      />
    </Link>
  );
}
