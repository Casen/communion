import { type LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { calculateAstro } from "lib/astro";
import React from "react";
import { getUser } from "~/session.server";
import { useUser } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  if (!user) return null;

  if (!user.birth_time || !user.birth_lat || !user.birth_lng) return null;

  const astro = calculateAstro({
    timestamp: user.birth_time,
    lat: user.birth_lat,
    lng: user.birth_lng,
  });

  return astro;
}

export default function Index() {
  const user = useUser();
  const chart = useLoaderData<typeof loader>();

  return (
    <React.Fragment>
      {chart ? (
        <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5 sm:space-y-0">
          <p>
            Born in {user.birth_place}, at {user.birth_time}
          </p>
          <p>Enneagram: {chart.enneagram}</p>
          <p>Ascendant: {chart.chart.ascendant?.zodiac?.name}</p>
        </div>
      ) : (
        <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5 sm:space-y-0">
          <h1>Looks like we need some more data!</h1>
          <Link to="/finish-profile" type="button">
            Complete your profile
          </Link>
        </div>
      )}
    </React.Fragment>
  );
}
