import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeBelec CRM",
  description: "Interface client moderne connectee a l'API Spring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${fraunces.variable} antialiased`}
      >
        <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-sm font-semibold tracking-wide text-[var(--foreground)]">
                WeBelec
              </span>
            </Link>
            <div className="hidden items-center gap-3 text-sm text-[var(--muted)] md:flex">
              <Link href="/clients" className="hover:text-[var(--foreground)]">
                Clients
              </Link>
              <span className="h-4 w-px bg-[var(--card-border)]" />
              <Link href="/" className="hover:text-[var(--foreground)]">
                Accueil
              </Link>
            </div>
          </div>
          <ThemeToggle />
        </nav>
        {children}
      </body>
    </html>
  );
}
