import Image from "next/image";
import type { City } from "../../lib/types";

interface ChamadaFinalProps {
  city: City;
}

const ESTIMATE_CONTENTS = ["System size", "Incentive view", "Savings + payback"];

const FOOTER_LINKS = [
  { label: "Savings simulator", href: "#simulador" },
  { label: "Installation", href: "#passos" },
  { label: "Local crews", href: "#provaSocial" },
  { label: "FAQs", href: "#FAQ" },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange-light";

export default function ChamadaFinal({ city }: ChamadaFinalProps) {
  const phoneNumber = city.phone.replace(/\D/g, "");

  return (
    <section
      id="ChamadaFinal"
      aria-labelledby="chamada-final-title"
      className="bg-brand-black text-brand-white"
    >
      <div className="flex min-h-[560px] flex-col lg:flex-row">
        <div className="flex flex-col justify-center gap-6 px-5 py-12 lg:w-[700px] lg:shrink-0 lg:gap-7 lg:py-[88px] lg:pr-[60px] lg:pl-20">
          <h2
            id="chamada-final-title"
            className="text-section-title-mobile font-bold leading-[1.03] lg:text-[56px]"
          >
            Let&apos;s put your roof in the math.
          </h2>
          <p className="text-section-body-mobile leading-[1.65] lg:text-section-body-desktop">
            Share your average {city.utilityName} bill and coverage goal.
            We&apos;ll prepare a clear {city.city} solar estimate with system
            size, incentives, monthly savings, and payback.
          </p>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <a
              href="#"
              className={`flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-brand-orange px-6 text-action-mobile font-semibold transition-colors hover:bg-brand-orange-light lg:px-7 lg:text-[14px] ${focusRing}`}
            >
              Get my free estimate
              <Image
                src="/images/chamada-final/arrow-up-right.svg"
                alt=""
                width={15}
                height={15}
                aria-hidden="true"
              />
            </a>
            <a
              href={`tel:${phoneNumber}`}
              className={`flex h-[52px] items-center justify-center gap-2.5 rounded-full border border-brand-white px-5 text-action-mobile font-bold transition-colors hover:border-brand-orange-light hover:text-brand-orange-light lg:text-[18px] ${focusRing}`}
            >
              <Image
                src="/images/chamada-final/phone.svg"
                alt=""
                width={15}
                height={15}
                aria-hidden="true"
              />
              {city.phone}
            </a>
          </div>

          <ul className="flex flex-wrap gap-x-3 gap-y-2 text-label-mobile lg:gap-x-5 lg:text-label-desktop">
            {ESTIMATE_CONTENTS.map((content) => (
              <li key={content} className="flex items-center gap-1.5">
                <Image
                  src="/images/chamada-final/check.svg"
                  alt=""
                  width={14}
                  height={14}
                  aria-hidden="true"
                />
                {content}
              </li>
            ))}
          </ul>

          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-label-mobile font-medium lg:text-label-desktop">
            <li>{city.installsCompleted.toLocaleString("en-US")} homes powered</li>
            <li>{city.avgRating.toFixed(1)} ★ average rating</li>
            <li>{city.crewsAvailable} local crews</li>
          </ul>

          <a
            href="#ChamadaFinal"
            className={`w-fit text-label-mobile underline underline-offset-4 transition-colors hover:text-brand-orange-light lg:text-label-desktop ${focusRing}`}
          >
            What your estimate includes
          </a>
        </div>

        <div className="relative h-80 w-full lg:h-auto lg:min-h-[560px] lg:flex-1">
          <Image
            src="/images/chamada-final/invitation-media.png"
            alt={`Aerial view of a desert home with rooftop solar panels in the ${city.city} area`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[rgba(17,24,22,0.1)]"
          />
        </div>
      </div>

      <footer className="flex flex-col gap-4 border-t border-brand-white p-5 lg:min-h-[110px] lg:flex-row lg:items-center lg:justify-between lg:px-20 lg:py-7">
        <div className="flex items-center gap-3">
          <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-brand-orange">
            <Image
              src="/images/chamada-final/sun.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
            />
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="font-space-grotesk text-[15px] font-bold">
              Brightfield Solar
            </p>
            <p className="text-caption-mobile">
              {city.city}, {city.stateFull} · {city.utilityName} territory
            </p>
          </div>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-col gap-3 text-label-mobile lg:flex-row lg:items-center lg:gap-7 lg:text-label-desktop">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`transition-colors hover:text-brand-orange-light ${focusRing}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-1 lg:items-end">
          <a
            href={`tel:${phoneNumber}`}
            className={`text-label-mobile font-bold text-brand-orange lg:text-[16px] ${focusRing}`}
          >
            {city.phone}
          </a>
          <p className="text-caption-mobile lg:max-w-[190px] lg:text-right">
            Serving {city.city} metro neighborhoods
          </p>
        </div>
      </footer>
    </section>
  );
}
