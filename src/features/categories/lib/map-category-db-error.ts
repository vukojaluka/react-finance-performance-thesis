const DUPLICATE_NAME_MESSAGE = 'Kategorija s ovim nazivom već postoji.'

const IN_USE_DELETE_MESSAGE =
  'Kategoriju nije moguće obrisati dok je koriste transakcije ili budžeti. Umjesto brisanja, uredite kategoriju ili je zadržite.'

type SupabaseErrorLike = {
  code?: string
  message?: string
}

export function mapCategoryDbError(
  error: SupabaseErrorLike,
  fallback: string,
): string {
  if (error.code === '23505') {
    return DUPLICATE_NAME_MESSAGE
  }

  if (error.code === '23503') {
    return IN_USE_DELETE_MESSAGE
  }

  return fallback
}
