export type SafeUser = {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
}

export function toSafeUser(user: {
  id: string
  email?: string | null
  user_metadata?: {
    first_name?: string | null
    last_name?: string | null
  }
}): SafeUser | null {
  if (!user.email) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.user_metadata?.first_name,
    lastName: user.user_metadata?.last_name,
  }
}
