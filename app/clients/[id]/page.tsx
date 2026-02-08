"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string;
    fetch(`http://localhost:8080/clients/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setClient(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] p-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-[var(--muted)]">Chargement...</p>
        </div>
      </main>
    );
  }

  if (error || !client) {
    return (
      <main className="min-h-screen bg-[var(--background)] p-8">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 text-red-500">
            Erreur: {error || "Client introuvable"}
          </p>
          <Link
            href="/clients"
            className="text-blue-500 hover:underline"
          >
            ← Retour à la liste
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] p-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/clients"
          className="mb-6 inline-block text-sm text-blue-500 hover:underline"
        >
          ← Retour à la liste
        </Link>

        <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm">
          <h1 className="mb-6 text-3xl font-bold text-[var(--foreground)]">
            {client.prenom} {client.nom}
          </h1>

          <div className="space-y-3">
            <div>
              <span className="text-sm font-semibold text-[var(--muted)]">
                ID:
              </span>
              <p className="text-[var(--foreground)]">{client.id}</p>
            </div>

            {client.email && (
              <div>
                <span className="text-sm font-semibold text-[var(--muted)]">
                  Email:
                </span>
                <p className="text-[var(--foreground)]">{client.email}</p>
              </div>
            )}

            {client.telephone && (
              <div>
                <span className="text-sm font-semibold text-[var(--muted)]">
                  Téléphone:
                </span>
                <p className="text-[var(--foreground)]">{client.telephone}</p>
              </div>
            )}

            <div>
              <span className="text-sm font-semibold text-[var(--muted)]">
                Créé le:
              </span>
              <p className="text-[var(--foreground)]">
                {new Date(client.createdAt).toLocaleString("fr-FR")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
