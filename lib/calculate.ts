import type { City } from "./types";

export interface CalculationResult {
  monthlyConsumptionKwh: number;
  consumptionToCoverKwh: number;
  panelGenerationKwhPerMonth: number;
  panels: number;
  minimumApplied: boolean;
  totalGenerationKwhPerMonth: number;
  investment: number;
  investmentAfterFederalCredit: number;
  monthlySavingsBeforeCap: number;
  monthlySavings: number;
  savingsCapped: boolean;
  paybackYears: number;
}

export function calculate(
  city: City,
  monthlyBill: number,
  coverage: number,
): CalculationResult {
  if (!Number.isFinite(monthlyBill) || monthlyBill < 0) {
    throw new RangeError("monthlyBill must be a finite, non-negative number.");
  }

  if (!Number.isFinite(coverage) || coverage < 0 || coverage > 1) {
    throw new RangeError("coverage must be a finite number between 0 and 1.");
  }

  const monthlyConsumptionKwh = monthlyBill / city.utilityRatePerKwh;
  const consumptionToCoverKwh = monthlyConsumptionKwh * coverage;
  const panelGenerationKwhPerMonth =
    (city.panelWatts / 1000) *
    city.peakSunHoursPerDay *
    30 *
    city.performanceRatio;
  const panelQuotient =
    Math.round(
      (consumptionToCoverKwh / panelGenerationKwhPerMonth) * 1_000_000,
    ) / 1_000_000;
  const requiredPanels = Math.ceil(panelQuotient);
  const minimumApplied = requiredPanels < city.minPanels;
  const panels = minimumApplied ? city.minPanels : requiredPanels;
  const totalGenerationKwhPerMonth =
    panels * panelGenerationKwhPerMonth;
  const investment = panels * city.panelWatts * city.costPerWattInstalled;
  const investmentAfterFederalCredit =
    investment * (1 - city.federalCreditRate);
  const monthlySavingsBeforeCap =
    totalGenerationKwhPerMonth * city.utilityRatePerKwh;
  const savingsCapped = monthlySavingsBeforeCap > monthlyBill;
  const monthlySavings = savingsCapped
    ? monthlyBill
    : monthlySavingsBeforeCap;
  const paybackYears =
    monthlySavings === 0
      ? Number.POSITIVE_INFINITY
      : investmentAfterFederalCredit / (monthlySavings * 12);

  return {
    monthlyConsumptionKwh,
    consumptionToCoverKwh,
    panelGenerationKwhPerMonth,
    panels,
    minimumApplied,
    totalGenerationKwhPerMonth,
    investment,
    investmentAfterFederalCredit,
    monthlySavingsBeforeCap,
    monthlySavings,
    savingsCapped,
    paybackYears,
  };
}
