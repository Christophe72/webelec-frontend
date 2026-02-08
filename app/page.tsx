import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-6 pb-16 pt-24 text-foreground transition-colors duration-300">
      <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,122,89,0.35),rgba(255,122,89,0))] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10%] left-[-15%] h-112 w-md rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(61,111,255,0.3),rgba(61,111,255,0))] blur-3xl" />

      <section className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="glass-panel rounded-3xl p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.4em] text-(--muted)">
                WeBelec CRM
              </p>
              <h1 className="mt-4 text-balance font-display text-4xl font-semibold text-foreground sm:text-5xl">
                Un cockpit lumineux pour piloter vos clients.
              </h1>
              <p className="mt-4 text-lg text-(--muted)">
                Recherche intelligente, creation rapide, suivi des details, tout
                en un seul flux. La couche Spring fournit la verite, l&apos;UI
                l&apos;orchestre avec style.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/clients"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-colors duration-200 hover:bg-(--accent)"
                >
                  Ouvrir le carnet client
                </Link>
                <span className="rounded-full border border-(--card-border) bg-(--surface-strong) px-4 py-2 text-xs uppercase tracking-[0.3em] text-(--muted)">
                  API /api/clients
                </span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Recherche",
                  value: "Nom, prenom, email",
                  hint: "search",
                },
                {
                  label: "Pagination",
                  value: "Page et taille",
                  hint: "page / size",
                },
                {
                  label: "Creation",
                  value: "Formulaire valide",
                  hint: "POST",
                },
                {
                  label: "Mise a jour",
                  value: "Edition rapide",
                  hint: "PUT",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-(--card-border) bg-(--surface-strong) p-4"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-(--muted)">
                    {item.hint}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">
                    {item.label}
                  </h3>
                  <p className="mt-1 text-sm text-(--muted)">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Concu pour vos equipes, de l&apos;accueil a la fiche detaillee.",
            "Un frontend expressif qui s&apos;appuie sur les DTO du backend.",
            "Prise en main rapide, micro-interactions sobres, design chaleureux.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-(--card-border) bg-(--card) p-6"
            >
              <p className="text-sm text-(--muted)">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
