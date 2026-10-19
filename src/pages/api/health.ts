import type { APIRoute } from 'astro';
import { ENVIRONMENT } from 'astro:env/server';

/**
 * GET /api/health
 * Used by the e2e smoke test and by uptime checks. Reports whether Supabase is configured
 * and reachable without exposing any secrets.
 */
export const GET: APIRoute = async ({ locals }) => {
    let database: 'unconfigured' | 'ok' | 'error' = 'unconfigured';

    if (locals.supabase) {
        // A cheap authenticated round-trip to the Auth service. Works with an empty schema.
        const { error } = await locals.supabase.auth.getSession();
        database = error ? 'error' : 'ok';
    }

    return Response.json({ status: 'ok', environment: ENVIRONMENT, database, timestamp: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
};
