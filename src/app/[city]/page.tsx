import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Simulador from "@/components/Simulador";
import Passos from "@/components/Passos";
import ProvaSocial from "@/components/ProvaSocial";
import FAQ from "@/components/FAQ";
import ChamadaFinal from "@/components/ChamadaFinal";
import { getAllCitySlugs, getCity } from "../../../lib/cities";

type CityPageProps = {
  params: Promise<{ city: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllCitySlugs();
  return slugs.map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = await getCity(citySlug);

  if (!city) return {};

  return {
    title: `Solar savings in ${city.city}, ${city.state} | Brightfield Solar`,
    description: `Estimate your ${city.utilityName} bill savings with solar in ${city.city}, ${city.stateFull}. ${city.installsCompleted.toLocaleString("en-US")} installs completed by ${city.crewsAvailable} local crews.`,
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { city: citySlug } = await params;
  const city = await getCity(citySlug);

  if (!city) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col">
      <Hero city={city} />
      <Simulador city={city} />
      <Passos city={city} />
      <ProvaSocial city={city} />
      <FAQ city={city} />
      <ChamadaFinal city={city} />
    </main>
  );
}