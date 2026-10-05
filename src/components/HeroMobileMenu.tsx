"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroMobileMenuProps {
  links: { label: string; href: string }[];
  cta: { label: string; href: string };
}

export default function HeroMobileMenu({ links, cta }: HeroMobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="hero-mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="flex size-10 items-center justify-center rounded-full bg-brand-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange-light"
      >
        <Image
          src="/images/hero/menu.svg"
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
        />
      </button>

      <nav
        id="hero-mobile-menu"
        aria-label="Main navigation"
        hidden={!open}
        className="absolute inset-x-5 top-[72px] z-20 flex flex-col gap-1 rounded-2xl bg-brand-black/95 p-4 text-label-mobile shadow-lg backdrop-blur"
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={close}
            className="rounded-lg px-3 py-3 transition-colors hover:text-brand-orange-light"
          >
            {link.label}
          </a>
        ))}
        <a
          href={cta.href}
          onClick={close}
          className="mt-2 rounded-full bg-brand-orange px-5 py-3 text-center font-semibold text-brand-white transition-colors hover:bg-brand-orange-light"
        >
          {cta.label}
        </a>
      </nav>
    </div>
  );
}
