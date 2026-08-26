import { useNavigate, useSearch } from '@tanstack/react-router'
import debounce from 'debounce'
import { XIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { hasActiveCategorySearch } from '@/features/categories/schemas/category-search.schema'
import type { CategorySearch } from '@/features/categories/schemas/category-search.schema'

export function CategoriesSearch() {
  const search = useSearch({ from: '/_protected/categories/' })
  const navigate = useNavigate({ from: '/categories' })
  const [searchInput, setSearchInput] = useState(search.search ?? '')

  const setSearch = useCallback(
    (patch: Partial<CategorySearch>) => {
      void navigate({
        search: (prev) => ({
          ...prev,
          ...patch,
        }),
      })
    },
    [navigate],
  )

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        const searchValue = value.trim()
        setSearch({ search: searchValue || undefined })
      }, 300),
    [setSearch],
  )

  const hasActiveSearch = hasActiveCategorySearch(search) || searchInput !== ''

  useEffect(() => {
    setSearchInput(search.search ?? '')
    debouncedSetSearch.clear()
  }, [search.search, debouncedSetSearch])

  function clearSearch() {
    debouncedSetSearch.clear()
    setSearchInput('')
    void navigate({ search: {} })
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
          disabled={!hasActiveSearch}
          onClick={clearSearch}
          title="Očisti pretragu"
          aria-label="Očisti pretragu"
        >
          <span className="hidden lg:block">Očisti pretragu</span>
          <XIcon className="size-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="min-w-0">
          <Label htmlFor="categories-search">Pretraga</Label>
          <Input
            id="categories-search"
            type="search"
            placeholder="Pretražite po nazivu"
            value={searchInput}
            onChange={(e) => {
              const value = e.target.value
              setSearchInput(value)
              debouncedSetSearch(value)
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
