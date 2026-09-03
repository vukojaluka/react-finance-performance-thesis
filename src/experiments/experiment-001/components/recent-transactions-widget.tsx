import { useSuspenseQuery } from '@tanstack/react-query'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { recentTransactionsQuery } from '../queries/recent-transactions.query'

export function RecentTransactionsWidget() {
  const { data } = useSuspenseQuery(recentTransactionsQuery())

  return (
    <Card
      size="sm"
      className="h-full min-h-80 min-w-0"
      data-exp-milestone="transactions"
    >
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p
            className="text-muted-foreground text-sm"
            data-exp-empty-state="transactions"
          >
            No transactions to display.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-2 py-2 font-medium">Date</th>
                  <th className="px-2 py-2 font-medium">Title</th>
                  <th className="px-2 py-2 font-medium">Type</th>
                  <th className="px-2 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b last:border-0"
                    data-exp-transaction-row
                  >
                    <td className="px-2 py-2">{transaction.date}</td>
                    <td className="px-2 py-2">{transaction.title}</td>
                    <td className="px-2 py-2 capitalize">{transaction.type}</td>
                    <td className="px-2 py-2 text-right tabular-nums">
                      {transaction.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
