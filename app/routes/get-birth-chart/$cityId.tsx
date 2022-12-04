import { useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import { json, type LoaderFunction } from '@remix-run/node';

const googkey = "AIzaSyAkkrd0403PghniE302NgrcUTmJ9-J2M4M"

const cityDetails = async (placeId: string) => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${googkey}`
  try {
    const resp = await fetch(url)
    const json = await resp.json() as any
    return {
      formatted_address: json.result.formatted_address,
      lat: json.result.geometry.location.lat,
      lng: json.result.geometry.location.lng,
      utc_offset: json.result.utc_offset
    }
  } catch (e) {
     return {error: e}
  }
}


export const loader: LoaderFunction = async (req) => {
  const placeId = req.params.cityId
  const resp = placeId ? await cityDetails(placeId) : {}
  return json(resp)
}

export default function Index() {
  const cityDetails = useLoaderData()

  return (
    <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
      <p className="mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl">
        {cityDetails.formatted_address}
      </p>
      </div>
  )
}