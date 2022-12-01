import { useFetcher } from "@remix-run/react";
import { useMemo, useEffect } from "react";
import debounce from 'lodash.debounce'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import combostyles from "@reach/combobox/styles.css";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: combostyles,
    },
  ];
}

export default function Index() {
  const cities = useFetcher()
  console.log('got cities: ', cities)

  const search = (event: any) => {
    cities.submit(event.target.form)
  }

  const selectCity =(city: any) => {
    console.log(city)
  }

  const debouncedSearch = useMemo(
    () => debounce(search, 300)
  , []);

  // Stop the invocation of the debounced function
  // after unmounting
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    }
  });

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <cities.Form method="get" action="/api/cities" autoComplete="off" role="presentation">
      <Combobox aria-label="Cities">
        <div>
          <ComboboxInput
            name="q"
            onChange={debouncedSearch}
          />
          {cities.state === "submitting" ? (
            <p>loading..</p>
          ) : null}
        </div>

        {cities.data ? (
          <ComboboxPopover className="shadow-popup">
            {cities.data.error ? (
              <p>Failed to load cities :(</p>
            ) : cities.data.length ? (
              <ComboboxList>
                {cities.data.map((city: any) => (
                  <ComboboxOption
                    key={city.id}
                    value={`${city.name}, ${city.regionCode}, ${city.countryCode}`}
                    onClick={(event)=> selectCity(city)}
                  />
                ))}
              </ComboboxList>
            ) : (
              <span>No results found</span>
            )}
          </ComboboxPopover>
        ) : null}
      </Combobox>
    </cities.Form>
     
    </div>
  );
}
