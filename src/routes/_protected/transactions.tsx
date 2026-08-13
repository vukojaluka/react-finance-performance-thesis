import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/transactions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/transactions"!</div>
}
