
export interface SWECALC {
  longitude: number
  latitude: number
  distance: number
  longitudeSpeed: number
  latitudeSpeed: number
  distanceSpeed: number
  rflag: number
}

export interface SWEHOUSE {
  house: number []
  ascendant: number
  mc: number
  armc: number
  vertex: number
  equatorialAscendant: number
  kochCoAscendant: number
  munkaseyCoAscendant: number
  munkaseyPolarAscendant: number
}

interface Place {
  lat: number
  lon: number
  tz: number
}

export const zodiacArr = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
export const zodiacMap = new Map()
zodiacArr.forEach((name, idx) => {
  zodiacMap.set(idx+1, {position: idx+1, name})
})

export const getSignDetails = (position: number) => {
  return zodiacMap.get(position) || {position: 0, name: 'unknown'}
}

export const planetaryBodies = [
"Sun",
"Moon",
"Mercury",
"Venus",
"Mars",
"Jupiter",
"Saturn",
"Uranus",
"Neptune",
"Pluto",
"MeanNode",
"TrueNode",
"MeanApog",
"OscuApog",
"Earth",
"Chiron"
]

export const planetMap = new Map()
planetaryBodies.forEach((body, idx) => {
  planetMap.set(idx, {position: idx, body})
})
