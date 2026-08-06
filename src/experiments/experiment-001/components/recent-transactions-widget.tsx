import { useSuspenseQuery } from '@tanstack/react-query'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { recentTransactionsQuery } from '../queries/recent-transactions.query'

export function RecentTransactionsWidget() {
  const { data } = useSuspenseQuery(recentTransactionsQuery())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-2 py-2 font-medium">Date</th>
                <th className="px-2 py-2 font-medium">Title</th>
                <th className="px-2 py-2 font-medium">Type</th>
                <th className="px-2 py-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((transaction) => (
                <tr key={transaction.id} className="border-b last:border-0">
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
      </CardContent>
    </Card>
  )
}
