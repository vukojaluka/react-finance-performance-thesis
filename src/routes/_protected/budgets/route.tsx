import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/budgets')({
  component: BudgetsLayout,
})

function BudgetsLayout() {
  return <Outlet />
}
