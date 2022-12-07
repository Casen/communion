import dayjs from "dayjs";
import swisseph from "swisseph";
import {
  convertToDM,
  getNakshatraDetails,
  getSignDetails,
  planetaryBodies,
  setupHouses,
} from "./utils";

import {
  type ChartInput,
  type Planet,
  type SWECALC,
  type SWEHOUSE,
  type VedicChart,
} from "./interface";

export const computeChart = (input: ChartInput) => {
  const { timestamp, lat, lng } = input;
  const timestr = timestamp.split("T")[1];
  const [hours, minutes] = timestr.split(":");
  //const date = {year: 1986, month: 4, day: 8, hour: 20.2};
  //const location = {lat: 33.8807, lon: -117.8553}

  const date = dayjs(timestamp);
  const hoursMinutes = parseInt(hours) + parseInt(minutes) / 60;
  //TODO validation

  const iFlag =
    swisseph.SEFLG_SPEED | swisseph.SEFLG_MOSEPH | swisseph.SEFLG_SIDEREAL;

  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

  // const tjd = swisseph.swe_julday(date.year, date.month, date.day, date.hour, swisseph.SE_GREG_CAL)
  const tjd = swisseph.swe_julday(
    date.get("year"),
    date.get("month") + 1,
    date.date(),
    hoursMinutes,
    swisseph.SE_GREG_CAL
  );

  const bodies: Array<{ name: string; longitude: number }> = [];

  const te = tjd + swisseph.swe_deltat(tjd).delta;
  const data = swisseph.swe_houses_ex(te, iFlag, lat, lng, "P") as SWEHOUSE;
  console.dir("swe house: ", data);

  //Push ascendant onto bodies array
  bodies.push({ name: "ascendant", longitude: data.ascendant });

  //Push planet calcs onto bodies array
  planetaryBodies.slice(0, 7).forEach((body, idx) => {
    const result = swisseph.swe_calc_ut(tjd, idx, iFlag) as SWECALC;
    bodies.push({ name: body, longitude: result.longitude });
  });

  const trueNode = swisseph.swe_calc_ut(tjd, 11, iFlag) as SWECALC;
  const rahu = trueNode.longitude;
  const ketu = rahu + 180;

  //Push rahu and ketu onto bodies array
  bodies.push({ name: "rahu", longitude: rahu });
  bodies.push({ name: "ketu", longitude: ketu });

  let houses: { position: number; sign: number }[] = [];
  const planets: Planet[] = bodies.map((body) => {
    const signPosition = Math.floor(body.longitude / 30) + 1;
    const sign = getSignDetails(signPosition);
    const nak = getNakshatraDetails(Math.ceil((body.longitude * 27) / 360));
    const signDeg = body.longitude - (signPosition - 1) * 30;
    const { degrees, minutes } = convertToDM(signDeg);

    if (body.name === "ascendant") {
      houses = setupHouses(sign.position);
    }
    const house = houses.find((house) => house.sign === sign.position);

    return {
      degrees,
      minutes,
      name: body.name,
      zodiac: sign,
      house: house?.position || 0,
      nakshatra: nak,
    };
  });

  //const ascSign = getSignDetails(Math.floor(data.ascendant / 30) + 1);

  const chart: Partial<VedicChart> = {
    ascendant: planets.slice(0, 1)[0],
    planets: planets.slice(1),
    houses: houses.map((h) => {
      return { position: h.position, zodiac: getSignDetails(h.sign) };
    }),
  };

  console.dir(chart.ascendant);
  console.dir(chart.planets);
  console.dir(chart.houses);
  return chart;
};
