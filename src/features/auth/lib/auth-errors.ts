export function mapAuthErrorMessage(error: {
  message?: string
  code?: string
}): string {
  const message = error.message?.toLowerCase() ?? ''
  const code = error.code?.toLowerCase() ?? ''

  if (
    code.includes('invalid_credentials') ||
    message.includes('invalid login credentials')
  ) {
    return 'Neispravna e-mail adresa ili lozinka.'
  }

  if (
    code.includes('user_already_exists') ||
    message.includes('already registered') ||
    message.includes('user already registered')
  ) {
    return 'Račun s ovom e-mail adresom već postoji.'
  }

  if (
    code.includes('weak_password') ||
    (message.includes('password') && message.includes('weak'))
  ) {
    return 'Lozinka je preslaba. Koristite najmanje 8 znakova.'
  }

  if (
    code.includes('validation_failed') ||
    message.includes('invalid email') ||
    (message.includes('email address') && message.includes('invalid'))
  ) {
    return 'Unesite valjanu e-mail adresu.'
  }

  if (message.includes('email not confirmed')) {
    return 'Potvrdite e-mail adresu prije prijave.'
  }

  return 'Došlo je do greške. Pokušajte ponovno.'
}
