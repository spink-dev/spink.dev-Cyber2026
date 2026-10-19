import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from '@lib/supabase/server';

/**
 * Runs on every server-rendered request (and once at build time for prerendered pages).
 * Attaches a per-request Supabase client and the verified user to Astro.locals.
 *
 * Route protection example (in a page or a dedicated middleware):
 *   if (Astro.url.pathname.startsWith('/app') && !Astro.locals.user) return Astro.redirect('/login');
 */
export const onRequest = defineMiddleware(async (context, next) => {
    const supabase = createSupabaseServerClient(context);
    context.locals.supabase = supabase;
    context.locals.user = null;

    if (supabase && !context.isPrerendered) {
        // getUser() validates the JWT against Supabase Auth. Do not trust getSession() on the server.
        const {
            data: { user },
        } = await supabase.auth.getUser();
        context.locals.user = user;
    }

    return next();
});
