import Image from "next/image";
import type { City } from "../../lib/types";

interface PassosProps {
  city: City;
}

export default function Passos({ city }: PassosProps) {
  const permitDays = city.avgPermitDays;

  const steps = [
    {
      title: "Size the right system",
      text: "We build a personalized system size from your bill and coverage goal, then show a transparent quote with the math visible.",
      timing: "Personalized to your home",
    },
    {
      title: `Permit it for ${city.city}`,
      text: `We handle City of ${city.city} permitting and ${city.utilityName} paperwork. The current average permit timeline is ${permitDays} days.`,
      timing: `${permitDays}-day average permit`,
    },
    {
      title: "Install and connect",
      text: "Installation is typically completed in one day, followed by utility review and interconnection.",
      timing: "1 day + 1–2 weeks",
    },
  ];

  return (
    <section
      id="passos"
      aria-labelledby="passos-title"
      className="bg-brand-black px-5 py-8 text-brand-white md:px-8 md:py-[100px] lg:px-20"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 md:gap-14">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-20">
          <div className="flex flex-col gap-4 md:w-[620px] md:gap-5">
            <h2
              id="passos-title"
              className="text-section-title-mobile font-bold leading-[1.06] md:text-section-title-desktop"
            >
              A {city.city} install, in three clear steps
            </h2>
            <p className="text-section-body-mobile leading-[1.65] md:text-section-body-desktop">
              Your project moves from honest sizing to permitting to power-on,
              with the handoffs handled by one local team.
            </p>
          </div>
          <div className="flex flex-col gap-1.5 md:flex-1">
            <p className="text-caption-mobile font-semibold uppercase text-brand-orange">
              Typical milestones
            </p>
            <p className="text-card-title-mobile font-bold md:text-[22px]">
              {permitDays} days permit · 1 day install
            </p>
            <p className="text-label-mobile md:text-label-desktop">
              Then 1–2 weeks for utility interconnection
            </p>
          </div>
        </div>

        <ol
          tabIndex={0}
          aria-label="Installation steps"
          className="-mx-5 no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-3.5 md:overflow-visible md:px-0"
        >
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex min-h-[280px] w-[88%] shrink-0 snap-center flex-col gap-4 rounded-2xl bg-brand-orange px-7 py-5 text-brand-black md:w-auto md:gap-5 md:p-7"
            >
              <p
                aria-hidden="true"
                className="font-space-grotesk text-base font-bold"
              >
                {String(index + 1).padStart(2, "0")}
              </p>
              <hr className="hidden h-px border-0 bg-brand-black md:block" />
              <h3 className="text-card-title-mobile font-bold leading-[1.15] md:text-[20px]">
                {step.title}
              </h3>
              <p className="text-section-body-mobile leading-[1.65] md:text-[14px]">
                {step.text}
              </p>
              <p className="mt-auto flex w-fit items-center gap-[7px] rounded-full bg-brand-orange-light px-3 py-1.5 text-caption-mobile font-semibold md:mt-0 md:text-caption-desktop">
                <Image
                  src="/images/passos/clock.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                />
                {step.timing}
              </p>
            </li>
          ))}
        </ol>

        <div className="hidden overflow-hidden rounded-2xl bg-brand-orange-light md:flex md:h-[220px]">
          <Image
            src="/images/passos/crew-installing-panels.png"
            alt={`Installation crew laying solar panels on a rooftop in the ${city.city} area`}
            width={680}
            height={220}
            className="h-full w-[53%] shrink-0 object-cover"
          />
          <figure className="flex flex-1 flex-col justify-center gap-4 p-9">
            <blockquote className="text-[24px] font-bold leading-[1.2]">
              &ldquo;No black box. You&apos;ll know what happens next, and
              why.&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-2 text-label-desktop font-medium">
              <Image
                src="/images/passos/badge-check.svg"
                alt=""
                width={16}
                height={16}
                aria-hidden="true"
              />
              Transparent quote · {city.city} permits · {city.utilityName}{" "}
              paperwork
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
