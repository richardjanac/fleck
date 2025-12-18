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

  const embedUrl =
    process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL ??
    "https://calendar.google.com";

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
    } catch (err) {
      console.error(err);
      setError("Nepodarilo sa odoslať formulár.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 md:flex-row md:items-stretch">
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
            className="flex min-h-[720px] flex-1 flex-col space-y-4 rounded-xl bg-white p-4 shadow-sm md:min-h-[820px]"
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
                <input
                  type="time"
                  required
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startTime: e.target.value }))
                  }
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium">
                  Koniec
                </label>
                <input
                  type="time"
                  required
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  value={form.endTime}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endTime: e.target.value }))
                  }
                />
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
          </form>
        </section>

        <section className="flex w-full md:w-3/5">
          <div className="w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <iframe
              src={embedUrl}
              className="h-[720px] w-full border-0 md:h-[820px]"
              loading="lazy"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

