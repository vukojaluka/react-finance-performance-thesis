import { Link, createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_public/')({
  component: LandingPage,
  head: () => ({
    meta: [
      {
        title: 'MyFinance',
      },
    ],
  }),
})

function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-16">
      <p className="text-sm font-medium text-muted-foreground">MyFinance</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Pregledajte osobne financije na jednom mjestu
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
        Pratite transakcije, kategorije i budžete uz jasan uvid u svoj novac.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button nativeButton={false} render={<Link to="/register" />}>
          Registrirajte se
        </Button>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link to="/login" search={{ redirect: '/dashboard' }} />}
        >
          Prijavite se
        </Button>
      </div>
    </main>
  )
}
