"use client";

import { useState } from "react";

export default function AuthPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState("Quiero aprender");
  const [status, setStatus] = useState("Cuenta no creada");
  const [result, setResult] = useState("Cuando el usuario se registra, se crea perfil, plan inicial, preferencias de idioma y acceso al asistente ELIANA.");

  function createAccount() {
    const displayName = name.trim() || "Nuevo usuario";
    const displayEmail = email.trim() || "usuario@knowledgefuture.ai";
    const displayPhone = phone.trim() || "Sin teléfono";
    setStatus("Cuenta demo creada");
    setResult(`${displayName} fue creado con plan Free, email ${displayEmail}, teléfono ${displayPhone} y objetivo: ${goal}. En la app real Supabase Auth guardaría la sesión y crearía el perfil.`);
    localStorage.setItem("demoAccount", JSON.stringify({ name: displayName, email: displayEmail, phone: displayPhone, goal }));
  }

  return (
    <>
      <div className="section-head" style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "clamp(26px, 4vw, 42px)", lineHeight: 1.05 }}>Create your account</h2>
          <p style={{ maxWidth: 560, margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.55 }}>Entrada simple: email, teléfono o login social. En la app real esto se conecta con Supabase Auth.</p>
        </div>
      </div>

      <div className="question-layout" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 330px", gap: 18, alignItems: "start" }}>
        <article className="panel question-main" style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)" }}>
          <h2 style={{ margin: "0 0 8px" }}>Join Zafiro</h2>
          <p className="answer" style={{ margin: "0 0 18px", color: "var(--muted)", lineHeight: 1.55, fontSize: 14 }}>Crea una identidad de conocimiento: preguntas, respuestas, comunidades, reputación y plan.</p>
          <div className="form-grid" style={{ display: "grid", gap: 12 }}>
            <input className="field" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 18, outline: 0, color: "var(--text)", background: "var(--surface-strong)", padding: "14px 15px", font: "inherit" }} />
            <input className="field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 18, outline: 0, color: "var(--text)", background: "var(--surface-strong)", padding: "14px 15px", font: "inherit" }} />
            <input className="field" placeholder="Teléfono opcional" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 18, outline: 0, color: "var(--text)", background: "var(--surface-strong)", padding: "14px 15px", font: "inherit" }} />
            <select value={goal} onChange={(e) => setGoal(e.target.value)} style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 18, outline: 0, color: "var(--text)", background: "var(--surface-strong)", padding: "14px 15px", font: "inherit" }}>
              <option>Quiero aprender</option>
              <option>Quiero crear comunidad</option>
              <option>Quiero responder como experto</option>
              <option>Quiero patrocinar una categoría</option>
            </select>
            <button className="primary-action" onClick={createAccount} style={{ minHeight: 50, border: 0, borderRadius: 18, color: "#fff", background: "linear-gradient(135deg, #2563ff, #7c3aed)", fontWeight: 800, cursor: "pointer", boxShadow: "0 16px 40px rgba(37,99,255,0.26)", font: "inherit" }}>Crear cuenta demo</button>
            {[
              { label: "Continue with Google", icon: "G" },
              { label: "Continue with GitHub", icon: "GH" },
              { label: "Continue with Apple", icon: "" },
            ].map((provider) => (
              <button key={provider.label} className="suggestion" type="button" style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 16, color: "var(--text)", background: "var(--surface-strong)", cursor: "pointer", font: "inherit", fontSize: 14 }}>
                <span>{provider.label}</span>
                <span>{provider.icon}</span>
              </button>
            ))}
          </div>
        </article>
        <aside className="panel side-panel" style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)", display: "grid", gap: 16 }}>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Auth real</span><strong style={{ color: "var(--text)" }}>Supabase</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Pagos</span><strong style={{ color: "var(--text)" }}>Stripe</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Perfil</span><strong style={{ color: "var(--text)" }}>Automático</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Plan inicial</span><strong style={{ color: "var(--text)" }}>Free</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>IA</span><strong style={{ color: "var(--text)" }}>ELIANA</strong></div>
        </aside>
      </div>

      <div className="summary" style={{ padding: 18, border: "1px solid rgba(37,99,255,0.2)", borderRadius: 22, background: "rgba(37,99,255,0.08)" }}>
        <strong style={{ display: "block", marginBottom: 8 }}>{status}</strong>
        <p className="answer" style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55, fontSize: 14 }}>{result}</p>
      </div>
    </>
  );
}
