import { json, type LoaderFunction } from '@remix-run/node';

const searchCities = async (query: string | null) => {
  if (!query || query.length < 3) return []

  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '6c9660e30cmshaf19ebf9e32a74fp12e607jsn10dcc6504eb3',
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
  };

  try {
    const resp = await fetch(url, options)
    const json = await resp.json() as { data: any[]}

    return json.data || []

  } catch (e) {
     return {error: e}
  }
  }

export const loader: LoaderFunction = async (req) => {
  const url = new URL(req.request.url);
  return json(
    await searchCities(url.searchParams.get("q"))
  );
}