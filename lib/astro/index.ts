import { computeChart } from "./chart";
import { computeEnneagram } from "./enneagram";
import { type ChartInput } from "./interface";

export const calculateAstro = (input: ChartInput) => {
  const vedicBirthChart = computeChart(input);
  const enneagram = computeEnneagram(input.timestamp);

  return {
    chart: vedicBirthChart,
    enneagram,
  };
};
