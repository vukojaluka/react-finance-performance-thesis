import type { ErrorComponentProps } from '@tanstack/react-router'
import { z } from 'zod'

const serializedZodIssueSchema = z.object({
  code: z.string(),
  path: z.array(z.union([z.string(), z.number()])),
  message: z.string(),
})

const serializedZodIssuesSchema = z.array(serializedZodIssueSchema).min(1)

export type RouteErrorDetails =
  | {
      kind: 'validation'
      message: string
    }
  | {
      kind: 'global'
      message: string
    }

export function getRouteError({
  error,
}: Pick<ErrorComponentProps, 'error'>): RouteErrorDetails {
  const validationMessages = getZodErrorMessages(error)

  if (validationMessages) {
    return {
      kind: 'validation',
      message: validationMessages.join('\n'),
    }
  }

  return {
    kind: 'global',
    message:
      getErrorMessage(error) ??
      'Došlo je do neočekivane greške. Pokušajte ponovno.',
  }
}

function getZodErrorMessages(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues.map((issue) => issue.message)
  }

  if (isObject(error) && 'issues' in error) {
    const result = serializedZodIssuesSchema.safeParse(error.issues)

    if (result.success) {
      return result.data.map((issue) => issue.message)
    }
  }

  const message = getErrorMessage(error)

  if (!message) {
    return null
  }

  try {
    const result = serializedZodIssuesSchema.safeParse(JSON.parse(message))

    return result.success ? result.data.map((issue) => issue.message) : null
  } catch {
    return null
  }
}

function getErrorMessage(error: unknown) {
  if (typeof error === 'string' && error.trim()) {
    return error
  }

  if (
    isObject(error) &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.trim()
  ) {
    return error.message
  }

  return null
}

function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null
}
