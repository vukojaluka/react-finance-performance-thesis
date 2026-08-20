import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import debounce from 'debounce'
import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categoriesQuery } from '@/features/categories/queries/categories.query'

import { hasActiveTransactionFilters } from '../schemas/transaction-search.schema'
import type { TransactionFilters } from '../schemas/transaction-search.schema'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { XIcon } from 'lucide-react'
import { Input } from '../../../components/ui/input'

const TYPE_ITEMS = {
  all: 'Svi',
  income: 'Prihod',
  expense: 'Rashod',
} as const

const SORT_ITEMS = {
  date: 'Datum',
  amount: 'Iznos',
  description: 'Opis',
} as const

const SORT_DIRECTION_ITEMS = {
  asc: 'Uzlazno',
  desc: 'Silazno',
} as const

export function TransactionsFilters() {
  const search = useSearch({ from: '/_protected/transactions' })
  const navigate = useNavigate({ from: '/transactions' })
  const { data: categories = [] } = useQuery(categoriesQuery())

  const categoryItems = {
    all: 'Sve',
    ...Object.fromEntries(
      categories.map((category) => [category.id, category.name]),
    ),
  }

  const setFilters = useCallback(
    (patch: Partial<TransactionFilters>) => {
      void navigate({
        search: (prev) => ({
          ...prev,
          ...patch,
          page: 1,
        }),
      })
    },
    [navigate],
  )

  const [searchInput, setSearchInput] = useState(search.search ?? '')
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        const searchValue = value.trim()
        setFilters({ search: searchValue || undefined })
      }, 300),
    [setFilters],
  )
  const hasActiveFilters =
    hasActiveTransactionFilters(search) || searchInput !== ''

  function clearFilters() {
    debouncedSetSearch.clear()
    setSearchInput('')
    void navigate({ search: { page: 1 } })
  }

  return (
    <Card size="sm" className="min-w-0">
      <CardHeader className="flex justify-between">
        <CardTitle className="text-sm tracking-normal normal-case text-muted-foreground">
          FILTERI
        </CardTitle>

        <Button
          type="button"
          variant="outline"
          size="xs"
          disabled={!hasActiveFilters}
          onClick={clearFilters}
          title="Očisti sve filtere"
        >
          Očisti filtere
          <XIcon className="size-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <div className="flex min-w-0 flex-wrap items-end gap-3">
          <FilterField label="Pretraga" id="transactions-search">
            <Input
              type="search"
              placeholder="Pretraga po opisu"
              value={searchInput}
              onChange={(e) => {
                const value = e.target.value
                setSearchInput(value)
                debouncedSetSearch(value)
              }}
            />
          </FilterField>

          <FilterField label="Kategorija" id="transactions-category">
            <Select
              value={search.category_id ?? 'all'}
              items={categoryItems}
              onValueChange={(value) =>
                setFilters({
                  category_id: value && value !== 'all' ? value : undefined,
                })
              }
            >
              <SelectTrigger id="transactions-category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Sve</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="block size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="block">{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Tip" id="transactions-type">
            <Select
              value={search.type ?? 'all'}
              items={TYPE_ITEMS}
              onValueChange={(value) =>
                setFilters({
                  type:
                    value === 'income' || value === 'expense'
                      ? value
                      : undefined,
                })
              }
            >
              <SelectTrigger id="transactions-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Svi</SelectItem>
                <SelectItem value="income">Prihod</SelectItem>
                <SelectItem value="expense">Rashod</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Sortiraj" id="transactions-sort">
            <Select
              value={search.sort}
              items={SORT_ITEMS}
              onValueChange={(value) => {
                if (
                  value === 'date' ||
                  value === 'amount' ||
                  value === 'description'
                ) {
                  setFilters({ sort: value })
                }
              }}
            >
              <SelectTrigger id="transactions-sort" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Datum</SelectItem>
                <SelectItem value="amount">Iznos</SelectItem>
                <SelectItem value="description">Opis</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Smjer" id="transactions-sort-direction">
            <Select
              value={search.sortDirection}
              items={SORT_DIRECTION_ITEMS}
              onValueChange={(value) => {
                if (value === 'asc' || value === 'desc') {
                  setFilters({ sortDirection: value })
                }
              }}
            >
              <SelectTrigger
                id="transactions-sort-direction"
                className="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Uzlazno</SelectItem>
                <SelectItem value="desc">Silazno</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>
        </div>
      </CardContent>
    </Card>
  )
}

function FilterField({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: ReactNode
}) {
  return (
    <div className="min-w-40">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}
