import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="text-white/40 hover:text-white/70 transition-colors text-sm mb-8 inline-block"
        >
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">
          Términos y Condiciones
        </h1>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. Aceptación de los Términos
            </h2>
            <p>
              Al acceder y utilizar MSM Zafiro, aceptas cumplir con estos
              términos. Si no estás de acuerdo, no debes usar la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. Licencia de Uso
            </h2>
            <p>
              MSM Zafiro otorga una licencia limitada, no exclusiva e
              intransferible para acceder y usar la plataforma según estos
              términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. Monetización y Planes
            </h2>
            <p>
              La plataforma ofrece planes Free, Plus y Pro. Los pagos se
              procesan a través de Stripe. Las suscripciones se renuevan
              automáticamente a menos que se cancelen antes del período de
              facturación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. Contenido Generado por Usuarios
            </h2>
            <p>
              Los usuarios retienen la propiedad de su contenido. Al publicar,
              otorgan a MSM Zafiro una licencia para mostrar y distribuir el
              contenido dentro de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. IA y Contenido Generado
            </h2>
            <p>
              Las respuestas generadas por ELIANA (IA) son asistidas por
              inteligencia artificial y no constituyen asesoramiento
              profesional. Verifica siempre la información con fuentes
              especializadas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Limitación de Responsabilidad
            </h2>
            <p>
              MSM Zafiro no se hace responsable por daños indirectos derivados
              del uso de la plataforma, incluyendo pero no limitado a pérdida de
              datos o lucro cesante.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Privacidad
            </h2>
            <p>
              El manejo de datos personales se rige por nuestra Política de
              Privacidad. Al usar la plataforma, aceptas las prácticas descritas
              en dicha política.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              8. Modificaciones
            </h2>
            <p>
              Nos reservamos el derecho de modificar estos términos. Los
              cambios serán notificados con 30 días de anticipación a través de
              la plataforma o correo electrónico.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              9. Contacto
            </h2>
            <p>
              Para preguntas sobre estos términos, escribe a{' '}
              <a
                href="mailto:legal@msmzafiro.com"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                legal@msmzafiro.com
              </a>
              .
            </p>
          </section>

          <div className="pt-8 border-t border-white/10 text-sm text-white/40">
            <p>Última actualización: Julio 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}
