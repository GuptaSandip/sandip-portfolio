import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { clsx } from 'clsx'

interface Props {
  id?: string
  children: ReactNode
  className?: string
}

export default function SectionWrapper({ id, children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.reveal').forEach((node, i) => {
            setTimeout(() => node.classList.add('visible'), i * 80)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div id={id} ref={ref} className={clsx('section', className)}>
      <div className="section-inner">
        {children}
      </div>
    </div>
  )
}
