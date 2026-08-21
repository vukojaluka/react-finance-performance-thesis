import { Link, createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/_protected/transactions/new')({
  component: NewTransactionPage,
  head: () => ({
    meta: [
      {
        title: 'Nova transakcija - MyFinance',
      },
    ],
  }),
})

function NewTransactionPage() {
  return (
    <div className="flex h-full min-w-0 flex-col gap-4">
      <div>
        <h1 className="font-heading text-xl font-semibold tracking-wider uppercase">
          Nova transakcija
        </h1>
        <p className="text-muted-foreground text-sm">
          Unos nove transakcije uskoro će biti dostupan.
        </p>
      </div>

      <Card size="sm" className="max-w-lg min-w-0">
        <CardHeader>
          <CardTitle className="text-sm tracking-normal normal-case">
            U izradi
          </CardTitle>
          <CardDescription>
            Forma za kreiranje transakcije još nije implementirana.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            nativeButton={false}
            variant="outline"
            size="sm"
            render={<Link to="/transactions" search={{ page: 1 }} />}
          >
            Natrag na transakcije
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
