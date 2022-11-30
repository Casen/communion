import swisseph from "swisseph";
import { type SWECALC, type SWEHOUSE, getSignDetails, planetaryBodies } from "./utils"

export const computeChart = () => {
  const date = {year: 1986, month: 4, day: 8, hour: 20.2};
  const location = {lat: 33.8807, lon: -117.8553}
  const iFlag = swisseph.SEFLG_SPEED | swisseph.SEFLG_MOSEPH | swisseph.SEFLG_SIDEREAL

  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

  const tjd = swisseph.swe_julday(date.year, date.month, date.day, date.hour, swisseph.SE_GREG_CAL)

  const te = tjd + (swisseph.swe_deltat(tjd)).delta
  const data = swisseph.swe_houses_ex(te, iFlag, location.lat, location.lon, "P") as SWEHOUSE
  const ascSign = getSignDetails(Math.floor(data.ascendant / 30) + 1)

  const houses: {sign: number, planets: number[]}[] = []
  for (let i = 0; i < 12; i++) {
    let housePos = i + ascSign.position
    if (housePos > 12) housePos = housePos - 12
    const sign = getSignDetails(housePos)
    houses.push({sign: housePos, planets: []})
  }


  planetaryBodies.slice(0,7).forEach((body, idx) => {
    const result = swisseph.swe_calc_ut(tjd, idx, iFlag) as SWECALC
    const sign = getSignDetails(Math.floor(result.longitude / 30) + 1)
    console.log(`${body} in ${sign.name} ${sign.position}`)

    const house = houses.find(house => house.sign === sign.position)
    if (house) house.planets.push(idx)
  })

  const trueNode = swisseph.swe_calc_ut(tjd, 11, iFlag) as SWECALC
  const rahu = trueNode.longitude
  const ketu = rahu+180

  const rahuSign = getSignDetails(Math.floor(rahu / 30) + 1)
  const rahuHouse = houses.find(house => house.sign === rahuSign.position)
  if (rahuHouse) rahuHouse.planets.push(11)

  const ketuSign = getSignDetails(Math.floor(ketu / 30) + 1)
  const ketuHouse = houses.find(house => house.sign === ketuSign.position)
  if (ketuHouse) ketuHouse.planets.push(12)

  return houses
}