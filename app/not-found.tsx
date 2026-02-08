import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] px-6 pt-24 pb-16 text-[var(--foreground)] transition-colors duration-300">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffd9a6_0%,#ffd9a6_20%,rgba(255,217,166,0)_60%)] opacity-60 blur-2xl dark:opacity-20" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_70%_30%,#b7d7ff_0%,#b7d7ff_20%,rgba(183,215,255,0)_60%)] opacity-60 blur-2xl dark:opacity-20" />

      <section className="mx-auto flex max-w-2xl flex-col items-start">
        <div className="mb-8 rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <Image
            src="/logo.png"
            alt="Logo"
            width={96}
            height={96}
            className="rounded-2xl"
            priority
          />
        </div>

        <p className="text-sm uppercase tracking-widest text-[var(--muted)]">
          Erreur 404
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Page introuvable.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-[var(--muted)]">
          L&apos;adresse demandee n&apos;existe pas. Vous pouvez revenir a
          l&apos;accueil ou verifier l&apos;URL.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--card)] px-5 py-2 text-sm text-[var(--foreground)] shadow-sm backdrop-blur transition hover:translate-y-[-1px]"
          >
            Retour a l&apos;accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
