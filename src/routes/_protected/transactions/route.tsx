import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/transactions')({
  component: TransactionsLayout,
})

function TransactionsLayout() {
  return <Outlet />
}
