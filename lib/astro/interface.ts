export interface ChartInput {
  timestamp: string;
  lat: number;
  lng: number;
}

export interface SWECALC {
  longitude: number;
  latitude: number;
  distance: number;
  longitudeSpeed: number;
  latitudeSpeed: number;
  distanceSpeed: number;
  rflag: number;
}

export interface SWEHOUSE {
  house: number[];
  ascendant: number;
  mc: number;
  armc: number;
  vertex: number;
  equatorialAscendant: number;
  kochCoAscendant: number;
  munkaseyCoAscendant: number;
  munkaseyPolarAscendant: number;
}

export interface Zodiac {
  element: string;
  name: string;
}

export interface MappedZodiac extends Zodiac {
  position: number;
}

export interface Nakshatra {
  name: string;
  animal: string;
  sex: string;
}

export interface Planet {
  degrees: number;
  minutes: number;
  name: string;
  zodiac: Zodiac;
  nakshatra: Nakshatra;
  house: number;
}

export interface House {
  position: number;
  zodiac: Zodiac;
}

export interface VedicChart {
  ascendant: Planet;
  planets: Planet[];
  houses: House[];
  earth: number;
  water: number;
  fire: number;
  air: number;
}
