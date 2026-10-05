import { describe, expect, it } from "vitest";
import phoenix from "../data/cities/phoenix-az.json";
import { calculate } from "./calculate";

describe("calculate", () => {
  it.each([
    {
      bill: 220,
      coverage: 0.8,
      panels: 17,
      investmentAfterFederalCredit: 14726.25,
      monthlySavings: 179.01,
      paybackYears: 6.9,
    },
    {
      bill: 430,
      coverage: 0.8,
      panels: 33,
      investmentAfterFederalCredit: 28586.25,
      monthlySavings: 347.49,
      paybackYears: 6.9,
    },
    {
      bill: 430,
      coverage: 1,
      panels: 41,
      investmentAfterFederalCredit: 35516.25,
      monthlySavings: 430,
      paybackYears: 6.9,
      savingsCapped: true,
      monthlySavingsBeforeCap: 431.73,
    },
    {
      bill: 90,
      coverage: 0.8,
      panels: 8,
      investmentAfterFederalCredit: 6930,
      monthlySavings: 84.24,
      paybackYears: 6.9,
      minimumApplied: true,
    },
    {
      bill: 60,
      coverage: 0.8,
      panels: 8,
      investmentAfterFederalCredit: 6930,
      monthlySavings: 60,
      paybackYears: 9.6,
      savingsCapped: true,
      minimumApplied: true,
    },
    {
      bill: 60,
      coverage: 0.5,
      panels: 8,
      investmentAfterFederalCredit: 6930,
      monthlySavings: 60,
      paybackYears: 9.6,
      savingsCapped: true,
      minimumApplied: true,
    },
  ])(
    "calculates a $bill estimate at $coverage coverage",
    ({
      bill,
      coverage,
      panels,
      investmentAfterFederalCredit,
      monthlySavings,
      paybackYears,
      savingsCapped,
      minimumApplied,
      monthlySavingsBeforeCap,
    }) => {
      const result = calculate(phoenix, bill, coverage);

      expect(result.panels).toBe(panels);
      expect(result.investmentAfterFederalCredit).toBeCloseTo(
        investmentAfterFederalCredit,
        2,
      );
      expect(result.monthlySavings).toBeCloseTo(monthlySavings, 2);
      expect(Number(result.paybackYears.toFixed(1))).toBe(paybackYears);

      if (savingsCapped !== undefined) {
        expect(result.savingsCapped).toBe(savingsCapped);
      }
      if (minimumApplied !== undefined) {
        expect(result.minimumApplied).toBe(minimumApplied);
      }
      if (monthlySavingsBeforeCap !== undefined) {
        expect(result.monthlySavingsBeforeCap).toBeCloseTo(
          monthlySavingsBeforeCap,
          2,
        );
      }
    },
  );

  it("rounds the panel quotient to six decimal places before applying ceil", () => {
    const billForEightPanels =
      phoenix.minPanels *
      ((phoenix.panelWatts / 1000) *
        phoenix.peakSunHoursPerDay *
        30 *
        phoenix.performanceRatio) *
      phoenix.utilityRatePerKwh;
    const result = calculate(phoenix, billForEightPanels * (1 + 1e-8), 1);

    expect(result.panels).toBe(phoenix.minPanels);
    expect(result.minimumApplied).toBe(false);
  });

  it("rejects invalid bill and coverage inputs", () => {
    expect(() => calculate(phoenix, -1, 0.8)).toThrow(RangeError);
    expect(() => calculate(phoenix, 220, 1.01)).toThrow(RangeError);
  });
});
