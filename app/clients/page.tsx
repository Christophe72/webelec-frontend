"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Client = {
  id: string;
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string | null;
  createdAt: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/clients")
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] p-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-[var(--muted)]">Chargement...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[var(--background)] p-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-red-500">Erreur: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-[var(--foreground)]">
          Liste des clients
        </h1>

        {clients.length === 0 ? (
          <p className="text-[var(--muted)]">Aucun client trouvé.</p>
        ) : (
          <div className="space-y-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  {client.prenom} {client.nom}
                </h2>
                <div className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {client.email && <p>Email: {client.email}</p>}
                  {client.telephone && <p>Téléphone: {client.telephone}</p>}
                  <p>
                    Créé le:{" "}
                    {new Date(client.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <Link
                  href={`/clients/${client.id}`}
                  className="mt-3 inline-block text-sm text-blue-500 hover:underline"
                >
                  Voir détails →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
