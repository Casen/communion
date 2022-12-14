import { redirect, type ActionFunction } from "@remix-run/node";
import { Form, Link, useSubmit, useTransition } from "@remix-run/react";
import dayjs from "dayjs";
import { calculateAstro } from "lib/astro";
import React, { useRef, useState } from "react";
import { CitySearch } from "~/components/city-search";
import { updateUser } from "~/models/user.server";
import { placeDetails } from "~/services/google";
import { getUser } from "~/session.server";
import { useOptionalUser } from "~/utils";

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
  return { ...updatedProfile };
  // return redirect(`/get-birth-chart/${form.get('id')}`);
};

export default function Index() {
  const user = useOptionalUser();
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
    <React.Fragment>
      <p className="mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl">
        Enter your birth location to get started
      </p>
      <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
        {user ? (
          <Link
            to="/notes"
            className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-violet-700 shadow-sm hover:bg-violet-50 sm:px-8"
          >
            View Notes for {user.email}
          </Link>
        ) : (
          <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5 sm:space-y-0">
            <CitySearch onSelect={selectCity} />
            <Form method="post" ref={formRef}>
              <fieldset disabled={transition.state === "submitting"}>
                <input hidden={true} value={cityId} name="id" readOnly />
                <input
                  name="datetime"
                  className="w-full rounded-md border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none"
                  type="datetime-local"
                  onChange={handleDateChange}
                  value={(selectedDate || "").toString().substring(0, 16)}
                />
              </fieldset>
              <button
                className="my-4 w-full rounded-md bg-violet-500 py-2 px-4 font-bold text-white"
                type="submit"
              >
                {transition.state === "submitting"
                  ? "Calculating..."
                  : "Calculate"}
              </button>
            </Form>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
