// ─────────────────────────────────────────────
// Tag.tsx  →  src/components/ui/Tag.tsx
// ─────────────────────────────────────────────
import { clsx } from 'clsx'

interface TagProps {
  children: string
  variant?: 'purple' | 'cyan' | 'green' | 'gray'
  size?: 'sm' | 'md'
}

export function Tag({ children, variant = 'purple', size = 'md' }: TagProps) {
  return (
    <span
      className={clsx(
        'inline-block font-mono rounded-md border',
        variant === 'purple' && 'bg-primary-400/10 text-primary-200 border-primary-400/20',
        variant === 'cyan' && 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
        variant === 'green' && 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
        variant === 'gray' && 'bg-ink-muted/10 text-ink-secondary border-border',
        size === 'sm' && 'text-[11px] px-2 py-0.5',
        size === 'md' && 'text-xs px-2.5 py-0.5'
      )}
    >
      {children}
    </span>
  )
}

export default Tag
