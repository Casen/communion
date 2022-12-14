import { useMatches } from "@remix-run/react";
import { calculateAstro } from "lib/astro";
import { type Database } from "lib/database.types";
import { useMemo } from "react";
import type { User } from "./models/user.server";

export function useMatchesData(id: string) {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );

  return route?.data;
}

export function isUser(user: User) {
  return user && typeof user === "object";
}

export function useOptionalUser() {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user as Database["public"]["Tables"]["profiles"]["Row"];
}

export function useUser() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function useChart() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }

  if (!maybeUser.birth_time || !maybeUser.birth_lat || !maybeUser.birth_lng)
    return null;

  const astro = calculateAstro({
    timestamp: maybeUser.birth_time,
    lat: maybeUser.birth_lat,
    lng: maybeUser.birth_lng,
  });
  return astro;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}
