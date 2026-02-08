"use client";

import { useEffect, useState } from "react";

interface ApiResponse {
  message: string;
  status?: string;
}

export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      });
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] px-6 pt-24 pb-16 text-[var(--foreground)] transition-colors duration-300">
      {/* Halos decoratifs */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffd9a6_0%,#ffd9a6_20%,rgba(255,217,166,0)_60%)] opacity-60 blur-2xl dark:opacity-20" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_70%_30%,#b7d7ff_0%,#b7d7ff_20%,rgba(183,215,255,0)_60%)] opacity-60 blur-2xl dark:opacity-20" />

      <section className="mx-auto max-w-3xl">
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--muted)] shadow-sm backdrop-blur">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          Liaison API Spring {" > "} Next.js
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Hello depuis votre backend.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
          Une petite page plus propre pour verifier que la connexion API
          fonctionne et afficher le message cote serveur.
        </p>

        <div className="mt-10 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-[var(--muted)]">
                Reponse de l&apos;API
              </p>
              <div className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                {!data && !error && "Chargement..."}
                {error && "Impossible de joindre l'API"}
                {data && data.message}
              </div>
            </div>
            <div className="rounded-full border border-[var(--card-border)] bg-slate-50 px-4 py-2 text-sm text-[var(--muted)] dark:bg-slate-800">
              {error ? "Statut: erreur" : data?.status ?? "Statut: ok"}
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-rose-600 dark:text-rose-400">
              Details: {error}. Verifiez que
              `http://localhost:8080/api/hello` repond bien.
            </p>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3 text-sm text-[var(--muted)]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
            API
          </span>
          <span>Temps reel, sans cache, pour un diagnostic rapide.</span>
        </div>
      </section>
    </main>
  );
}
