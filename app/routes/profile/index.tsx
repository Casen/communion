import { type LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import { getPrimaryChart } from "~/models/chart.server";
import { getUser } from "~/session.server";
import { useUser } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  if (!user) return null;

  const { data, error } = await getPrimaryChart(user.id);

  console.log("error getting chart: ", error);
  if (!data || error) return null;

  return data;
}

export default function Index() {
  const user = useUser();
  const chart = useLoaderData<typeof loader>();

  return (
    <React.Fragment>
      {chart ? (
        <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5 sm:space-y-0">
          <p>Name: {user.name}</p>
          <p>
            Born in {chart.birth_place}, at {chart.birth_time}
          </p>
          <p>Enneagram: {chart.enneagram}</p>
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
