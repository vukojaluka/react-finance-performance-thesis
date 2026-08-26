import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/categories')({
  component: CategoriesLayout,
})

function CategoriesLayout() {
  return <Outlet />
}
