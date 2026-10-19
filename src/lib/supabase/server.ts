import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';
import type { Database } from './database.types';
import { getSupabaseEnv } from './env';

type ServerContext = {
  request: Request;
  cookies: AstroCookies;
  response?: { headers: Headers };
};

/**
 * Cookie-backed Supabase client for server code: middleware, pages, API routes, actions.
 * Create one per request; never cache it in module scope (each request has its own cookies).
 *
 * Usage in a page or endpoint: prefer `Astro.locals.supabase` (set by the middleware).
 * Call this directly only where locals are not available.
 */
export function createSupabaseServerClient(ctx: ServerContext): SupabaseClient<Database> | null {
  const env = getSupabaseEnv();
  if (!env) return null;

  return createServerClient<Database>(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(ctx.request.headers.get('Cookie') ?? '').map(
          ({ name, value }) => ({ name, value: value ?? '' }),
        );
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value, options } of cookiesToSet) {
          ctx.cookies.set(name, value, { ...options, path: options.path ?? '/' });
        }
        if (ctx.response && headers) {
          for (const [key, value] of Object.entries(headers)) {
            ctx.response.headers.set(key, value);
          }
        }
      },
    },
  });
}
