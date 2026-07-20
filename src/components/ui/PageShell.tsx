'use client'

import { motion } from "motion/react"
import type { LucideIcon } from "lucide-react"
import { Skeleton } from "./Skeleton"
import { EmptyState } from "./EmptyState"

interface PageShellProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  icon?: LucideIcon
  loading?: boolean
  skeleton?: React.ReactNode
  empty?: { title: string; description?: string; icon?: LucideIcon; action?: { label: string; onClick: () => void } }
  className?: string
}

export function PageShell({ children, title, subtitle, icon: Icon, loading, skeleton, empty, className = "" }: PageShellProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      className={`min-h-screen bg-[#050816] text-white p-4 md:p-6 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {(title || Icon) && (
          <div className="flex items-center gap-3 mb-6">
            {Icon && <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center"><Icon className="w-5 h-5 text-[#00D9FF]" /></div>}
            <div>
              {title && <h1 className="text-lg font-bold">{title}</h1>}
              {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
            </div>
          </div>
        )}
        {loading ? (skeleton || <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>)
          : empty ? <EmptyState {...empty} />
          : children}
      </div>
    </motion.div>
  )
}
