import { clsx } from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export default function Button({ variant = 'primary', size = 'md', loading = false, children, className, disabled, ...props }: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-sans font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-primary-400 text-white hover:bg-primary-300 shadow-glow-sm hover:shadow-glow-md',
        variant === 'ghost' && 'border border-border text-ink-secondary hover:border-primary-400/60 hover:text-ink-primary',
        variant === 'outline' && 'border border-primary-400/40 text-primary-200 hover:bg-primary-400/10 hover:border-primary-400',
        variant === 'danger' && 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
        size === 'sm' && 'text-xs px-3 py-1.5',
        size === 'md' && 'text-sm px-5 py-2.5',
        size === 'lg' && 'text-base px-7 py-3',
        className
      )}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
