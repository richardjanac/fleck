import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    env: {
      hasCalendarId: !!process.env.GOOGLE_CALENDAR_ID,
      hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasEmbedUrl: !!process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL,
    },
  });
}

