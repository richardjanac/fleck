Jednoduchý rezervačný kalendár pre Fleck coworking (Call room, Meeting room).

## Lokálny štart

### Požiadavky

- Node.js 22+

### Setup

1. Nastav si env:

```bash
export DATABASE_URL="file:./dev.db"
export ADMIN_TOKEN="change-me"
```

2. Migrácie + seed:

```bash
npm run db:migrate
npm run db:seed
```

3. Dev server:

```bash
npm run dev
```

Otvor `http://localhost:3000`.

## Deploy na Vercel

Áno, funguje to veľmi dobre, len **neodporúčam SQLite na produkcii** (filesystem v serverless nie je perzistentný).

### Odporúčanie pre produkciu

- **Postgres** (Vercel Postgres / Neon / Supabase) a `DATABASE_URL` nastavíš na Postgres connection string.

### Env premenné na Verceli

- `DATABASE_URL`
- `ADMIN_TOKEN`

Pozn.: v ďalšom kroku doplníme API + ICS feed, aby sa kalendár dal pridať do Google Calendar a Home Assistanta.
