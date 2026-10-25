import { defaultStringifySearch } from '@tanstack/react-router'
import type { SearchSerializer } from '@tanstack/react-router'

// Equal search values can be enumerated in a different order on the server
// and the client. Sort keys so both sides emit the same href during hydration.
export const stringifySearch: SearchSerializer = (search) => {
  const sorted: Record<string, unknown> = {}

  for (const key of Object.keys(search).sort()) {
    sorted[key] = search[key]
  }

  return defaultStringifySearch(sorted)
}
