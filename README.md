# Astro project template

Astro 7 · Tailwind CSS v4 · Supabase (Postgres, Auth, Storage) · Vercel · TypeScript strict · ESLint · Prettier · Vitest · Playwright · GitHub Actions.

Everything here is plumbing. Components, pages and design are yours to write; the template guarantees that typecheck, lint, tests, build and deploy work from the first commit.

## Start a new project

1. On GitHub: **Use this template** (mark this repo as a template under Settings > General), or clone and re-init:
    ```sh
    git clone <this-repo> my-project && cd my-project
    rm -rf .git && git init
    ```
2. Rename: `name` in `package.json`, `project_id` in `supabase/config.toml`, title in `src/pages/index.astro`.
3. Install and run:
    ```sh
    npm ci
    cp .env.example .env
    npm run dev          # http://localhost:4321
    ```
4. Sanity check before the first commit: `npm run verify`.

## Scripts

| Script             | What it does                                                                          |
| ------------------ | ------------------------------------------------------------------------------------- |
| `npm run dev`      | Dev server (Astro 7 keeps it running in the background; `npx astro dev stop` to stop) |
| `npm run build`    | Production build for Vercel (`.vercel/output`)                                        |
| `npm run check`    | `astro check`: TypeScript across `.astro` and `.ts`                                   |
| `npm run lint`     | ESLint (TypeScript + Astro + a11y rules)                                              |
| `npm run format`   | Prettier (Astro + Tailwind class sorting)                                             |
| `npm run test`     | Vitest unit tests (`tests/unit`, `src/**/*.test.ts`)                                  |
| `npm run test:e2e` | Playwright smoke tests against the dev server                                         |
| `npm run verify`   | format:check + lint + check + test + build. Same as CI.                               |
| `npm run db:*`     | Supabase local stack and migrations, see `supabase/README.md`                         |

## Layout

```
src/
  components/      ui/ layout/ islands/   (see src/components/README.md for conventions)
  layouts/         Layout.astro: <head>, canonical, sitemap link, global CSS
  lib/supabase/    server.ts (per-request, cookie-backed), browser.ts, admin.ts, env.ts, database.types.ts
  middleware.ts    puts `supabase` and `user` on Astro.locals for every request
  pages/
    index.astro
    api/health.ts        GET, used by uptime checks and the e2e test
    auth/callback.ts     GET, exchanges the Supabase auth code for a session cookie
    auth/signout.ts      POST, clears the session
  styles/global.css      Tailwind import + @theme tokens + reduced-motion rule
  env.d.ts               App.Locals types
supabase/          config.toml, migrations/, seed.sql
tests/             unit/ e2e/
.github/           CI workflow, dependabot, PR template
```

Path aliases: `@/`, `@components/`, `@layouts/`, `@lib/`, `@styles/`, `@assets/` (tsconfig.json).

## Rendering mode

`astro.config.mjs` sets `output: 'server'`: every page renders per request, so `Astro.locals.user` and database reads work everywhere. Make a page static with `export const prerender = true` in its frontmatter. For a content-only site flip the setting to `'static'` and opt individual pages into SSR with `export const prerender = false`.

## Environment variables

Declared with a schema in `astro.config.mjs` and imported from `astro:env/client` or `astro:env/server`, so a typo fails at build time instead of at 3 am.

| Name                              | Scope  | Purpose                                                  |
| --------------------------------- | ------ | -------------------------------------------------------- |
| `ENVIRONMENT`                     | server | `dev` / `test` / `prod`, surfaced by `/api/health`       |
| `SITE_URL`                        | build  | Canonical origin. Derived from Vercel when unset         |
| `PUBLIC_SUPABASE_URL`             | client | Supabase project URL                                     |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | client | Publishable key (safe in the browser, RLS protects data) |
| `SUPABASE_SECRET_KEY`             | server | Service role. Only `lib/supabase/admin.ts` reads it      |

Local: `.env` (gitignored). Vercel: Project > Settings > Environment Variables, per scope (Production / Preview / Development). The Supabase vars are optional so the template builds before a project exists; `/api/health` reports `database: "unconfigured"` until they are set.

## Supabase

Local stack in Docker through the CLI (installed as a dev dependency):

```sh
npm run db:start                              # prints API URL, Studio URL and keys
# paste PUBLIC_SUPABASE_URL and the publishable key into .env
npm run db:migration -- create_profiles       # new empty migration in supabase/migrations
npm run db:reset                              # apply all migrations + seed.sql
npm run db:types                              # regenerate src/lib/supabase/database.types.ts
```

Cloud project: create it in the Supabase dashboard, then `npm run db:link -- --project-ref <ref>` and `npm run db:push`. Add the callback URL (`https://<domain>/auth/callback`) under Authentication > URL Configuration.

In server code use the per-request client:

```astro
---
const { supabase, user } = Astro.locals;
const { data } = await supabase!.from('profiles').select('*').limit(10);
---
```

In the browser (`<script>` or an island) use `getSupabaseBrowserClient()` from `@lib/supabase/browser`. Both share the same auth cookie.

## Vercel

1. Push the repo to GitHub, import it at vercel.com/new. The `@astrojs/vercel` adapter and `vercel.json` are detected automatically.
2. Set the environment variables above for Production and Preview.
3. Every pull request gets a preview URL; `main` deploys to production. CI must be green first: enable "Require status checks" on `main` in GitHub branch protection.
4. Optional: point `PLAYWRIGHT_BASE_URL` at a preview URL to run the e2e suite against a real deployment.

Custom domain: add it in Vercel, set `SITE_URL=https://your-domain` so canonical URLs and the sitemap use it.

## Testing

- Unit: Vitest with `getViteConfig` from Astro, so aliases and `astro:env` resolve. Put pure logic in `src/lib` and test it there.
- E2E: Playwright, `tests/e2e/smoke.spec.ts` covers home, `/api/health` and that sign-out rejects GET. Extend per project.
- CI runs both. The e2e job installs Chromium with `--with-deps`.

## Conventions

- Tokens go in `@theme` in `global.css`; there is no `tailwind.config`.
- Schema changes are migrations. Regenerate types and commit them.
- Secrets never enter client code: `SUPABASE_SECRET_KEY` is `access: 'secret'`, Astro refuses to bundle it.
- Enable `security: { csp: true }` in `astro.config.mjs` once third-party scripts are known.

## Removing pieces

No Supabase: delete `src/lib/supabase`, `src/middleware.ts`, `src/pages/auth`, the Supabase entries in `astro.config.mjs` env schema, `supabase/`, and the `db:*` scripts. Simplify `/api/health` and `env.d.ts`.

No Vercel: replace `adapter: vercel()` with `@astrojs/node` (self-hosted, `output: 'server'`) or remove the adapter for a fully static build served by any web server.
