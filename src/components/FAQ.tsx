"use client";

import { useState } from "react";
import Image from "next/image";
import { calculate } from "../../lib/calculate";
import type { City } from "../../lib/types";

interface FAQProps {
  city: City;
}

const REPRESENTATIVE_COVERAGE = 0.8;

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function FAQ({ city }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const toggle = (index: number) =>
    setOpenItems((current) => {
      const next = new Set(current);
      if (!next.delete(index)) next.add(index);
      return next;
    });
  const representativeBill =
    city.householdProfiles.find((profile) => profile.typicalBill >= 200)
      ?.typicalBill ?? city.householdProfiles[0].typicalBill;
  const result = calculate(city, representativeBill, REPRESENTATIVE_COVERAGE);
  const coveragePercent = Math.round(REPRESENTATIVE_COVERAGE * 100);
  const federalPercent = Math.round(city.federalCreditRate * 100);
  const paybackYears = result.paybackYears.toFixed(1);

  const answers = [
    `It depends on the bill and the coverage goal. For the representative ${usd.format(representativeBill)}/month ${city.utilityName} household targeting ${coveragePercent}% coverage, the estimate is ${result.panels} panels. Panels are rounded up to whole units and the installation minimum is ${city.minPanels} panels.`,
    `The ${result.panels}-panel example is ${usd.format(result.investment)} before incentives and ${usd.format(result.investmentAfterFederalCredit)} after the ${federalPercent}% federal credit. ${city.stateIncentiveNote}`,
    `For the representative example, estimated savings are ${usd.format(result.monthlySavings)} per month and simple payback is about ${paybackYears} years, roughly ${Math.round(result.paybackYears)} years. Payback is post-credit investment divided by annual savings.`,
    `Unused generation can become ${city.utilityName} bill credits. Those credits offset utility charges; they never become a cash payment, so the savings estimate is always capped at the customer's monthly electric bill.`,
    `${city.city} permitting averages ${city.avgPermitDays} days. Installation is typically one day, followed by one to two weeks for ${city.utilityName} interconnection. The team handles ${city.city} permitting and ${city.utilityName} paperwork.`,
    `An owned solar system transfers with the home and can contribute value for the next owner. Your system documents and ownership details become part of the home transfer rather than a separate monthly solar obligation.`,
  ];

  const items = city.faq.slice(0, answers.length).map((item, index) => ({
    question: item.q,
    answer: answers[index],
  }));

  return (
    <section
      id="FAQ"
      aria-labelledby="faq-title"
      className="bg-brand-white px-5 pt-6 pb-10 text-brand-black lg:px-20 lg:pt-[111px] lg:pb-20"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-5 lg:gap-14">
        <div className="flex flex-col gap-4 lg:w-[680px] lg:gap-5">
          <h2
            id="faq-title"
            className="text-section-title-mobile font-bold leading-[1.06] lg:text-section-title-desktop"
          >
            {city.city} solar, without the fine-print fog
          </h2>
          <p className="text-section-body-mobile leading-[1.65] lg:text-section-body-desktop">
            The numbers, timing, and utility mechanics homeowners ask us about
            most.
          </p>
        </div>

        <ol className="grid grid-cols-1 items-start gap-2.5 lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-3">
          {items.map((item, index) => {
            const isOpen = openItems.has(index);
            const panelId = `faq-answer-${index}`;
            const buttonId = `faq-question-${index}`;

            return (
              <li key={item.question}>
                <article className="rounded-2xl border border-brand-white bg-brand-paper p-7">
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(index)}
                      className="flex w-full cursor-pointer flex-col gap-3.5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
                    >
                      <span className="flex w-full items-start justify-between">
                        <span
                          aria-hidden="true"
                          className="text-base font-semibold text-brand-orange"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Image
                          src={
                            isOpen
                              ? "/images/faq/minus.svg"
                              : "/images/faq/plus.svg"
                          }
                          alt=""
                          width={20}
                          height={20}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="text-label-mobile font-bold leading-[1.2] lg:text-card-title-desktop">
                        {item.question}
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows] duration-200 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden" inert={!isOpen}>
                      <p className="pt-3.5 text-caption-mobile leading-[1.65] lg:text-label-desktop">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
