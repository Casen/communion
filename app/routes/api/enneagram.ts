import { json, type LoaderFunction } from '@remix-run/node';
import { calculate } from 'lib/enneagram';
import { computeChart } from 'lib/chart';

export const loader: LoaderFunction = async (req) => {
  return json(
    {
      enneagram: calculate(12141986),
      birth_chart: computeChart()
    }
  );
}