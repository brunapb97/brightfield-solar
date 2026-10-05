import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { City } from "./types";

const CITIES_DIR = path.join(process.cwd(), "data", "cities");

export async function getAllCitySlugs(): Promise<string[]> {
  const files = await readdir(CITIES_DIR);
  return files
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.slice(0, -".json".length));
}

export async function getCity(slug: string): Promise<City | null> {
  const slugs = await getAllCitySlugs();
  if (!slugs.includes(slug)) return null;

  const raw = await readFile(path.join(CITIES_DIR, `${slug}.json`), "utf-8");
  return JSON.parse(raw) as City;
}
