// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Public site URL. Vercel exposes VERCEL_PROJECT_PRODUCTION_URL on every build;
 * SITE_URL wins when set explicitly (custom domain), localhost is the dev fallback.
 */
const siteUrl = process.env.SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:4321');

// https://astro.build/config
export default defineConfig({
    site: siteUrl,

    /**
     * 'server': every page is rendered per request (auth, DB reads, forms work everywhere).
     *           Opt a page out with `export const prerender = true` to make it static.
     * 'static': every page is built once. Opt a page in with `export const prerender = false`.
     * For a content-only site (portfolio, docs) switch this to 'static'.
     */
    output: 'server',
    adapter: vercel(),

    integrations: [sitemap()],

    vite: {
        plugins: [tailwindcss()],
    },

    /**
     * Typed environment variables. Import them from 'astro:env/client' or 'astro:env/server'.
     * Variables with access: 'secret' are validated at runtime, never bundled.
     * https://docs.astro.build/en/guides/environment-variables/#type-safe-environment-variables
     */
    env: {
        schema: {
            ENVIRONMENT: envField.enum({
                context: 'server',
                access: 'public',
                values: ['dev', 'test', 'prod'],
                default: 'dev',
            }),

            // Supabase (see .env.example). Optional so the template builds before a project exists.
            PUBLIC_SUPABASE_URL: envField.string({ context: 'client', access: 'public', optional: true }),
            PUBLIC_SUPABASE_PUBLISHABLE_KEY: envField.string({
                context: 'client',
                access: 'public',
                optional: true,
            }),
            // Server-only. Bypasses row level security: use it only in trusted server code.
            SUPABASE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
        },
    },

    // Astro emits a Content-Security-Policy with hashes for its own scripts and styles.
    // Enable once the site is stable and you have checked third-party scripts:
    // security: { csp: true },
});
