import { computeChart } from "./chart.server";
import { computeEnneagram } from "./enneagram";
import { type ChartInput } from "./interface";

export const northIndianChart = (input: ChartInput) => {
  const vedicBirthChart = computeChart(input);

  return {
    chart: vedicBirthChart,
  };
};

export const enneagram = (timestamp: string) => {
  return computeEnneagram(timestamp);
};
