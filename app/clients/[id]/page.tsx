"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
};

type Client = {
  id: string;
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string | null;
  createdAt: string;
};

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const identity = useMemo(() => {
    if (!client) return { initials: "?", fullName: "" };
    const first = client.prenom?.trim().charAt(0) ?? "";
    const last = client.nom?.trim().charAt(0) ?? "";
    return {
      initials: `${first}${last}`.toUpperCase() || "?",
      fullName: `${client.prenom} ${client.nom}`.trim(),
    };
  }, [client]);

  useEffect(() => {
    const id = params.id as string;
    fetch(`/api/clients/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setClient(data);
        setFormState({
          nom: data.nom ?? "",
          prenom: data.prenom ?? "",
          email: data.email ?? "",
          telephone: data.telephone ?? "",
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
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
  
      setSaving(true);
      try {
        const response = await fetch(`/api/clients/${client?.id}`, {
          method: "PUT",
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
  
        const updated = await response.json();
        setClient(updated);
        setFormState({
          nom: updated.nom ?? "",
          prenom: updated.prenom ?? "",
          email: updated.email ?? "",
          telephone: updated.telephone ?? "",
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setFormError(message);
      } finally {
        setSaving(false);
      }
    };
  
    const handleDelete = async () => {
      if (!client) return;
      setDeleting(true);
      setFormError(null);
      try {
        const response = await fetch(`/api/clients/${client.id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        router.push("/clients");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setFormError(message);
        setDeleting(false);
      }
    };
  
    return (
      <main className="relative min-h-screen overflow-hidden bg-background px-6 pb-16 pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-15%] top-[-20%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,122,89,0.35),rgba(255,122,89,0))] blur-3xl" />
          <div className="absolute bottom-[-15%] right-[-10%] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(61,111,255,0.28),rgba(61,111,255,0))] blur-2xl float-slow" />
        </div>
  
        <div className="mx-auto flex max-w-4xl flex-col gap-8">
          <Link
            href="/clients"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
          >
            ← Retour a la liste
          </Link>
  
          {loading ? (
            <section className="rounded-3xl border border-card-border bg-card p-8 shadow-xl">
              <div className="h-6 w-32 rounded-full bg-card-border" />
              <div className="mt-6 h-10 w-64 rounded-full bg-card-border" />
              <div className="mt-8 h-24 w-full rounded-2xl bg-card-border" />
            </section>
          ) : error || !client ? (
            <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
              Erreur: {error || "Client introuvable"}
            </section>
          ) : (
            <section className="glass-panel rounded-3xl p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-xl font-semibold text-foreground">
                    {identity.initials}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">
                      Client
                    </p>
                    <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
                      {identity.fullName}
                    </h1>
                  </div>
                </div>
                <div className="rounded-full border border-card-border bg-surface-strong px-4 py-2 text-sm text-muted">
                  Cree le {new Date(client.createdAt).toLocaleString("fr-FR")}
                </div>
              </div>
  
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-card-border bg-surface-strong p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    Identifiant
                  </p>
                  <p className="mt-2 text-sm text-foreground">{client.id}</p>
                </div>
                <div className="rounded-2xl border border-card-border bg-surface-strong p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    Statut
                  </p>
                  <p className="mt-2 text-sm text-foreground">Actif</p>
                </div>
              </div>
  
              <form onSubmit={handleSave} className="mt-8 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm text-(--muted)">
                    Nom
                    <input
                      value={formState.nom}
                      onChange={(event) =>
                        setFormState((prev: FormState) => ({ ...prev, nom: event.target.value }))
                      }
                      className="rounded-xl border border-(--card-border) bg-white/80 px-4 py-2 text-sm text-foreground"
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-(--muted)">
                    Prenom
                    <input
                      value={formState.prenom}
                      onChange={(event) =>
                        setFormState((prev: FormState) => ({ ...prev, prenom: event.target.value }))
                      }
                      className="rounded-xl border border-(--card-border) bg-white/80 px-4 py-2 text-sm text-foreground"
                      required
                    />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm text-(--muted)">
                    Email
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(event) =>
                        setFormState((prev: FormState) => ({ ...prev, email: event.target.value }))
                      }
                      className="rounded-xl border border-(--card-border) bg-white/80 px-4 py-2 text-sm text-foreground"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-(--muted)">
                    Telephone
                    <input
                      value={formState.telephone}
                      onChange={(event) =>
                        setFormState((prev: FormState) => ({ ...prev, telephone: event.target.value }))
                      }
                      className="rounded-xl border border-(--card-border) bg-white/80 px-4 py-2 text-sm text-foreground"
                    />
                  </label>
                </div>
                {formError && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {formError}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Mise a jour..." : "Enregistrer"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormState({
                        nom: client.nom ?? "",
                        prenom: client.prenom ?? "",
                        email: client.email ?? "",
                        telephone: client.telephone ?? "",
                      })
                    }
                    className="rounded-full border border-card-border bg-white/70 px-4 py-2 text-sm text-muted"
                  >
                    Reinitialiser
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleting ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </main>
    );
  }