const googkey = "";

export const placeDetails = async (placeId: string) => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${googkey}`;
  try {
    const resp = await fetch(url);
    const json = (await resp.json()) as any;
    return {
      place_id: json.result.place_id as string,
      formatted_address: json.result.formatted_address as string,
      lat: json.result.geometry.location.lat as number,
      lng: json.result.geometry.location.lng as number,
      utc_offset: json.result.utc_offset as number,
    };
  } catch (e) {
    return { error: e };
  }
};

export const placesAuto = async (query: string | null) => {
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${googkey}`;
  try {
    const resp = await fetch(url);
    const json = (await resp.json()) as { predictions: any[]; status: string };

    return json.predictions.map((gp) => ({
      id: gp.place_id,
      description: gp.description,
    }));
  } catch (e) {
    return { error: e };
  }
};
