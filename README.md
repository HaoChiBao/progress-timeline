# ProgressGoat

Project intelligence dashboard — timelines, living docs, decision logs, and project memory.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth, Postgres, Realtime)
- Liveblocks + Yjs (collaboration — scaffolded)
- Vercel deployment

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Foundation tickets

This scaffold covers:

- **YAN-73** — Next.js + TypeScript + Tailwind + shadcn/ui
- **YAN-84** — ProgressGoat design tokens and theme
- **YAN-76** — App shell with sidebar, project switcher, dashboard layout
- **YAN-85** — TicketCard, PriorityPill, SourceBadge components
- **YAN-75** — Initial database schema (`db/schema.sql`)

## Design

See [DESIGN.md](./DESIGN.md) for the ProgressGoat design system — warm cream canvas, moss green accents, editorial serif headings.

## Environment

Copy `.env.example` to `.env.local` and fill in Supabase credentials when ready. Integrations and AI keys are placeholders for future tickets.
