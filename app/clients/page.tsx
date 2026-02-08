"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Client = {
  id: string;
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string | null;
  createdAt: string;
};

type ClientPage = {
  items: Client[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
};

const SORT_OPTIONS = [
  { label: "Creation recente", value: "createdAt,desc" },
  { label: "Nom (A-Z)", value: "nom,asc" },
  { label: "Prenom (A-Z)", value: "prenom,asc" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [meta, setMeta] = useState<ClientPage>({
    items: [],
    totalElements: 0,
    totalPages: 1,
    page: 0,
    size: 8,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);

  const [formState, setFormState] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  });
  const [submitState, setSubmitState] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const clientCount = useMemo(() => meta.totalElements, [meta.totalElements]);

  const getInitials = (client: Client) => {
    const first = client.prenom?.trim().charAt(0) ?? "";
    const last = client.nom?.trim().charAt(0) ?? "";
    return `${first}${last}`.toUpperCase() || "?";
  };

  const fetchClients = async ({
    searchValue,
    page,
    size,
    sortValue,
  }: {
    searchValue: string;
    page: number;
    size: number;
    sortValue: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchValue.trim()) params.set("search", searchValue.trim());
      params.set("page", String(page));
      params.set("size", String(size));
      params.set("sort", sortValue);

      const response = await fetch(`/api/clients?${params.toString()}`);
      if (!response.ok) throw new Error(`Erreur ${response.status}`);
      const data = await response.json();

      const items = Array.isArray(data) ? data : (data.content ?? []);
      const totalElements = Array.isArray(data)
        ? data.length
        : data.totalElements ?? items.length;
      const totalPages = Array.isArray(data)
        ? 1
        : data.totalPages ?? 1;
      const pageNumber = Array.isArray(data) ? 0 : data.number ?? page;
      const pageSize = Array.isArray(data)
        ? items.length || size
        : data.size ?? size;

      setClients(items);
      setMeta({
        items,
        totalElements,
        totalPages: Math.max(totalPages, 1),
        page: pageNumber,
        size: pageSize,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients({
      searchValue: search,
      page: meta.page,
      size: meta.size,
      sortValue: sort,
    });
  }, [search, meta.page, meta.size, sort]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMeta((prev) => ({ ...prev, page: 0 }));
    setSearch(searchDraft);
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!formState.nom.trim() || !formState.prenom.trim()) {
      setFormError("Nom et prenom sont obligatoires.");
      return;
    }
    if (formState.email && !EMAIL_REGEX.test(formState.email)) {
      setFormError("Email invalide.");
      return;
    }
    if (formState.telephone.length > 30) {
      setFormError("Telephone trop long.");
      return;
    }

    setSubmitState("saving");
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nom: formState.nom.trim(),
          prenom: formState.prenom.trim(),
          email: formState.email.trim() || null,
          telephone: formState.telephone.trim() || null,
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `Erreur ${response.status}`);
      }

      setSubmitState("success");
      setFormState({ nom: "", prenom: "", email: "", telephone: "" });
      fetchClients({
        searchValue: search,
        page: 0,
        size: meta.size,
        sortValue: sort,
      });
      setMeta((prev) => ({ ...prev, page: 0 }));
    } catch (err) {
      setSubmitState("error");
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setFormError(message);
    } finally {
      setTimeout(() => setSubmitState("idle"), 1800);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-6 pb-16 pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,122,89,0.35),rgba(255,122,89,0))] blur-2xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(61,111,255,0.25),rgba(61,111,255,0))] blur-3xl float-slow" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="glass-panel rounded-3xl p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-muted">
            Carnet client
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-foreground md:text-5xl">
                Clients & relations
              </h1>
              <p className="mt-2 max-w-xl text-base text-muted">
                Pilotez les informations essentielles, ajoutez des fiches et
                gardez une vision claire de votre base.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-card-border bg-surface-strong px-5 py-3 text-sm text-foreground">
              <span className="text-xs uppercase tracking-[0.2em] text-muted">
                Total
              </span>
              <span className="text-2xl font-semibold text-foreground">
                {clientCount}
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="mt-6 flex flex-col gap-3 rounded-2xl border border-card-border bg-surface-strong p-4 md:flex-row md:items-center"
          >
            <input
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Rechercher par nom, prenom ou email..."
              className="flex-1 rounded-full border border-transparent bg-white/70 px-4 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent-2"
            />
            <div className="flex flex-wrap gap-2">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-full border border-card-border bg-white/70 px-3 py-2 text-sm text-foreground"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent"
              >
                Chercher
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchDraft("");
                  setSearch("");
                  setMeta((prev) => ({ ...prev, page: 0 }));
                }}
                className="rounded-full border border-card-border bg-white/70 px-4 py-2 text-sm text-muted"
              >
                Effacer
              </button>
            </div>
          </form>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col gap-5">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-40 rounded-2xl border border-card-border bg-card p-5 shadow-sm"
                  >
                    <div className="h-4 w-24 rounded-full bg-card-border" />
                    <div className="mt-6 h-6 w-40 rounded-full bg-card-border" />
                    <div className="mt-4 h-3 w-32 rounded-full bg-card-border" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Erreur: {error}
              </div>
            ) : clients.length === 0 ? (
              <div className="rounded-2xl border border-card-border bg-card p-8 text-center">
                <p className="text-lg text-muted">
                  Aucun client trouve pour le moment.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {clients.map((client) => (
                  <article
                    key={client.id}
                    className="group flex flex-col justify-between rounded-2xl border border-card-border bg-card p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-lg font-semibold text-foreground">
                          {getInitials(client)}
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">
                            {client.prenom} {client.nom}
                          </h2>
                          <p className="text-sm text-muted">
                            Client depuis {new Date(client.createdAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 text-sm text-muted">
                        <div className="flex items-center justify-between rounded-xl border border-card-border bg-white/50 px-3 py-2">
                          <span>Email</span>
                          <span className="text-foreground">
                            {client.email ?? "Non renseigne"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-card-border bg-white/50 px-3 py-2">
                          <span>Telephone</span>
                          <span className="text-foreground">
                            {client.telephone ?? "Non renseigne"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                        Fiche client
                      </span>
                      <Link
                        href={`/clients/${client.id}`}
                        className="inline-flex items-center gap-2 rounded-full border border-card-border bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors duration-200 hover:bg-accent"
                      >
                        Voir details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-card-border bg-card px-5 py-4">
              <div className="text-sm text-muted">
                Page {meta.page + 1} sur {meta.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setMeta((prev) => ({ ...prev, page: Math.max(prev.page - 1, 0) }))
                  }
                  disabled={meta.page <= 0}
                  className="rounded-full border border-card-border bg-white/70 px-4 py-2 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Precedent
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMeta((prev) => ({
                      ...prev,
                      page: Math.min(prev.page + 1, meta.totalPages - 1),
                    }))
                  }
                  disabled={meta.page >= meta.totalPages - 1}
                  className="rounded-full border border-card-border bg-white/70 px-4 py-2 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Suivant
                </button>
                <select
                  value={meta.size}
                  onChange={(event) =>
                    setMeta((prev) => ({
                      ...prev,
                      size: Number(event.target.value),
                      page: 0,
                    }))
                  }
                  className="rounded-full border border-card-border bg-white/70 px-3 py-2 text-sm text-foreground"
                >
                  {[6, 8, 12, 16].map((size) => (
                    <option key={size} value={size}>
                      {size} / page
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <div className="glass-panel rounded-3xl p-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Creer un client
              </h2>
              <p className="mt-2 text-sm text-muted">
                Nom et prenom obligatoires, email valide, telephone optionnel.
              </p>

              <form onSubmit={handleCreate} className="mt-6 grid gap-4">
                <label className="grid gap-2 text-sm text-muted">
                  Nom
                  <input
                    value={formState.nom}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, nom: event.target.value }))
                    }
                    className="rounded-xl border border-card-border bg-white/80 px-4 py-2 text-sm text-foreground"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm text-muted">
                  Prenom
                  <input
                    value={formState.prenom}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, prenom: event.target.value }))
                    }
                    className="rounded-xl border border-card-border bg-white/80 px-4 py-2 text-sm text-foreground"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm text-muted">
                  Email
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, email: event.target.value }))
                    }
                    className="rounded-xl border border-card-border bg-white/80 px-4 py-2 text-sm text-foreground"
                  />
                </label>
                <label className="grid gap-2 text-sm text-muted">
                  Telephone
                  <input
                    value={formState.telephone}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, telephone: event.target.value }))
                    }
                    className="rounded-xl border border-[var(--card-border)] bg-white/80 px-4 py-2 text-sm text-[var(--foreground)]"
                  />
                </label>
                {formError && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {formError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitState === "saving"}
                  className="rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitState === "saving"
                    ? "Creation en cours..."
                    : submitState === "success"
                    ? "Client ajoute"
                    : submitState === "error"
                    ? "Reessayer"
                    : "Ajouter le client"}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-card-border bg-card p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                API
              </p>
              <p className="mt-3 text-sm text-muted">
                GET /api/clients pour lister et filtrer, POST pour creer, PUT
                et DELETE depuis chaque fiche.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
