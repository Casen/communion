export const searchCities = async (query: string | null) => {
  if (!query || query.length < 3) return [];

  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}`;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY || "",
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  };

  try {
    const resp = await fetch(url, options);
    const json = (await resp.json()) as { data: any[] };

    return json.data || [];
  } catch (e) {
    return { error: e };
  }
};
