import type { ActionFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { CitySearch } from "~/components/city-search";
import { updateUser } from "~/models/user.server";
import { placeDetails } from "~/services/google";
import { getUser, requireUserId } from "~/session.server";

export const meta: MetaFunction = () => {
  return {
    title: "Finish profile",
  };
};

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) {
    return { error: "You must be logged in to update your profile" };
  }

  const form = (await request.formData()) as any;

  const city = await placeDetails(form.get("id"));
  const { lat, lng, utc_offset, place_id, formatted_address } = city;

  if (!lat || !lng || !utc_offset) {
    return { error: "Invalid City" };
  }

  const birthDateTime = dayjs(form.get("datetime") + ":00.000Z").subtract(
    city.utc_offset,
    "minutes"
  );
  const timestamp = birthDateTime.toISOString();

  const updatedProfile = await updateUser(user.id, {
    birth_place_id: place_id,
    birth_lat: lat,
    birth_lng: lng,
    birth_time: timestamp,
    birth_place: formatted_address,
  });

  //const astro = calculateAstro({
  //  timestamp: updatedProfile.birth_time,
  //  lat: updatedProfile.birth_lat,
  //  lng: updatedProfile.birth_lng,
  //});
  return redirect("/profile");
};

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  if (!userId) {
    redirect(`/login`);
  }

  return userId;
}

export default function FinishProfile() {
  const formRef = useRef<HTMLFormElement>(null);
  const transition = useTransition();

  const [cityId, setCityId] = useState("");
  const selectCity = (city: any) => {
    setCityId(city.id);
  };

  const [selectedDate, selectDate] = useState("");
  const handleDateChange = (ev: any) => {
    if (!ev.target["validity"].valid) return;
    const dt = ev.target["value"] + ":00Z";
    selectDate(dt);
  };

  return (
    <div className="flex min-h-full flex-col justify-center rounded-lg bg-white py-8">
      <div className="mx-auto w-full max-w-md px-8">
        <label className="text-sm font-medium" htmlFor="city">
          <span className="block text-gray-700">Birth City</span>
        </label>
        <CitySearch onSelect={selectCity} />
        <Form method="post" ref={formRef}>
          <fieldset
            className="mt-4"
            disabled={transition.state === "submitting"}
          >
            <input hidden={true} value={cityId} name="id" readOnly />
            <label className="text-sm font-medium" htmlFor="datetime">
              <span className="block text-gray-700">Birth Time</span>
            </label>
            <input
              name="datetime"
              className="w-full rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 shadow focus:outline-none"
              type="datetime-local"
              onChange={handleDateChange}
              value={(selectedDate || "").toString().substring(0, 16)}
            />
          </fieldset>
          <button
            className="my-4 w-full rounded-md bg-violet-500 py-2 px-4 font-bold text-white"
            type="submit"
            disabled={!cityId || !selectedDate}
          >
            {transition.state === "submitting" ? "Saving..." : "Save"}
          </button>
        </Form>
      </div>
    </div>
  );
}
