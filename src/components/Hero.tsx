import Image from "next/image";
import type { City } from "../../lib/types";
import HeroMobileMenu from "./HeroMobileMenu";

const NAV_LINKS = [
  { label: "Savings simulator", href: "#simulador" },
  { label: "How it works", href: "#passos" },
  { label: "Reviews", href: "#provaSocial" },
  { label: "FAQ", href: "#FAQ" },
];
const NAV_CTA = { label: "Get my estimate", href: "#" };

interface HeroProps {
  city: City;
}

export default function Hero({ city }: HeroProps) {
  const phoneNumber = city.phone.replace(/\D/g, "");

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[760px] w-full items-center justify-center overflow-hidden bg-brand-black text-brand-white lg:min-h-[900px]"
    >
      <Image
        src="/images/hero/wind-turbine.png"
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.33),rgba(0,0,0,0.13)_60%,transparent)]"
      />

      <header className="absolute inset-x-0 top-0 z-10 flex h-[72px] items-center justify-between px-5 lg:px-16">
        <a
          href={`/${city.slug}`}
          className="flex items-center gap-[10px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange-light"
          aria-label="Brightfield Solar home"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-orange">
            <Image
              src="/images/hero/sun.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
          </span>
          <span className="font-space-grotesk text-brand text-brand-white">
            Brightfield Solar
          </span>
        </a>

        <HeroMobileMenu links={NAV_LINKS} cta={NAV_CTA} />

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 text-[13px] lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              className="transition-colors hover:text-brand-orange-light"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          <a
            href={NAV_CTA.href}
            className="rounded-full bg-brand-orange px-5 py-3 font-semibold text-brand-white transition-colors hover:bg-brand-orange-light"
          >
            {NAV_CTA.label}
          </a>
        </nav>
      </header>

      <div className="relative z-0 flex w-full flex-col items-center gap-6 px-6 text-center md:gap-8 lg:gap-10">
        <div className="flex w-full max-w-[301px] flex-col items-center gap-5 md:max-w-[640px] md:gap-6 lg:max-w-[820px] lg:gap-8">
          <p className="flex items-center gap-2 text-eyebrow font-medium uppercase text-brand-orange-light">
            <Image
              src="/images/hero/sun-marker.svg"
              alt=""
              width={5}
              height={5}
              aria-hidden="true"
            />
            {city.city}, {city.stateFull} · {city.utilityName}
          </p>

          <h1
            id="hero-title"
            className="text-display-mobile leading-[0.96] font-semibold md:text-5xl lg:text-display-desktop"
          >
            Turn {city.city} sun into a smaller power bill
          </h1>

          <p className="text-body-mobile leading-[1.65] md:text-base lg:max-w-[640px] lg:text-body-desktop">
            See how much you could save with solar designed for your {city.city} home
          </p>

          <a
            href="#simulador"
            className="inline-flex h-12 items-center justify-center gap-[10px] rounded-full bg-brand-white px-6 text-action-mobile font-semibold text-brand-black transition-colors hover:bg-brand-orange-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-white lg:h-[52px] lg:px-8 lg:text-action-desktop"
          >
            Calculate my savings
            <Image
              src="/images/hero/arrow-up-right.svg"
              alt=""
              width={15}
              height={15}
              aria-hidden="true"
            />
          </a>
        </div>

        <ul className="flex w-[261px] flex-wrap items-start justify-center gap-3 text-proof-mobile font-medium md:w-auto md:flex-nowrap md:gap-6 md:text-[13px] lg:gap-9 lg:text-proof-desktop">
          <li className="flex h-12 items-center justify-center px-4">
            <span>
              {city.installsCompleted.toLocaleString("en-US")}
              <br />
              homes powered
            </span>
          </li>
          <li className="flex h-12 items-center justify-center px-4">
            <span>
              {city.avgRating.toFixed(1)} ★
              <br />
              average rating
            </span>
          </li>
          <li className="flex h-12 items-center justify-center px-4">
            <span>
              {city.crewsAvailable}
              <br />
              local crews
            </span>
          </li>
        </ul>

        <a
          href={`tel:${phoneNumber}`}
          className="text-proof-mobile text-brand-white underline decoration-white/60 underline-offset-4 transition-colors hover:text-brand-orange-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-white"
        >
          Call {city.phone}
        </a>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[200px] bg-[linear-gradient(to_bottom,rgba(250,250,250,0),rgba(250,250,250,0.38)_56.77%,#fafafa)]"
      />
    </section>
  );
}
