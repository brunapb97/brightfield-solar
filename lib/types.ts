export interface HouseholdProfile {
  label: string;
  typicalBill: number;
}

export interface Crew {
  name: string;
  installs: number;
  rating: number;
  since: number;
  blurb: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  neighborhood: string;
  date: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface City {
  slug: string;
  city: string;
  state: string;
  stateFull: string;
  metroArea: string;
  utilityName: string;
  utilityRatePerKwh: number;
  peakSunHoursPerDay: number;
  panelWatts: number;
  performanceRatio: number;
  costPerWattInstalled: number;
  minPanels: number;
  federalCreditRate: number;
  stateIncentiveNote: string;
  installsCompleted: number;
  crewsAvailable: number;
  avgRating: number;
  avgPermitDays: number;
  phone: string;
  popularNeighborhoods: string[];
  householdProfiles: HouseholdProfile[];
  crews: Crew[];
  testimonials: Testimonial[];
  faq: FaqItem[];
}
