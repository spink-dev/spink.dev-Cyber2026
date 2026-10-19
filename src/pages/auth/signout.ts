import type { APIRoute } from 'astro';

/**
 * POST /auth/signout
 * Clears the session cookie. POST only, so a crawler or prefetch cannot log the user out.
 *
 *   <form method="post" action="/auth/signout"><button>Sign out</button></form>
 */
export const POST: APIRoute = async ({ locals, redirect }) => {
    if (locals.supabase) {
        await locals.supabase.auth.signOut();
    }
    return redirect('/', 303);
};
