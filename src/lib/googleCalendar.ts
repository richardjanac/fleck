import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

function getJwtClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error("Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY env vars");
  }

  // Vercel ukladá multiline private key s \\n – treba ich nahradiť reálnymi novými riadkami
  const key = privateKey.replace(/\\n/g, "\n");

  return new google.auth.JWT({
    email: clientEmail,
    key,
    scopes: SCOPES,
  });
}

type CreateEventParams = {
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  timeZone?: string;
};

type CreateEventOptions = {
  room?: "call" | "meeting";
};

export async function createCalendarEvent(
  params: CreateEventParams,
  options: CreateEventOptions = {},
) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    throw new Error("Missing GOOGLE_CALENDAR_ID env var");
  }

  const auth = getJwtClient();
  const calendar = google.calendar({ version: "v3", auth });
  const timeZone = params.timeZone ?? process.env.CALENDAR_TIMEZONE ?? "Europe/Bratislava";

  // Farby podľa miestnosti (podľa Google Calendar colorId dokumentácie)
  // 11 – Tomato (červená), 5 – Banana (žltá)
  // Poznámka: Google Calendar embed iframe môže ignorovať farby eventov
  // - to je známe obmedzenie Google Calendar embed API
  const colorId =
    options.room === "call" ? "11" : options.room === "meeting" ? "5" : undefined;

  await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: params.summary,
      description: params.description,
      ...(colorId && { colorId }),
      start: {
        dateTime: params.start.toISOString(),
        timeZone,
      },
      end: {
        dateTime: params.end.toISOString(),
        timeZone,
      },
    },
  });
}


