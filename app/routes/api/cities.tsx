import { json, type LoaderFunction } from '@remix-run/node';
import { placesAuto } from '~/services/google';


export const loader: LoaderFunction = async (req) => {
  const url = new URL(req.request.url);
  return json(
    await placesAuto(url.searchParams.get("q"))
  );
}