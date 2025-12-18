"use client";

import { useState } from "react";

type FormState = {
  name: string;
  room: "call" | "meeting";
  description: string;
  date: string;
  startTime: string;
  endTime: string;
};

const initialForm: FormState = {
  name: "",
  room: "call",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
};

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [calendarKey, setCalendarKey] = useState(0);

  const embedUrl =
    process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL ??
    "https://calendar.google.com";

  // Helper funkcie pre time picker
  function parseTime(time: string): { hours: number; minutes: number } {
    if (!time) return { hours: 0, minutes: 0 };
    const [hours, minutes] = time.split(":").map(Number);
    return { hours: hours || 0, minutes: minutes || 0 };
  }

  function formatTime(hours: number, minutes: number): string {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 10, 20, 30, 40, 50];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Niekde sa stala chyba.");
        return;
      }

      setMessage("Rezervácia bola vytvorená v Google kalendári.");
      setForm(initialForm);

      // Reload kalendára po 2 sekundách, aby používateľ videl nový event
      setTimeout(() => {
        setCalendarKey((prev) => prev + 1);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Nepodarilo sa odoslať formulár.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 md:flex-row md:items-start">
        <section className="flex w-full flex-col md:w-2/5">
          <h1 className="mb-4 text-2xl font-semibold tracking-tight">
            Rezervácie Fleck v parku
          </h1>
          <p className="mb-6 text-sm text-zinc-600">
            Vyplň formulár a vytvoríš udalosť priamo v zdieľanom Google Fleck
            kalendári.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex h-[720px] flex-col space-y-4 rounded-xl bg-white p-4 shadow-sm md:h-[820px]"
          >
            <div>
              <label className="mb-1 block text-sm font-medium">
                Meno (kto rezervuje)
              </label>
              <input
                type="text"
                required
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>

            <div>
              <span className="mb-1 block text-sm font-medium">
                Miestnosť
              </span>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="room"
                    value="call"
                    checked={form.room === "call"}
                    onChange={() =>
                      setForm((f) => ({ ...f, room: "call" }))
                    }
                  />
                  <span>📞 Call room</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="room"
                    value="meeting"
                    checked={form.room === "meeting"}
                    onChange={() =>
                      setForm((f) => ({ ...f, room: "meeting" }))
                    }
                  />
                  <span>👥 Meeting room</span>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Dátum
              </label>
              <input
                type="date"
                required
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium">
                  Začiatok
                </label>
                <div className="flex gap-2">
                  <select
                    required
                    className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    value={parseTime(form.startTime).hours}
                    onChange={(e) => {
                      const { minutes } = parseTime(form.startTime);
                      setForm((f) => ({
                        ...f,
                        startTime: formatTime(Number(e.target.value), minutes),
                      }));
                    }}
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {String(h).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span className="flex items-center text-sm text-zinc-500">:</span>
                  <select
                    required
                    className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    value={parseTime(form.startTime).minutes}
                    onChange={(e) => {
                      const { hours } = parseTime(form.startTime);
                      setForm((f) => ({
                        ...f,
                        startTime: formatTime(hours, Number(e.target.value)),
                      }));
                    }}
                  >
                    {minutes.map((m) => (
                      <option key={m} value={m}>
                        {String(m).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium">
                  Koniec
                </label>
                <div className="flex gap-2">
                  <select
                    required
                    className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    value={parseTime(form.endTime).hours}
                    onChange={(e) => {
                      const { minutes } = parseTime(form.endTime);
                      setForm((f) => ({
                        ...f,
                        endTime: formatTime(Number(e.target.value), minutes),
                      }));
                    }}
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {String(h).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span className="flex items-center text-sm text-zinc-500">:</span>
                  <select
                    required
                    className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    value={parseTime(form.endTime).minutes}
                    onChange={(e) => {
                      const { hours } = parseTime(form.endTime);
                      setForm((f) => ({
                        ...f,
                        endTime: formatTime(hours, Number(e.target.value)),
                      }));
                    }}
                  >
                    {minutes.map((m) => (
                      <option key={m} value={m}>
                        {String(m).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Popis (voliteľné)
              </label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            <div className="mt-auto space-y-2">
              {message && (
                <p className="text-sm text-emerald-600">{message}</p>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
              >
                {loading ? "Ukladám..." : "Vytvoriť rezerváciu"}
              </button>
            </div>
          </form>
        </section>

        <section className="flex w-full flex-col md:w-3/5">
          <div className="h-[720px] w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm md:h-[820px]">
            <iframe
              key={calendarKey}
              src={embedUrl}
              className="h-full w-full border-0"
              loading="lazy"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

