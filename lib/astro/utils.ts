import { type MappedZodiac, type Zodiac } from "./interface";

export const convertToDM = (degrees: number) => {
  const deg = Math.floor(degrees);
  const minutes = (degrees - deg) * 60;

  return { degrees: deg, minutes: Math.floor(minutes) };
};

export const setupHouses = (ascendantPosition: number) => {
  const houses: { position: number; sign: number }[] = [];
  for (let i = 0; i < 12; i++) {
    let houseSign = i + ascendantPosition;
    if (houseSign > 12) houseSign = houseSign - 12;
    //const signDetails = getSignDetails(houseSign);
    houses.push({ position: i + 1, sign: houseSign });
  }

  return houses;
};

export const zodiacArr: Array<Zodiac> = [
  { element: "fire", name: "aries" },
  { element: "earth", name: "taurus" },
  { element: "air", name: "gemini" },
  { element: "water", name: "cancer" },
  { element: "fire", name: "leo" },
  { element: "earth", name: "virgo" },
  { element: "air", name: "libra" },
  { element: "water", name: "scorpio" },
  { element: "fire", name: "sagittarius" },
  { element: "earth", name: "capricorn" },
  { element: "air", name: "aquarius" },
  { element: "water", name: "pisces" },
];

export const zodiacMap = new Map<number, MappedZodiac>();
zodiacArr.forEach((z, idx) => {
  zodiacMap.set(idx + 1, { position: idx + 1, ...z });
});

export const getSignDetails = (position: number) => {
  return (
    zodiacMap.get(position) || {
      position: 0,
      name: "unknown",
      element: "unknown",
    }
  );
};

export const planetaryBodies = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "MeanNode",
  "TrueNode",
  "MeanApog",
  "OscuApog",
  "Earth",
  "Chiron",
];

export const planetMap = new Map();
planetaryBodies.forEach((body, idx) => {
  planetMap.set(idx, { position: idx, body });
});

export const nakshatras = [
  { animal: "horse", sex: "M", name: "ashvini" },
  { animal: "elephant", sex: "M", name: "bharani" },
  { animal: "sheep", sex: "F", name: "krittika" },
  { animal: "serpent", sex: "M", name: "rohini" },
  { animal: "serpent", sex: "N", name: "mrigashīrsha" },
  { animal: "dog", sex: "F", name: "ardra" },
  { animal: "cat", sex: "F", name: "punarvasu" },
  { animal: "sheep", sex: "M", name: "pushya" },
  { animal: "cat", sex: "M", name: "ashleshā" },
  { animal: "rat", sex: "M", name: "maghā" },
  { animal: "rat", sex: "F", name: "pūrva phalgunī" },
  { animal: "cow", sex: "M", name: "uttara phalgunī" },
  { animal: "buffalo", sex: "F", name: "hasta" },
  { animal: "tiger", sex: "F", name: "chitra" },
  { animal: "buffalo", sex: "M", name: "svati" },
  { animal: "tiger", sex: "M", name: "vishakha" },
  { animal: "deer", sex: "F", name: "anuradha" },
  { animal: "deer", sex: "M", name: "jyeshtha" },
  { animal: "dog", sex: "N", name: "mula" },
  { animal: "monkey", sex: "M", name: "purva ashadha" },
  { animal: "mongoose", sex: "M", name: "uttara ashadha" },
  { animal: "monkey", sex: "F", name: "shravana" },
  { animal: "lion", sex: "F", name: "dhanishta" },
  { animal: "horse", sex: "N", name: "shatabhisha" },
  { animal: "lion", sex: "M", name: "purva bhadrapada" },
  { animal: "cow", sex: "F", name: "uttara bhādrapadā" },
  { animal: "elephant", sex: "F", name: "revati" },
];

export const nakshatraMap = new Map();
nakshatras.forEach((nak, idx) => {
  nakshatraMap.set(idx + 1, { position: idx, ...nak });
});

export const getNakshatraDetails = (position: number) => {
  return nakshatraMap.get(position) || { position: 0, name: "unknown" };
};

export const yoniScore = (animal1: string, animal2: string) => {
  const scores = YoniMatch[animal1];
  if (!scores) throw new Error(`Unknown animals ${animal1}, ${animal2}`);
  const score = scores[animal2] || 1;
  return score;
};

export const YoniMatch: { [key: string]: { [key: string]: number } } = {
  horse: {
    horse: 4,
    serpent: 3,
    deer: 3,
    monkey: 3,
    elephant: 2,
    sheep: 2,
    dog: 2,
    cat: 2,
    rat: 2,
    mongoose: 2,
  },
  elephant: {
    elephant: 4,
    sheep: 3,
    serpent: 3,
    buffalo: 3,
    monkey: 3,
    horse: 2,
    dog: 2,
    cat: 2,
    rat: 2,
    cow: 2,
    deer: 2,
    mongoose: 2,
  },
  sheep: {
    sheep: 4,
    elephant: 3,
    cow: 3,
    buffalo: 3,
    mongoose: 3,
    horse: 2,
    serpent: 2,
    cat: 2,
    deer: 2,
  },

  serpent: {
    serpent: 4,
    horse: 3,
    elephant: 3,
    sheep: 2,
    dog: 2,
    tiger: 2,
    deer: 2,
    monkey: 2,
    lion: 2,
  },
  dog: {
    dog: 4,
    horse: 2,
    elephant: 2,
    serpent: 2,
    cat: 2,
    cow: 2,
    buffalo: 2,
    monkey: 2,
  },
  cat: {
    cat: 4,
    deer: 3,
    monkey: 3,
    horse: 2,
    elephant: 2,
    sheep: 2,
    dog: 2,
    cow: 2,
    buffalo: 2,
    mongoose: 2,
  },
  rat: {
    rat: 4,
    horse: 2,
    elephant: 2,
    cow: 2,
    buffalo: 2,
    tiger: 2,
    deer: 2,
    monkey: 2,
    lion: 2,
  },
  cow: {
    cow: 4,
    sheep: 3,
    buffalo: 3,
    deer: 3,
    elephant: 2,
    dog: 2,
    cat: 2,
    rat: 2,
    monkey: 2,
    mongoose: 2,
  },
  buffalo: {
    buffalo: 4,
    elephant: 3,
    sheep: 3,
    cow: 3,
    dog: 2,
    cat: 2,
    rat: 2,
    deer: 2,
    monkey: 2,
    mongoose: 2,
  },
  tiger: {
    tiger: 4,
    serpent: 2,
    rat: 2,
    mongoose: 2,
  },
  deer: {
    deer: 4,
    horse: 3,
    cat: 3,
    cow: 3,
    elephant: 2,
    sheep: 2,
    serpent: 2,
    rat: 2,
    buffalo: 2,
    monkey: 2,
    mongoose: 2,
  },
  monkey: {
    monkey: 4,
    horse: 3,
    elephant: 3,
    cat: 3,
    mongoose: 3,
    serpent: 2,
    dog: 2,
    rat: 2,
    cow: 2,
    buffalo: 2,
    deer: 2,
    lion: 2,
  },
  mongoose: {
    mongoose: 4,
    sheep: 3,
    monkey: 3,
    horse: 2,
    elephant: 2,
    cat: 2,
    cow: 2,
    buffalo: 2,
    tiger: 2,
    deer: 2,
    lion: 2,
  },
  lion: {
    lion: 4,
    serpent: 2,
    rat: 2,
    monkey: 2,
    mongoose: 2,
  },
};
