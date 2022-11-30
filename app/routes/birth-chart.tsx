import { useFetcher } from "@remix-run/react";


export default function BirthChart() {
  const astro = useFetcher()

  console.log(astro.data)

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Birth Chart Test</h1>
      <astro.Form method="get" action="/api/enneagram" autoComplete="off" role="presentation">
        {astro.data ? (
          <div>
            {astro.data.error ? (
              <p>Failed to load birth chart :(</p>
            ) : (
              <p>
                Enneagram: {astro.data.enneagram}
              </p>
            )}
          </div>
        ) : null}
        <button type='submit'>Get Chart</button>
      </astro.Form>
     
    </div>
  );
}
