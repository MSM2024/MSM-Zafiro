'use client'

import { useState } from "react"
import { usePageTitle } from "@/lib/usePageTitle"
import { FolderOpen, FileText, Image, Music, Video, Archive, Download, Trash2, Upload, Plus, Search } from "lucide-react"

interface FileEntry {
  name: string
  type: 'folder' | 'document' | 'image' | 'audio' | 'video' | 'archive'
  size: string
  modified: string
}

const INITIAL_FILES: FileEntry[] = [
  { name: 'Documentos', type: 'folder', size: '—', modified: '2026-07-18' },
  { name: 'Imágenes', type: 'folder', size: '—', modified: '2026-07-17' },
  { name: 'Perfil ZAFIRO', type: 'document', size: '2.4 KB', modified: '2026-07-15' },
  { name: 'Membresía VIP', type: 'document', size: '1.1 KB', modified: '2026-07-10' },
  { name: 'Logo ZAFIRO', type: 'image', size: '156 KB', modified: '2026-07-01' },
]

const typeIcons: Record<string, typeof FileText> = {
  folder: FolderOpen, document: FileText, image: Image, audio: Music, video: Video, archive: Archive,
}

export default function OsFilesPage() {
  usePageTitle("ZAFIRO OS — Archivos")
  const [files] = useState(INITIAL_FILES)

  return (
    <div className="min-h-full p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Archivos</h1>
              <p className="text-xs text-slate-400">Almacenamiento local — 5 archivos</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
              <Upload className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF]/20 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Buscar archivos..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00D9FF]/50" />
          </div>
        </div>

        <div className="rounded-2xl glass overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] text-slate-500 font-bold uppercase border-b border-slate-800/60">
            <div className="col-span-5">Nombre</div>
            <div className="col-span-2">Tipo</div>
            <div className="col-span-2">Tamaño</div>
            <div className="col-span-2">Modificado</div>
            <div className="col-span-1" />
          </div>
          {files.map((file, i) => {
            const Icon = typeIcons[file.type] || FileText
            return (
              <div key={i} className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-slate-800/40 transition-colors items-center cursor-pointer group">
                <div className="col-span-5 flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${file.type === 'folder' ? 'text-[#00D9FF]' : 'text-slate-400'}`} />
                  <span className="text-sm text-white">{file.name}</span>
                </div>
                <div className="col-span-2 text-xs text-slate-500 capitalize">{file.type}</div>
                <div className="col-span-2 text-xs text-slate-500">{file.size}</div>
                <div className="col-span-2 text-xs text-slate-500">{file.modified}</div>
                <div className="col-span-1 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
