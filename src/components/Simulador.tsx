"use client";

import { useState, type CSSProperties } from "react";
import { calculate } from "../../lib/calculate";
import type { City } from "../../lib/types";

interface SimuladorProps {
  city: City;
}

const BILL = { min: 40, max: 600, step: 10 } as const;
const COVERAGE = { min: 50, max: 100, step: 5 } as const;

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function fillPercent(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}

function StepButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex size-6 items-center justify-center rounded-full text-brand-black disabled:opacity-30 md:hidden"
    >
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        {children}
      </svg>
    </button>
  );
}

interface SliderProps {
  id: string;
  label: string;
  hint: string;
  value: number;
  valueText: string;
  min: number;
  max: number;
  step: number;
  minText: string;
  maxText: string;
  onChange: (value: number) => void;
}

function Slider({
  id,
  label,
  hint,
  value,
  valueText,
  min,
  max,
  step,
  minText,
  maxText,
  onChange,
}: SliderProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-[3px]">
          <label
            htmlFor={id}
            className="text-label-mobile md:text-label-desktop"
          >
            {label}
          </label>
          <span className="text-caption-mobile md:text-caption-desktop">
            {hint}
          </span>
        </div>
        <output
          htmlFor={id}
          className="text-display-mobile font-bold leading-none"
        >
          {valueText}
        </output>
      </div>
      <div className="flex items-center justify-between md:hidden">
        <StepButton
          label={`Decrease ${label.toLowerCase()}`}
          onClick={() => onChange(clamp(value - step, min, max))}
          disabled={value <= min}
        >
          <path d="M3 8h10" />
        </StepButton>
        <StepButton
          label={`Increase ${label.toLowerCase()}`}
          onClick={() => onChange(clamp(value + step, min, max))}
          disabled={value >= max}
        >
          <path d="M3 8h10M8 3v10" />
        </StepButton>
      </div>
      <input
        id={id}
        type="range"
        className="range-brand"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--fill": `${fillPercent(value, min, max)}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="flex justify-between text-caption-mobile md:text-caption-desktop">
        <span>{minText}</span>
        <span>{maxText}</span>
      </div>
    </div>
  );
}

export default function Simulador({ city }: SimuladorProps) {
  const [bill, setBill] = useState(
    () =>
      city.householdProfiles.find((profile) => profile.typicalBill >= 200)
        ?.typicalBill ?? BILL.min,
  );
  const [coverage, setCoverage] = useState(80);

  const result = calculate(city, bill, coverage / 100);
  const federalCreditPercent = Math.round(city.federalCreditRate * 100);

  const assumptions = [
    { label: "Utility rate", value: `$${city.utilityRatePerKwh.toFixed(2)}/kWh` },
    { label: "Panel output", value: `${city.panelWatts}W each` },
    { label: "Peak sun", value: `${city.peakSunHoursPerDay} hours/day` },
    { label: "Performance ratio", value: `${city.performanceRatio}` },
    { label: "Minimum system", value: `${city.minPanels} panels` },
  ];

  const formulas = [
    "Monthly usage = electricity bill ÷ utility rate",
    "Target usage = monthly usage × coverage",
    "Panel generation = panel kW × peak sun hours × 30 × performance ratio",
    "Panels = target usage ÷ panel generation, rounded up",
    "Investment = panels × panel watts × installed cost/W",
    `Federal credit = ${federalCreditPercent}%`,
    "Savings = generation × utility rate, capped at monthly bill",
    "Payback = post-credit investment ÷ annual savings",
  ];

  return (
    <section
      id="simulador"
      aria-labelledby="simulador-title"
      className="bg-brand-white px-5 pb-10 pt-8 text-brand-black md:px-8 md:pb-20 md:pt-16 lg:px-20"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 md:gap-14">
        <div className="flex flex-col gap-3 md:gap-5">
          <h2
            id="simulador-title"
            className="text-section-title-mobile font-bold leading-[1.06] md:text-section-title-desktop"
          >
            Estimate your solar savings
          </h2>
          <p className="text-section-body-mobile leading-[1.65] md:text-section-body-desktop">
            Based on your electricity bill and the amount of energy you want to
            cover. Estimates are based on the information provided and{" "}
            {city.city}-area utility rates.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-4">
          <div className="flex flex-col gap-6 rounded-[20px] border border-brand-orange-light bg-brand-paper p-6 shadow-brand-orange md:gap-7 md:p-8 lg:w-[460px] lg:shrink-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-card-title-mobile font-bold md:text-card-title-desktop">
                Your energy profile
              </h3>
              <p className="text-label-mobile">
                {city.city} metro · {city.utilityName}
              </p>
            </div>

            <Slider
              id="monthly-bill"
              label="Monthly electricity bill"
              hint={`$${BILL.step} increments`}
              value={bill}
              valueText={usd.format(bill)}
              min={BILL.min}
              max={BILL.max}
              step={BILL.step}
              minText={usd.format(BILL.min)}
              maxText={usd.format(BILL.max)}
              onChange={setBill}
            />

            <Slider
              id="solar-coverage"
              label="Solar coverage"
              hint={`${COVERAGE.step}-point increments`}
              value={coverage}
              valueText={`${coverage}%`}
              min={COVERAGE.min}
              max={COVERAGE.max}
              step={COVERAGE.step}
              minText={`${COVERAGE.min}%`}
              maxText={`${COVERAGE.max}%`}
              onChange={setCoverage}
            />

            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-[3px]">
                <h3 className="text-label-mobile md:text-label-desktop">
                  Quick estimate
                </h3>
                <p className="text-caption-mobile md:text-caption-desktop">
                  Not sure about your monthly bill? Choose your home type.
                </p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {city.householdProfiles.map((profile) => (
                  <li key={profile.label}>
                    <button
                      type="button"
                      aria-pressed={bill === profile.typicalBill}
                      onClick={() =>
                        setBill(clamp(profile.typicalBill, BILL.min, BILL.max))
                      }
                      className="rounded-full border border-brand-white bg-brand-orange-light px-3.5 py-[7px] text-left text-body-mobile aria-pressed:border-brand-orange aria-pressed:bg-brand-orange aria-pressed:text-brand-white"
                    >
                      {profile.label} · {usd.format(profile.typicalBill)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {result.minimumApplied && (
              <div
                role="status"
                className="flex gap-2.5 rounded-[10px] bg-brand-white p-3.5"
              >
                <svg
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-brand-orange"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                >
                  <circle cx="8" cy="8" r="6.5" />
                  <path d="M8 7.25v3.5M8 5.25h.01" />
                </svg>
                <p className="text-body-mobile leading-[1.55]">
                  <strong className="font-bold">
                    {city.minPanels}-panel minimum.
                  </strong>{" "}
                  Your estimate requires fewer panels, but {city.city}{" "}
                  installations start at {city.minPanels} panels.
                </p>
              </div>
            )}
          </div>

          <div
            aria-live="polite"
            className="flex flex-col gap-5 rounded-[20px] bg-brand-black p-6 md:p-8 lg:flex-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-[5px]">
                <h3 className="text-card-title-mobile font-bold text-brand-white md:text-card-title-desktop">
                  Your estimated system
                </h3>
                <p className="text-label-mobile text-brand-white/70 md:hidden">
                  {usd.format(bill)} monthly bill · {coverage}% target coverage
                </p>
              </div>
              <div
                aria-hidden="true"
                className="hidden size-9 items-center justify-center rounded-[10px] bg-brand-black-soft md:flex"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="#f96501"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                >
                  <path d="M9 1.5 3 9h4.5L7 14.5 13 7H8.5L9 1.5Z" />
                </svg>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3">
              <div className="flex min-h-[130px] flex-col gap-1.5 rounded-[14px] border border-brand-white bg-brand-white p-5">
                <dt className="text-caption-mobile font-semibold uppercase">
                  Panels
                </dt>
                <dd className="flex flex-col gap-1.5">
                  <span className="text-result-mobile font-bold leading-none md:text-result-desktop">
                    {result.panels}
                  </span>
                  <span className="text-caption-mobile leading-[1.4] md:text-caption-desktop">
                    Rounded up to the nearest whole panel
                  </span>
                </dd>
              </div>

              <div className="flex min-h-[130px] flex-col gap-1.5 rounded-[14px] border border-brand-orange-light bg-brand-orange p-5">
                <dt className="text-caption-mobile font-semibold uppercase">
                  Estimated monthly savings
                </dt>
                <dd className="flex flex-col gap-1.5">
                  <span className="text-result-mobile font-bold leading-none text-brand-white md:text-result-desktop">
                    {usd.format(result.monthlySavings)}
                  </span>
                  <span className="text-caption-mobile leading-[1.4] md:text-caption-desktop">
                    {result.savingsCapped
                      ? `Capped at your current electricity bill. Uncapped, your system would generate ${usd.format(result.monthlySavingsBeforeCap)}/mo.`
                      : "Estimated from your system's monthly generation"}
                  </span>
                </dd>
              </div>

              <div className="col-span-2 flex min-h-[130px] flex-col gap-1.5 rounded-[14px] border border-brand-white bg-brand-white p-5 md:col-span-1">
                <dt className="text-caption-mobile font-semibold uppercase">
                  After federal credit
                </dt>
                <dd className="flex flex-col gap-1.5">
                  <span className="text-result-mobile font-bold leading-none md:text-result-desktop">
                    {usd.format(result.investmentAfterFederalCredit)}
                  </span>
                  <span className="text-caption-mobile leading-[1.4] md:text-caption-desktop">
                    {federalCreditPercent}% federal credit applied
                  </span>
                </dd>
              </div>

              <div className="col-span-2 flex min-h-[130px] flex-col gap-1.5 rounded-[14px] border border-brand-white bg-brand-white p-5 md:col-span-1">
                <dt className="text-caption-mobile font-semibold uppercase">
                  Estimated payback
                </dt>
                <dd className="flex flex-col gap-1.5">
                  <span className="text-result-mobile font-bold leading-none md:text-result-desktop">
                    {result.paybackYears.toFixed(1)} yrs
                  </span>
                  <span className="text-caption-mobile leading-[1.4] md:text-caption-desktop">
                    Post-credit investment ÷ annual savings
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:gap-5">
          <h3 className="text-card-title-mobile font-bold md:text-card-title-desktop">
            Estimate based on {city.city} data
          </h3>
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {assumptions.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1.5 rounded-[10px] bg-brand-paper p-4"
              >
                <dt className="text-caption-mobile font-semibold uppercase">
                  {item.label}
                </dt>
                <dd className="text-label-mobile font-semibold md:text-label-desktop">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <details
          open
          className="group rounded-[14px] bg-brand-paper p-6 md:mt-4"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
            <span className="text-caption-mobile font-bold uppercase text-brand-orange">
              How we calculate your estimate
            </span>
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M3 8h10" />
              <path d="M8 3v10" className="group-open:hidden" />
            </svg>
          </summary>
          <ul className="mt-4 flex list-disc flex-col gap-1.5 pl-5 text-label-mobile leading-[1.4] md:text-label-desktop">
            {formulas.map((formula) => (
              <li key={formula}>{formula}</li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
