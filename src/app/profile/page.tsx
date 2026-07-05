"use client";

import { useState, useEffect } from "react";
import { FollowButton } from "@/components/FollowButton";

const DEMO_USER_ID = "demo-current-user";
const DEMO_TARGET_ID = "demo-target-user";

export default function ProfilePage() {
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });

  useEffect(() => {
    fetch(`/api/follow?userId=${DEMO_USER_ID}`)
      .then((r) => r.json())
      .then((data) => {
        setFollowers(data.followers || []);
        setFollowing(data.following || []);
        setCounts(data.count || { followers: 0, following: 0 });
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="section-head" style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "clamp(26px, 4vw, 42px)", lineHeight: 1.05 }}>Perfil</h2>
          <p style={{ maxWidth: 560, margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.55 }}>Tu identidad pública construida con preguntas, respuestas y reputación.</p>
        </div>
      </div>

      <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
        <article className="panel profile-card" style={{ padding: 22, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)" }}>
          <div className="avatar" style={{ width: 64, height: 64, marginBottom: 14, borderRadius: 22, background: "linear-gradient(135deg, #2563ff, #7c3aed, #d946ef)" }} />
          <h3 style={{ margin: "0 0 4px" }}>Don Miguel</h3>
          <p style={{ margin: "0 0 12px", color: "var(--muted)", lineHeight: 1.5, fontSize: 14 }}>Creador de MSM Zafiro. Inventor, visionario.</p>
          <FollowButton targetUserId={DEMO_TARGET_ID} currentUserId={DEMO_USER_ID} />
        </article>

        <article className="panel profile-card" style={{ padding: 22, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)" }}>
          <h3 style={{ margin: "0 0 8px" }}>Reputación</h3>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5, fontSize: 14 }}>∞ puntos · Nivel 99 · Creador</p>
        </article>

        <article className="panel profile-card" style={{ padding: 22, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)" }}>
          <h3 style={{ margin: "0 0 8px" }}>Siguiendo</h3>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5, fontSize: 14 }}>
            <strong>{counts.followers}</strong> seguidores · <strong>{counts.following}</strong> siguiendo
          </p>
        </article>
      </div>

      <div className="section-head" style={{ marginTop: 16 }}>
        <h2 style={{ margin: 0, fontSize: "clamp(20px, 3vw, 28px)" }}>Gente que podrías seguir</h2>
      </div>
      <div className="suggested-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {[
          { name: "Ana Martínez", role: "Experta en IA", id: "suggest-1" },
          { name: "Dr. Carlos Ruiz", role: "Científico", id: "suggest-2" },
          { name: "Elena Gómez", role: "Emprendedora", id: "suggest-3" },
          { name: "Laura Pérez", role: "Salud y bienestar", id: "suggest-4" },
        ].map((person) => (
          <div key={person.id} className="suggest-card" style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 20, background: "var(--surface)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 14, background: "linear-gradient(135deg, #2563ff, #7c3aed)", flex: "0 0 auto" }} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: "block", fontSize: 14 }}>{person.name}</strong>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{person.role}</span>
            </div>
            <FollowButton targetUserId={person.id} currentUserId={DEMO_USER_ID} />
          </div>
        ))}
      </div>
    </>
  );
}
