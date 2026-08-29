import * as Sentry from '@sentry/react'

export function initSentry() {
  const isDev = import.meta.env.DEV
  const dsn = import.meta.env.VITE_SENTRY_DSN

  if (isDev || !dsn) {
    console.log('[Sentry] Skipped initialization (dev mode or no DSN)')
    return
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION || 'unknown',
    tracesSampleRate: 0.1,
  })

  console.log('[Sentry] Initialized successfully')
}
