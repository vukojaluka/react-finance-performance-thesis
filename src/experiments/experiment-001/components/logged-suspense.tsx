import { Suspense, useEffect } from 'react'
import type { ReactNode } from 'react'

import { experimentLog } from '../lib/experiment-logger'

type LoggedSuspenseProps = {
  name: string
  fallback: ReactNode
  children: ReactNode
}

function SuspenseResolvedLogger({
  name,
  children,
}: {
  name: string
  children: ReactNode
}) {
  useEffect(() => {
    experimentLog('Suspense component resolved', name)
  }, [name])

  return children
}

export function LoggedSuspense({
  name,
  fallback,
  children,
}: LoggedSuspenseProps) {
  useEffect(() => {
    experimentLog('Suspense component mounted', name)
  }, [name])

  return (
    <Suspense fallback={fallback}>
      <SuspenseResolvedLogger name={name}>{children}</SuspenseResolvedLogger>
    </Suspense>
  )
}
