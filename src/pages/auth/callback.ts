import type { APIRoute } from 'astro';

/**
 * GET /auth/callback?code=...&next=/app
 * Target for Supabase Auth redirects (magic links, OAuth, email confirmation).
 * Exchanges the one-time code for a session cookie, then redirects to `next`.
 * Register this URL in Supabase: Authentication > URL Configuration > Redirect URLs.
 */
export const GET: APIRoute = async ({ url, locals, redirect }) => {
  const code = url.searchParams.get('code');
  const next = safeNext(url.searchParams.get('next'));

  if (!code || !locals.supabase) {
    return redirect(`/?auth=error`, 303);
  }

  const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return redirect(`/?auth=error`, 303);
  }

  return redirect(next, 303);
};

/** Only allow same-origin relative paths to prevent open redirects. */
function safeNext(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/';
  return value;
}
