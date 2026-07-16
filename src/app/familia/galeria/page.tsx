'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Images, Upload, X } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"

interface FamilyPhoto {
  id: string
  title: string
  category: string
  dataUrl: string
  dateApprox?: string
  location?: string
  createdAt: string
}

const PHOTOS_KEY = "zafiro_family_photos"
const CATEGORIES = [
  "Abuelos", "Padres", "Hermanos", "Tíos", "Hijos", "Sobrinos", "Nietos",
  "Las Siete Vueltas", "Villa Esperanza", "Fotos antiguas restauradas",
]

export default function GaleriaPage() {
  usePageTitle("Galería Familiar")
  const [photos, setPhotos] = useState<FamilyPhoto[]>([])
  const [filter, setFilter] = useState<string>("")
  const [showUpload, setShowUpload] = useState(false)
  const [uploadForm, setUploadForm] = useState({ title: "", category: CATEGORIES[0], dateApprox: "", location: "" })
  const [uploadFile, setUploadFile] = useState<string>("")

  useEffect(() => {
    setPhotos(JSON.parse(localStorage.getItem(PHOTOS_KEY) || "[]"))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setUploadFile(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) return
    const newPhoto: FamilyPhoto = {
      id: `photo-${Date.now()}`,
      title: uploadForm.title || "Sin título",
      category: uploadForm.category,
      dataUrl: uploadFile,
      dateApprox: uploadForm.dateApprox,
      location: uploadForm.location,
      createdAt: new Date().toISOString(),
    }
    const updated = [newPhoto, ...photos]
    setPhotos(updated)
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(updated))
    setShowUpload(false)
    setUploadFile("")
    setUploadForm({ title: "", category: CATEGORIES[0], dateApprox: "", location: "" })
  }

  const filtered = filter ? photos.filter(p => p.category === filter) : photos

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050816] via-[#0a1128] to-[#123B8F]/20 text-white pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <Link href="/familia" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver a Familia
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Images className="w-7 h-7 text-[#D6A83A]" /> Galería Familiar
            </h1>
            <p className="text-zinc-400 text-sm mt-1">{photos.length} fotografías preservadas</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#D6A83A] text-[#111827] font-medium text-sm hover:bg-[#D6A83A]/90"
          >
            <Upload className="w-4 h-4" /> Subir Foto
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setFilter("")}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${!filter ? "bg-[#D6A83A] text-[#111827] border-[#D6A83A]" : "border-white/20 text-zinc-400 hover:text-white"}`}
          >
            Todas
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${filter === c ? "bg-[#D6A83A] text-[#111827] border-[#D6A83A]" : "border-white/20 text-zinc-400 hover:text-white"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <Images className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aún no hay fotografías{filter ? ` en "${filter}"` : ""}.</p>
            <p className="text-sm mt-1">Sube la primera foto para preservar la memoria familiar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.dataUrl} alt={p.title} className="w-full h-40 object-cover" />
                <div className="p-3">
                  <div className="text-sm font-medium truncate">{p.title}</div>
                  <div className="text-xs text-zinc-500">{p.category}{p.dateApprox ? ` · ${p.dateApprox}` : ""}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[#0a1128] border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Subir Fotografía</h2>
                <button onClick={() => setShowUpload(false)}><X className="w-5 h-5 text-zinc-400" /></button>
              </div>
              <form onSubmit={handleUpload} className="space-y-4">
                <input type="file" accept="image/*" onChange={handleFileChange} required
                  className="w-full text-sm text-zinc-400 file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-[#D6A83A] file:text-[#111827] file:text-sm file:font-medium" />
                {uploadFile && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={uploadFile} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                )}
                <input type="text" placeholder="Título de la foto" value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#D6A83A]" />
                <select value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#D6A83A] text-white [&>option]:bg-[#0a1128]">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Fecha aprox. (1985...)" value={uploadForm.dateApprox}
                    onChange={(e) => setUploadForm({ ...uploadForm, dateApprox: e.target.value })}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#D6A83A]" />
                  <input type="text" placeholder="Lugar" value={uploadForm.location}
                    onChange={(e) => setUploadForm({ ...uploadForm, location: e.target.value })}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#D6A83A]" />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-[#D6A83A] text-[#111827] font-semibold">
                  Guardar en la Nube Familiar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
