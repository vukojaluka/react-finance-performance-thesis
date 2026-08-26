import type { CategoryListItem } from '@/features/categories/server/get-categories'

export const DEFAULT_CATEGORY_COLOR = '#3b82f6'

export const CATEGORY_COLOR_PRESETS = [
  '#22c55e',
  '#ef4444',
  '#3b82f6',
  '#f59e0b',
  '#a855f7',
  '#ec4899',
  '#14b8a6',
  '#737373',
] as const

export type CategoryFormMode = 'create' | 'edit'

export type CategoryFormValues = {
  name: string
  color: string
}

export const CATEGORY_FORM_COPY = {
  create: {
    title: 'NOVA KATEGORIJA',
    description: 'Dodajte novu kategoriju za organizaciju transakcija.',
    submit: 'Spremi kategoriju',
  },
  edit: {
    title: 'UREDI KATEGORIJU',
    description: 'Izmijenite naziv ili boju postojeće kategorije.',
    submit: 'Spremi promjene',
  },
} as const

export type CategoryFormCopy =
  (typeof CATEGORY_FORM_COPY)[keyof typeof CATEGORY_FORM_COPY]

export function getCreateDefaultValues(): CategoryFormValues {
  return {
    name: '',
    color: DEFAULT_CATEGORY_COLOR,
  }
}

export function mapCategoryToFormValues(
  category: CategoryListItem,
): CategoryFormValues {
  return {
    name: category.name,
    color: category.color,
  }
}
