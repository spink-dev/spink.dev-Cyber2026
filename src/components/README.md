# Components

Reusable across projects. Keep each component self-contained: its own styles, no imports from `pages/`.

| Folder     | What goes here                                                                                  |
| ---------- | ----------------------------------------------------------------------------------------------- |
| `ui/`      | Primitives: Button, Input, Badge, Card. Props-driven, no data fetching.                         |
| `layout/`  | Structural pieces: Header, Footer, Nav, Container, Section, Grid.                               |
| `islands/` | Anything that needs client-side JS beyond a plain `<script>`. Name the file after what it does. |

Conventions

- One component per file, PascalCase file name, `interface Props` at the top of the frontmatter.
- Import with aliases: `@components/ui/Button.astro`, `@lib/supabase`, `@layouts/Layout.astro`.
- Data comes in through props. Fetch in pages (`Astro.locals.supabase`), render in components.
- Client scripts use `<script>` (bundled, runs once per navigation via `astro:page-load`) unless the component truly needs a framework.
