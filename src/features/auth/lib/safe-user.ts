export type SafeUser = {
  id: string
  email: string
}

export function toSafeUser(user: {
  id: string
  email?: string | null
}): SafeUser | null {
  if (!user.email) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
  }
}
