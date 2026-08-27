import { useState } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CategoryDeleteDialog } from '@/features/categories/components/category-delete-dialog'
import { hasActiveCategorySearch } from '@/features/categories/schemas/category-search.schema'
import type { CategoryListItem } from '@/features/categories/server/get-categories'

type CategoriesTableProps = {
  categories: CategoryListItem[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const search = useSearch({ from: '/_protected/categories/' })
  const navigate = useNavigate({ from: '/categories' })
  const hasSearch = hasActiveCategorySearch(search)
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)
  const isDeleteDialogOpen = deleteCategoryId !== null

  function handleClearSearch() {
    void navigate({ search: { page: 1 } })
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-none border border-dashed border-border/60 px-4 py-10 text-center">
        <p className="text-muted-foreground text-sm">
          {hasSearch
            ? 'Nema kategorija koje odgovaraju pretrazi.'
            : 'Još nema kategorija.'}
        </p>
        {hasSearch ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={handleClearSearch}
          >
            Očisti pretragu
          </Button>
        ) : null}
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Boja</TableHead>
            <TableHead>Naziv</TableHead>
            <TableHead className="text-right">Akcije</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <span
                  className="inline-block size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color }}
                  aria-hidden
                />
              </TableCell>
              <TableCell className="max-w-48 truncate font-medium">
                {category.name}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="icon" />}
                  >
                    <MoreHorizontalIcon className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      render={
                        <Link
                          to="/categories/$categoryId/edit"
                          params={{ categoryId: category.id }}
                        />
                      }
                    >
                      <PencilIcon className="size-4" />
                      Uredi
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeleteCategoryId(category.id)}
                    >
                      <TrashIcon className="size-4" />
                      Obriši
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CategoryDeleteDialog
        categoryId={deleteCategoryId}
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteCategoryId(null)
          }
        }}
      />
    </>
  )
}
