import { enneagram, northIndianChart } from "lib/astro";
import { type Database } from "lib/database.types";
import { supabase } from "./user.server";

interface ComputeAndStoreChart {
  profile_id: string;
  name: string;
  birth_lat: number;
  birth_lng: number;
  birth_place_id: string;
  birth_place: string;
  birth_time_utc: string;
  birth_time_local: string;
  is_primary: boolean;
}

export async function computeAndStoreChart(dto: ComputeAndStoreChart) {
  const {
    name,
    profile_id,
    birth_lat,
    birth_lng,
    birth_time_utc,
    birth_time_local,
    birth_place,
    birth_place_id,
    is_primary,
  } = dto;

  const astro = northIndianChart({
    lat: birth_lat,
    lng: birth_lng,
    timestamp: birth_time_utc,
  });

  const { data: chart, error: createChartError } = await createChart({
    profile_id,
    is_primary,
    name,
    birth_lat,
    birth_lng,
    birth_place,
    birth_place_id,
    birth_time: birth_time_utc,
    earth: astro.chart.earth,
    water: astro.chart.water,
    fire: astro.chart.fire,
    air: astro.chart.air,
    enneagram: enneagram(birth_time_local),
  });

  if (!chart || createChartError) {
    console.log("createChart ERROR: ", createChartError);
    return { data: null, error: createChartError };
  }

  const createPlanetsInput = astro.chart.planets.map((p) => {
    return {
      chart_id: chart.id,
      name: p.name,
      lng: p.longitude,
      zodiac_name: p.zodiac.name,
      zodiac_degrees: p.zodiacDegrees,
      house: p.house,
      nak_name: p.nakshatra.name,
      nak_sex: p.nakshatra.sex,
      nak_animal: p.nakshatra.animal,
    };
  });

  const { data: planets, error: createPlanetsError } = await createPlanets(
    createPlanetsInput
  );

  if (!planets || !planets.length || createPlanetsError) {
    console.log("createPlanets ERROR: ", createPlanetsError);
    return { data: null, error: createPlanetsError };
  }

  const createHousesInput = astro.chart.houses.map((h) => {
    return {
      chart_id: chart.id,
      position: h.position,
      zodiac_name: h.zodiac.name,
    };
  });

  const { data: houses, error: createHousesError } = await createHouses(
    createHousesInput
  );

  if (!houses || !houses.length || createHousesError) {
    console.log("createHouses ERROR: ", createHousesError);
    return { data: null, error: createHousesError };
  }

  return getChartById(chart.id);
}

export async function createChart(
  dto: Database["public"]["Tables"]["charts"]["Insert"]
) {
  const { data, error } = await supabase
    .from("charts")
    .insert(dto)
    .select()
    .single();

  return { data, error };
}

export async function createPlanets(
  dto: Database["public"]["Tables"]["planets"]["Insert"][]
) {
  const { data, error } = await supabase.from("planets").insert(dto).select();

  return { data, error };
}

export async function createHouses(
  dto: Database["public"]["Tables"]["houses"]["Insert"][]
) {
  console.log("creating houses: ", dto);
  const { data, error } = await supabase.from("houses").insert(dto).select();

  console.log("creating house data :", data);
  console.log("creating house error: ", error);

  return { data, error };
}

export async function getChartById(id: string) {
  return supabase.from("charts").select().eq("id", id).single();
}

export async function getPrimaryChart(profileId: string) {
  const { data, error } = await supabase
    .from("charts")
    .select("*, planets(*), houses(*)")
    .eq("profile_id", profileId)
    .eq("is_primary", true)
    .single();

  return { data, error };
}
