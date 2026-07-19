'use client'

import Link from "next/link"
import { BookOpen, FileText, CheckCircle, Clock, AlertTriangle, Archive } from "lucide-react"
import type { Book, BookStatus } from "@/lib/biblioteca/types"
import { BOOK_STATUS_LABELS, BOOK_STATUS_COLORS, BOOK_STATUS_BG } from "@/lib/biblioteca/types"

const statusIcon: Record<BookStatus, typeof BookOpen> = {
  SUBIDO: Clock,
  VALIDADO: CheckCircle,
  ESTRUCTURADO: FileText,
  EN_REVISION: AlertTriangle,
  APROBADO: CheckCircle,
  PUBLICADO: BookOpen,
  ARCHIVADO: Archive,
}

export default function BookCard({ book }: { book: Book }) {
  const StatusIcon = statusIcon[book.status] || BookOpen
  const href = `/zafiro/biblioteca/${book.id}`

  return (
    <Link href={href} className="block">
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-[#00D9FF]/30 transition-all group">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: book.coverColor + '20', color: book.coverColor }}
          >
            <BookOpen className="w-6 h-6" />
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${BOOK_STATUS_BG[book.status]} ${BOOK_STATUS_COLORS[book.status]}`}>
            {BOOK_STATUS_LABELS[book.status]}
          </span>
        </div>
        <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#00D9FF] transition-colors line-clamp-2">
          {book.title}
        </h3>
        <p className="text-[11px] text-slate-500 mb-3 line-clamp-2">
          {book.description.slice(0, 120)}
        </p>
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {book.chapterCount} capítulos
          </span>
          <span className="flex items-center gap-1">
            <StatusIcon className="w-3 h-3" />
            {book.wordCount.toLocaleString()} palabras
          </span>
        </div>
      </div>
    </Link>
  )
}
