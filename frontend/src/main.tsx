import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import * as Sentry from '@sentry/react'
import { initSentry } from '@/lib/sentry'
import App from './App'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './index.css'

// Initialize Sentry error tracking
initSentry()

// Wrap App with Sentry for route tracking
const SentryApp = Sentry.withProfiler(App)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <SentryApp />
    </HelmetProvider>
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>
)
