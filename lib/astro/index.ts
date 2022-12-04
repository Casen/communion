import { type ChartInput, computeChart } from "./chart";
import { computeEnneagram } from "./enneagram";

export const calculateAstro = (input: ChartInput) => {
  const vedicBirthChart = computeChart(input)
  const enneagram = computeEnneagram(input.timestamp)

  return {
    chart: vedicBirthChart,
    enneagram
  }
}