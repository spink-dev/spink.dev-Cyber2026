import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_SECRET_KEY } from 'astro:env/server';
import { PUBLIC_SUPABASE_URL } from 'astro:env/client';
import type { Database } from './database.types';

/**
 * Service-role client. Bypasses row level security.
 * Server only. Never import this from a component or anything that could ship to the browser.
 * Use for: scheduled jobs, admin endpoints, webhooks, seeding.
 */
export function createSupabaseAdminClient(): SupabaseClient<Database> | null {
    if (!PUBLIC_SUPABASE_URL || !SUPABASE_SECRET_KEY) return null;
    return createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}
