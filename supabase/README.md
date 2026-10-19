# Supabase

Local stack (Postgres 17, Auth, Storage, Studio) runs in Docker via the Supabase CLI, which is installed as a dev dependency.

| Task                                 | Command                                   |
| ------------------------------------ | ----------------------------------------- |
| Start local stack                    | `npm run db:start` (prints URL + keys)    |
| Stop                                 | `npm run db:stop`                         |
| New migration file                   | `npm run db:migration -- create_profiles` |
| Generate migration from Studio edits | `npm run db:diff -- create_profiles`      |
| Apply migrations + seed from scratch | `npm run db:reset`                        |
| Regenerate TypeScript types          | `npm run db:types`                        |
| Link a cloud project                 | `npm run db:link -- --project-ref <ref>`  |
| Push migrations to the cloud project | `npm run db:push`                         |

Studio: http://127.0.0.1:54323 while the stack runs.

Rules

- Every schema change is a file in `migrations/`. Never edit the cloud schema by hand.
- Enable row level security on every table and write policies in the same migration.
- Regenerate `src/lib/supabase/database.types.ts` after every migration and commit it.
- `seed.sql` is for local data only. Production data comes from the app.
