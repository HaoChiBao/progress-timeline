# ProgressGoat

Minimal ASCII project timeline — one tick per event, warm monospace dashboard.

**Goated Documentation** · [Linear board](https://linear.app/yangspace/project/goated-documentation-4359246c-f5f6-444b-8d2c-e70b97e524c7) · [Notion wiki](https://app.notion.com/p/38b850bd5b0881459b29d27c71eaa23c)

## What it is

ProgressGoat is a **dashboard-only** timeline for project activity:

- **Built-in sources:** GitHub, Linear, Notion, Figma, general (`G/L/N/F/·`)
- **Custom sources:** add your own tile character + colour via `[+]` on the sources strip
- **Capture:** quick add, backdate, undo, tags, link paste, draft
- **View:** hover / bars / letters / list modes, filters, week export
- **Detail:** click a tick → ASCII panel on the left; tile stays expanded until dismissed
- **Linear webhook:** dev file store for automatic Linear issue ticks

## Stack

- Next.js 15 App Router + TypeScript + Tailwind
- localStorage (ticks, projects, custom sources)
- Linear webhook (`POST /api/webhooks/linear`)

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: LINEAR_WEBHOOK_SECRET
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

## Layout

| Zone | Component |
|------|-----------|
| Left | Project switcher + view/create panels |
| Center | Centered ASCII timeline |
| Bottom-left | Sources strip (+ custom sources) |
| Bottom | Floating dock (view modes + filters) |

## Key tickets (Done)

| Ticket | Summary |
|--------|---------|
| [YAN-76](https://linear.app/yangspace/issue/YAN-76) | Dashboard shell — left-panel layout |
| [YAN-82](https://linear.app/yangspace/issue/YAN-82) | Manual capture + filters + export |
| [YAN-86](https://linear.app/yangspace/issue/YAN-86) | ASCII tick detail + pinned selection |
| [YAN-87](https://linear.app/yangspace/issue/YAN-87) | Floating dock + visual modes |
| [YAN-88](https://linear.app/yangspace/issue/YAN-88) | Split rail + progressive add button |
| [YAN-91](https://linear.app/yangspace/issue/YAN-91) | Custom sources (character + colour) |

## Backlog

- [YAN-89](https://linear.app/yangspace/issue/YAN-89) — Supabase persistence (Urgent)
- [YAN-92](https://linear.app/yangspace/issue/YAN-92) — Manage custom sources
- [YAN-90](https://linear.app/yangspace/issue/YAN-90) — Related ticks in detail panel

## Design

See [DESIGN.md](./DESIGN.md) for the Goated design system — warm cream canvas, moss green `#6F7C5D`, monospace timeline spec.

## Environment

```bash
LINEAR_WEBHOOK_SECRET=          # optional, for /api/webhooks/linear
LINEAR_DEFAULT_PROJECT_ID=proj_progress_goat
```

Custom sources persist in `localStorage` key `pg-custom-sources`.
