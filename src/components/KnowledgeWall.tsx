'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getQuestions, type Question } from '@/lib/data'

export function KnowledgeWall() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getQuestions().then((data) => {
      setQuestions(data.slice(0, 6))
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <section className="wall responsive-grid-3" aria-label="Muro vivo de conocimiento" style={{
        display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16,
      }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card" style={{
            minHeight: 224, padding: 20,
            border: "1px solid var(--border)", borderRadius: 24,
            background: "var(--surface)",
          }}>
            <div style={{ height: 12, width: '60%', background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 16 }} />
            <div style={{ height: 20, width: '90%', background: 'rgba(255,255,255,0.06)', borderRadius: 8, marginBottom: 14 }} />
            <div style={{ height: 14, width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 6, marginBottom: 6 }} />
            <div style={{ height: 14, width: '80%', background: 'rgba(255,255,255,0.04)', borderRadius: 6 }} />
          </div>
        ))}
      </section>
    )
  }

  if (questions.length === 0) {
    return (
      <section className="wall" style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
        <p>Aún no hay preguntas. ¡Sé el primero en preguntar!</p>
      </section>
    )
  }

  return (
    <section className="wall responsive-grid-3" aria-label="Muro vivo de conocimiento" style={{
      display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16,
    }}>
      {questions.map((card) => (
        <Link key={card.id} href={`/question/${card.id}`} style={{ textDecoration: 'none' }}>
          <article
            className="card"
            style={{
              minHeight: 224, padding: 20,
              border: "1px solid var(--border)", borderRadius: 24,
              background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)",
              backdropFilter: "blur(22px)", transition: "transform 180ms ease, border-color 180ms ease",
              cursor: 'pointer',
            }}
          >
            <div className="meta" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 12, marginBottom: 16 }}>
              <span>{card.category}</span>
              <span>{new Date(card.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
            </div>
            <h2 className="question" style={{ margin: "0 0 14px", fontSize: 19, lineHeight: 1.25, fontWeight: 750, color: 'var(--text)' }}>{card.title}</h2>
            <p className="answer" style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55, fontSize: 14 }}>{card.body.slice(0, 120)}...</p>
            <div className="stats" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 22, color: "var(--muted)", fontSize: 12 }}>
              <span>{card.score} votos</span>
              <span>{card.answerCount} respuestas</span>
            </div>
          </article>
        </Link>
      ))}
    </section>
  )
}
