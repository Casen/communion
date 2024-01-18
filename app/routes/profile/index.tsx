import { type LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import React from "react";
import { AiOutlineFire } from "react-icons/ai";
import { FiWind } from "react-icons/fi";
import { IoEarth, IoWater } from "react-icons/io5";
import { getPrimaryChart } from "~/models/chart.server";
import { getUser } from "~/session.server";
import { useUser } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  if (!user) return null;

  const { data, error } = await getPrimaryChart(user.id);

  console.log("error getting chart: ", error);
  if (!data || error) return null;

  console.log("got a chart: ", data);
  return data;
}

export default function Index() {
  const user = useUser();
  const chart = useLoaderData();
  const planets = chart?.planets
    ? (chart.planets as Array<typeof chart.planets>)
    : [];

  const birthTime = dayjs(chart?.birth_time).format("MM/DD/YYYY");

  return (
    <React.Fragment>
      {chart ? (
        <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5 sm:space-y-0">
          <p>Name: {user.name}</p>
          <p>
            Born in {chart.birth_place}, at {birthTime}
          </p>
          <p>Enneagram: {chart.enneagram}</p>
          <div className="p4 flex items-center">
            <div className="flex items-center">
              <IoEarth />
              <p className="ml-2 mr-4">{chart.earth}</p>
            </div>
            <div className="flex items-center">
              <IoWater />
              <p className="ml-2 mr-4">{chart.water}</p>
            </div>
            <div className="flex items-center">
              <FiWind />
              <p className="ml-2 mr-4">{chart.air}</p>
            </div>
            <div className="flex items-center">
              <AiOutlineFire />
              <p className="ml-2 mr-4">{chart.fire}</p>
            </div>
          </div>
          <div>
            {planets.map((planet) => {
              return (
                <div
                  className="flex items-center"
                  key={`planet-${planet.name}`}
                >
                  <p>
                    {planet.name}: {planet.zodiac_degrees.toFixed(2)}{" "}
                    {planet.zodiac_name}{" "}
                  </p>
                </div>
              );
            })}
          </div>
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
