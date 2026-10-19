import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { getSupabaseEnv } from './env';

let client: SupabaseClient<Database> | null | undefined;

/**
 * Browser-side Supabase client for <script> tags and islands.
 * Shares the auth cookie with the server client, so a login in the browser
 * is visible to server-rendered pages on the next request.
 *
 *   import { getSupabaseBrowserClient } from '@lib/supabase/browser';
 *   const supabase = getSupabaseBrowserClient();
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
    if (client !== undefined) return client;
    const env = getSupabaseEnv();
    client = env ? createBrowserClient<Database>(env.url, env.publishableKey) : null;
    return client;
}
