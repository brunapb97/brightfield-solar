import Image from "next/image";
import type { City } from "../../lib/types";

interface ProvaSocialProps {
  city: City;
}

const STARS = [0, 1, 2, 3, 4];

export default function ProvaSocial({ city }: ProvaSocialProps) {
  const crews = city.crews.slice(0, 3);

  const metrics = [
    {
      value: city.installsCompleted.toLocaleString("en-US"),
      label: "installs completed",
    },
    { value: String(city.crewsAvailable), label: "crews available" },
    {
      value: city.avgRating.toFixed(1),
      label: "average rating",
      star: true,
    },
  ];

  return (
    <section
      id="provaSocial"
      aria-labelledby="prova-social-title"
      className="bg-brand-white px-5 pt-11 pb-10 text-brand-black lg:px-20 lg:pt-[92px] lg:pb-16"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 lg:gap-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-20">
          <div className="flex flex-col gap-4 lg:w-[600px] lg:shrink-0 lg:gap-5">
            <h2
              id="prova-social-title"
              className="text-section-title-mobile font-bold leading-[1.06] lg:text-section-title-desktop"
            >
              Local crews. Real {city.city} roofs
            </h2>
            <p className="text-section-body-mobile leading-[1.65] lg:text-section-body-desktop">
              From tile roofs in {city.popularNeighborhoods[1]} to flat roofs in{" "}
              {city.popularNeighborhoods[0]}, our teams bring repeatable craft
              and neighborhood-level experience.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 lg:flex-1">
            <h3 className="text-label-mobile font-semibold uppercase lg:text-caption-mobile">
              Popular neighborhoods
            </h3>
            <ul className="flex flex-wrap gap-2">
              {city.popularNeighborhoods.map((neighborhood) => (
                <li
                  key={neighborhood}
                  className="rounded-full border border-brand-white bg-brand-orange-light px-3.5 py-[7px] text-caption-mobile lg:text-label-mobile"
                >
                  {neighborhood}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-brand-white lg:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={`flex flex-col-reverse justify-end gap-1.5 bg-brand-black p-8 ${
                metric.star ? "col-span-2 lg:col-span-1" : ""
              }`}
            >
              <dt className="text-label-mobile text-brand-white">
                {metric.label}
              </dt>
              <dd className="flex items-center gap-2 text-[20px] font-bold text-brand-purple lg:text-[52px]">
                {metric.value}
                {metric.star && (
                  <Image
                    src="/images/prova-social/star-rating.svg"
                    alt=""
                    width={22}
                    height={22}
                    aria-hidden="true"
                  />
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-5">
          <h3 className="text-card-title-mobile font-bold lg:text-[28px]">
            What {city.city} homeowners say
          </h3>
          <ul className="-mx-5 no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-3.5 lg:overflow-visible lg:px-0">
            {city.testimonials.map((testimonial) => (
              <li
                key={testimonial.author}
                className="min-h-[280px] w-[calc(100%-20px)] shrink-0 snap-center lg:w-auto"
              >
                <figure className="flex h-full min-h-[280px] flex-col gap-5 rounded-2xl border border-brand-white bg-brand-paper p-7">
                  <div className="flex gap-[3px]" aria-hidden="true">
                    {STARS.map((star) => (
                      <Image
                        key={star}
                        src="/images/prova-social/star.svg"
                        alt=""
                        width={13}
                        height={13}
                      />
                    ))}
                  </div>
                  <blockquote className="text-section-body-mobile font-medium leading-[1.6] lg:text-section-body-desktop">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <figcaption className="mt-auto flex flex-col gap-[3px]">
                    <span className="text-label-desktop font-semibold">
                      {testimonial.author} · {testimonial.neighborhood}
                    </span>
                    <time
                      dateTime={testimonial.date}
                      className="text-eyebrow"
                    >
                      {testimonial.date}
                    </time>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <h3 className="text-card-title-mobile font-bold lg:text-[28px]">
              Meet three of our local crews
            </h3>
            <p className="text-label-mobile">
              {city.city} metro roof specialists
            </p>
          </div>
          <ul className="-mx-5 no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-3.5 lg:overflow-visible lg:px-0">
            {crews.map((crew, index) => (
              <li
                key={crew.name}
                className="w-[calc(100%-20px)] shrink-0 snap-center lg:w-auto"
              >
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-orange-light bg-brand-black text-brand-white">
                  <div className="relative h-[200px] w-full shrink-0">
                    <Image
                      src={`/images/prova-social/crew-${index + 1}.png`}
                      alt={`${crew.name}, a Brightfield installation crew in ${city.city}`}
                      fill
                      sizes="(min-width: 1024px) 420px, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-card-title-desktop font-bold">
                        {crew.name}
                      </h4>
                      <p className="text-eyebrow text-brand-purple-light">
                        Brightfield crew since {crew.since}
                      </p>
                    </div>
                    <dl className="flex gap-2">
                      <div className="flex flex-1 flex-col-reverse justify-end gap-0.5 rounded-[10px] bg-brand-black-soft p-2.5">
                        <dt className="text-[9px] uppercase">installs</dt>
                        <dd className="text-card-title-desktop font-bold">
                          {crew.installs}
                        </dd>
                      </div>
                      <div className="flex flex-1 flex-col-reverse justify-end gap-0.5 rounded-[10px] bg-brand-black-soft p-2.5">
                        <dt className="text-[9px] uppercase">rating</dt>
                        <dd className="text-card-title-desktop font-bold">
                          {crew.rating.toFixed(1)}
                        </dd>
                      </div>
                    </dl>
                    <p className="text-label-desktop leading-[1.55]">
                      {crew.blurb}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
