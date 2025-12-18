Jednoduchý rezervačný kalendár pre Fleck coworking (Call room, Meeting room).

## Lokálny štart

### Požiadavky

- Node.js 22+

### Setup

1. Vytvor `.env.local` súbor v koreňovom priečinku:

```env
GOOGLE_CALENDAR_ID="tvoj_kalendar_id@group.calendar.google.com"
GOOGLE_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
CALENDAR_TIMEZONE="Europe/Bratislava"
NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL="https://calendar.google.com/calendar/embed?src=..."
```

2. Dev server:

```bash
npm run dev
```

Otvor `http://localhost:3000`.

## Deploy na Vercel

### Env premenné na Verceli

V **Settings → Environment Variables** nastav tieto premenné:

- `GOOGLE_CALENDAR_ID` - ID tvojho Google kalendára
- `GOOGLE_CLIENT_EMAIL` - email service accountu
- `GOOGLE_PRIVATE_KEY` - private key zo service account JSON (s `\n` namiesto nových riadkov)
- `CALENDAR_TIMEZONE` - napr. `Europe/Bratislava`
- `NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL` - embed URL z Google Calendar nastavení

**Dôležité:** Po pridaní env premenných urob **Redeploy** projektu.

### Poznámky

- Kalendár musí byť zdieľaný so service accountom s právom "Make changes to events"
- Embed URL musí byť z verejného kalendára (alebo aspoň "available to public")
