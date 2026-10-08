import { Link, createFileRoute } from '@tanstack/react-router'
import {
  CreditCard,
  LayoutDashboard,
  List,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'

export const Route = createFileRoute('/_public/')({
  component: LandingPage,
  head: () => ({
    meta: [
      {
        title: 'MyFinance',
      },
      {
        name: 'description',
        content:
          'MyFinance — web aplikacija za upravljanje osobnim financijama. Pratite transakcije, kategorije i budžete uz jasan uvid u svoj novac.',
      },
    ],
  }),
})

const features: ReadonlyArray<{
  title: string
  description: string
  icon: LucideIcon
}> = [
  {
    title: 'Nadzorna ploča',
    description:
      'Pregledajte ključne financijske pokazatelje — ukupne prihode, rashode, saldo i bilans tekućeg mjeseca — uz grafikon mjesečnog trenda.',
    icon: LayoutDashboard,
  },
  {
    title: 'Transakcije',
    description:
      'Unosite prihode i rashode, zatim ih pretražujte, filtrirajte, sortirajte i pregledavajte po stranicama.',
    icon: CreditCard,
  },
  {
    title: 'Kategorije',
    description:
      'Organizirajte transakcije u vlastite kategorije prihoda i rashoda kako biste lakše pratili na što odlazi novac.',
    icon: List,
  },
  {
    title: 'Budžeti',
    description:
      'Postavite mjesečne limite po kategoriji i pratite iskorištenost kako biste ostali unutar plana.',
    icon: Wallet,
  },
  {
    title: 'Sigurni podaci',
    description:
      'Svaki korisnik vidi samo svoje zapise. Pristup je zaštićen prijavom, a podaci su izolirani putem Supabase Row Level Security (RLS).',
    icon: ShieldCheck,
  },
]

function AuthButtons({ size = 'default' }: { size?: 'default' | 'sm' }) {
  return (
    <>
      <Button nativeButton={false} size={size} render={<Link to="/register" />}>
        Registrirajte se
      </Button>
      <Button
        nativeButton={false}
        size={size}
        variant="outline"
        render={<Link to="/login" search={{ redirect: '/dashboard' }} />}
      >
        Prijavite se
      </Button>
    </>
  )
}

function BrandMark() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-foreground no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
    >
      <span className="flex size-8 items-center justify-center bg-primary text-xs font-semibold text-primary-foreground">
        MF
      </span>
      <span className="font-bold">MyFinance</span>
    </Link>
  )
}

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <BrandMark />
          <nav
            aria-label="Prijava i registracija"
            className="flex flex-wrap items-center gap-2"
          >
            <AuthButtons size="sm" />
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
        <section className="px-4 py-16 sm:py-20">
          <p className="text-sm font-medium text-muted-foreground">MyFinance</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Pregledajte osobne financije na jednom mjestu
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Pratite transakcije, kategorije i budžete uz jasan uvid u svoj
            novac.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <AuthButtons />
          </div>
        </section>

        <section
          aria-labelledby="mogucnosti-naslov"
          className="border-t border-border px-4 py-16"
        >
          <h2
            id="mogucnosti-naslov"
            className="text-2xl font-semibold tracking-tight"
          >
            Mogućnosti
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Osnovni alati za svakodnevno upravljanje osobnim financijama, bez
            suvišnih funkcija.
          </p>
          <ul className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <li key={feature.title} className="h-full">
                <Card size="sm" className="h-full">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <feature.icon
                        aria-hidden="true"
                        className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                      />
                      <h3 className="font-heading text-base font-semibold tracking-normal">
                        {feature.title}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="rad-naslov"
          className="border-t border-border px-4 py-16"
        >
          <h2 id="rad-naslov" className="text-2xl font-semibold tracking-tight">
            Magistarski rad
          </h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Aplikacija je nastala u sklopu magistarskog rada „Analiza
            performansi i korisničkog iskustva u React web aplikaciji za
            upravljanje osobnim financijama“. Rad uspoređuje strategije
            učitavanja podataka — blocking SSR, Suspense i prefetch — uz
            TanStack Query.
          </p>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>MyFinance</p>
          <p>Magistarski rad · osobne financije</p>
        </div>
      </footer>
    </div>
  )
}
