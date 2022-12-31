import { createClient } from "@supabase/supabase-js";
import { type Database } from "lib/database.types";
import invariant from "tiny-invariant";

export type User = { id: string; email: string };

// Abstract this away
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

invariant(
  supabaseUrl,
  "SUPABASE_URL must be set in your environment variables."
);
invariant(
  supabaseAnonKey,
  "SUPABASE_ANON_KEY must be set in your environment variables."
);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function createUser(email: string, password: string) {
  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log(error);

  // get the user profile after created
  const profile = await getProfileByEmail(user?.email);

  return profile;
}

export async function updateUser(
  userId: string,
  dto: Database["public"]["Tables"]["profiles"]["Update"]
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(dto)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getProfileById(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", id)
    .single();

  if (error) return null;
  if (data) return data;
}

export async function getProfileByEmail(email?: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("email", email)
    .single();

  if (error) return null;
  if (data) return data;
}

export async function verifyLogin(email: string, password: string) {
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return undefined;
  const profile = await getProfileByEmail(user?.email);

  return profile;
}
