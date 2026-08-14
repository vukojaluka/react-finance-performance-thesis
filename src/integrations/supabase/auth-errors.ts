import type { AuthError } from '@supabase/supabase-js'
import type { ErrorCode } from '@supabase/auth-js/dist/module/lib/error-codes'

const GENERIC_AUTH_ERROR_MESSAGE = 'Došlo je do greške. Pokušajte ponovno.'

const SUPABASE_AUTH_ERROR_MESSAGES = {
  unexpected_failure: 'Došlo je do neočekivane greške. Pokušajte ponovno.',
  validation_failed: 'Uneseni podaci nisu valjani.',
  bad_json: 'Zahtjev nije valjan. Pokušajte ponovno.',
  email_exists: 'Račun s ovom e-mail adresom već postoji.',
  phone_exists: 'Račun s ovim brojem telefona već postoji.',
  bad_jwt: 'Sesija nije valjana. Prijavite se ponovno.',
  not_admin: 'Nemate administratorske ovlasti za ovu radnju.',
  no_authorization: 'Niste ovlašteni za ovu radnju.',
  user_not_found: 'Korisnik nije pronađen.',
  session_not_found: 'Sesija nije pronađena. Prijavite se ponovno.',
  session_expired: 'Sesija je istekla. Prijavite se ponovno.',
  refresh_token_not_found: 'Sesija nije pronađena. Prijavite se ponovno.',
  refresh_token_already_used: 'Sesija više nije valjana. Prijavite se ponovno.',
  flow_state_not_found: 'Autentifikacijski tijek nije pronađen. Pokušajte ponovno.',
  flow_state_expired: 'Autentifikacijski tijek je istekao. Pokušajte ponovno.',
  signup_disabled: 'Registracija je trenutačno onemogućena.',
  user_banned: 'Ovaj račun je suspendiran.',
  provider_email_needs_verification:
    'Potvrdite e-mail adresu kod pružatelja prijave.',
  invite_not_found: 'Pozivnica nije pronađena ili više nije valjana.',
  bad_oauth_state: 'Prijava putem vanjskog pružatelja nije uspjela.',
  bad_oauth_callback: 'Prijava putem vanjskog pružatelja nije uspjela.',
  oauth_provider_not_supported: 'Ovaj način prijave nije podržan.',
  unexpected_audience: 'Sesija nije valjana. Prijavite se ponovno.',
  single_identity_not_deletable:
    'Ne možete ukloniti jedini način prijave na računu.',
  email_conflict_identity_not_deletable:
    'Ne možete ukloniti ovaj način prijave zbog konflikta e-mail adrese.',
  identity_already_exists: 'Ovaj način prijave već je povezan s računom.',
  email_provider_disabled: 'Prijava e-mailom je onemogućena.',
  phone_provider_disabled: 'Prijava telefonom je onemogućena.',
  too_many_enrolled_mfa_factors:
    'Dosegnut je maksimalan broj MFA faktora.',
  mfa_factor_name_conflict: 'MFA faktor s ovim nazivom već postoji.',
  mfa_factor_not_found: 'MFA faktor nije pronađen.',
  mfa_ip_address_mismatch: 'MFA provjera nije uspjela zbog adrese pristupa.',
  mfa_challenge_expired: 'MFA izazov je istekao. Pokušajte ponovno.',
  mfa_verification_failed: 'MFA potvrda nije uspjela.',
  mfa_verification_rejected: 'MFA potvrda je odbijena.',
  insufficient_aal: 'Potrebna je dodatna autentifikacija.',
  captcha_failed: 'Captcha provjera nije uspjela. Pokušajte ponovno.',
  saml_provider_disabled: 'SAML prijava je onemogućena.',
  manual_linking_disabled: 'Ručno povezivanje računa je onemogućeno.',
  sms_send_failed: 'Slanje SMS poruke nije uspjelo. Pokušajte ponovno.',
  email_not_confirmed: 'Potvrdite e-mail adresu prije prijave.',
  phone_not_confirmed: 'Potvrdite broj telefona prije prijave.',
  reauth_nonce_missing: 'Ponovna autentifikacija nije uspjela. Pokušajte ponovno.',
  saml_relay_state_not_found: 'SAML prijava nije uspjela. Pokušajte ponovno.',
  saml_relay_state_expired: 'SAML prijava je istekla. Pokušajte ponovno.',
  saml_idp_not_found: 'SAML pružatelj nije pronađen.',
  saml_assertion_no_user_id: 'SAML odgovor ne sadrži identifikator korisnika.',
  saml_assertion_no_email: 'SAML odgovor ne sadrži e-mail adresu.',
  user_already_exists: 'Račun s ovom e-mail adresom već postoji.',
  sso_provider_not_found: 'SSO pružatelj nije pronađen.',
  saml_metadata_fetch_failed: 'Dohvat SAML metapodataka nije uspio.',
  saml_idp_already_exists: 'SAML pružatelj već postoji.',
  sso_domain_already_exists: 'SSO domena već postoji.',
  saml_entity_id_mismatch: 'SAML identifikator entiteta se ne podudara.',
  conflict: 'Došlo je do konflikta. Pokušajte ponovno.',
  provider_disabled: 'Ovaj način prijave je onemogućen.',
  user_sso_managed: 'Ovim računom upravlja SSO pružatelj.',
  reauthentication_needed: 'Potrebna je ponovna autentifikacija.',
  same_password: 'Nova lozinka mora biti različita od trenutačne.',
  reauthentication_not_valid: 'Ponovna autentifikacija nije valjana.',
  otp_expired: 'Jednokratni kod je istekao. Zatražite novi.',
  otp_disabled: 'Jednokratni kodovi su onemogućeni.',
  identity_not_found: 'Način prijave nije pronađen.',
  weak_password: 'Lozinka je preslaba. Koristite najmanje 8 znakova.',
  over_request_rate_limit:
    'Previše zahtjeva. Pričekajte malo i pokušajte ponovno.',
  over_email_send_rate_limit:
    'Previše e-mail poruka. Pričekajte malo i pokušajte ponovno.',
  over_sms_send_rate_limit:
    'Previše SMS poruka. Pričekajte malo i pokušajte ponovno.',
  bad_code_verifier: 'Provjera autentifikacije nije uspjela. Pokušajte ponovno.',
  anonymous_provider_disabled: 'Anonimna prijava je onemogućena.',
  hook_timeout: 'Autentifikacijska obrada je istekla. Pokušajte ponovno.',
  hook_timeout_after_retry:
    'Autentifikacijska obrada je istekla. Pokušajte ponovno.',
  hook_payload_over_size_limit: 'Zahtjev je prevelik. Pokušajte ponovno.',
  hook_payload_invalid_content_type: 'Zahtjev nije valjan. Pokušajte ponovno.',
  request_timeout: 'Zahtjev je istekao. Pokušajte ponovno.',
  mfa_phone_enroll_not_enabled: 'MFA prijava telefonom nije omogućena.',
  mfa_phone_verify_not_enabled: 'MFA potvrda telefonom nije omogućena.',
  mfa_totp_enroll_not_enabled: 'MFA TOTP prijava nije omogućena.',
  mfa_totp_verify_not_enabled: 'MFA TOTP potvrda nije omogućena.',
  mfa_webauthn_enroll_not_enabled: 'MFA WebAuthn prijava nije omogućena.',
  mfa_webauthn_verify_not_enabled: 'MFA WebAuthn potvrda nije omogućena.',
  mfa_verified_factor_exists: 'Već postoji potvrđeni MFA faktor.',
  invalid_credentials: 'Neispravna e-mail adresa ili lozinka.',
  email_address_not_authorized: 'Ova e-mail adresa nije ovlaštena.',
  email_address_invalid: 'Unesite valjanu e-mail adresu.',
} as const satisfies Record<ErrorCode, string>

export function mapSupabaseAuthErrors(error: AuthError): string {
  const { code } = error

  if (!code || !(code in SUPABASE_AUTH_ERROR_MESSAGES)) {
    return GENERIC_AUTH_ERROR_MESSAGE
  }

  return SUPABASE_AUTH_ERROR_MESSAGES[code as ErrorCode]
}
