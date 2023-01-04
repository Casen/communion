import { northIndianChart } from ".";

const Chart1 = {
  timestamp: "2012-04-03T00:38:00+00:00",
  lat: 45.515232,
  lng: -122.6783853,
};

test("Validate chart", () => {
  const { chart } = northIndianChart(Chart1);
  expect(chart.planets).toHaveLength(13);
  expect(chart.houses).toHaveLength(12);

  expect(chart.earth >= 0).toBe(true);
  expect(chart.water >= 0).toBe(true);
  expect(chart.fire >= 0).toBe(true);
  expect(chart.air >= 0).toBe(true);

  chart.planets.forEach((planet) => {
    expect(planet.zodiac.name === "unknown").toBeFalsy();
    expect(planet.nakshatra.name === "unknown").toBeFalsy();
  });

  expect(true).toBe(true);
});

export {};
