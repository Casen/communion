import { Link } from "@remix-run/react";
import React from "react";
import { useChart, useUser } from "~/utils";

export default function Index() {
  const user = useUser();
  const chart = useChart();

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
