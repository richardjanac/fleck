import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCalendarEvent } from "@/lib/googleCalendar";

const BodySchema = z.object({
  name: z.string().min(1),
  room: z.enum(["call", "meeting"]),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  startTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM
  endTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Neplatné dáta", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { name, room, description, date, startTime, endTime } = parsed.data;

    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);

    if (end <= start) {
      return NextResponse.json(
        { error: "Koniec musí byť po začiatku." },
        { status: 400 },
      );
    }

    const summaryPrefix = room === "call" ? "📞 Call room" : "👥 Meeting room";

    await createCalendarEvent(
      {
        summary: `${summaryPrefix} – ${name}`,
        description,
        start,
        end,
      },
      { room },
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error creating calendar event", err);
    return NextResponse.json(
      { error: "Nepodarilo sa vytvoriť event v kalendári." },
      { status: 500 },
    );
  }
}


