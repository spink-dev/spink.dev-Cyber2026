import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from 'astro:env/client';

export type SupabaseEnv = { url: string; publishableKey: string };

/** Returns the public Supabase config, or null when the project is not configured yet. */
export function getSupabaseEnv(): SupabaseEnv | null {
  return resolveSupabaseEnv(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

/** Pure helper so it can be unit tested without astro:env. */
export function resolveSupabaseEnv(
  url: string | undefined,
  publishableKey: string | undefined,
): SupabaseEnv | null {
  if (!url || !publishableKey) return null;
  try {
    new URL(url);
  } catch {
    return null;
  }
  return { url, publishableKey };
}
