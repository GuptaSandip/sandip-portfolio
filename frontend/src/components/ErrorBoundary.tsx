import { Component, ReactNode } from 'react'
import { AlertTriangle, Home, RotateCcw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔴 Error caught by boundary:', error)
    console.error('Error info:', errorInfo)
    
    // Send to error tracking service (Sentry, etc.) in production
    if (import.meta.env.PROD) {
      // TODO: Send to Sentry
      console.log('[ERROR TRACKING] Would send to Sentry:', error.message)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--outer-bg)',
          padding: '2rem',
        }}>
          <div style={{
            maxWidth: '500px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--bd)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: 'var(--card-shadow)',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <AlertTriangle size={28} style={{ color: '#DC2626' }} />
            </div>

            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--text-card-1)',
              marginBottom: '0.5rem',
            }}>
              Oops! Something went wrong
            </h1>

            <p style={{
              fontSize: '14px',
              color: 'var(--text-card-2)',
              marginBottom: '1.5rem',
              lineHeight: 1.6,
            }}>
              We encountered an unexpected error. The developers have been notified, and we're working on a fix.
            </p>

            {this.state.error && import.meta.env.DEV && (
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'left',
                overflow: 'auto',
                maxHeight: '200px',
              }}>
                <p style={{
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: 'var(--text-card-3)',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
            }}>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#C99A63'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'var(--accent)'
                }}
              >
                <Home size={16} />
                Go Home
              </button>

              <button
                onClick={() => window.location.reload()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: 'var(--accent)',
                  border: '1px solid var(--bd)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.borderColor = 'var(--accent)'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.borderColor = 'var(--bd)'
                }}
              >
                <RotateCcw size={16} />
                Retry
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
