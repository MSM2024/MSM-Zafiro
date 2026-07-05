import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-white/40 hover:text-white/70 transition-colors text-sm mb-8 inline-block">
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Política de Privacidad</h1>
        <p className="text-white/40 text-sm mb-8">Última actualización: Julio 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Información que Recopilamos</h2>
            <p>Recopilamos la siguiente información cuando utilizas la Plataforma:</p>
            <ul className="space-y-1 pl-4 mt-2">
              <li><strong>Información de registro:</strong> Nombre, número de teléfono (obligatorio), email (opcional), foto de perfil.</li>
              <li><strong>Contenido generado:</strong> Preguntas, respuestas, comentarios, imágenes y cualquier material que publiques.</li>
              <li><strong>Datos de uso:</strong> Interacciones con la plataforma, páginas visitadas, preferencias, y patrones de navegación.</li>
              <li><strong>Ubicación aproximada:</strong> Basada en IP, para personalización de contenido y prevención de fraude.</li>
              <li><strong>Información de redes sociales:</strong> Si usas Google, Facebook o Apple para registrarte, accedemos a tu nombre, email y foto de perfil según los permisos de cada proveedor.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Uso de la Información</h2>
            <p>Utilizamos tus datos para:</p>
            <ul className="space-y-1 pl-4 mt-2">
              <li>Operar, mantener y mejorar la Plataforma</li>
              <li>Verificar tu identidad mediante tu número de teléfono</li>
              <li>Personalizar tu experiencia y recomendar contenido relevante</li>
              <li>Enviar notificaciones importantes (seguridad, cambios en términos, recuperación de cuenta)</li>
              <li>Prevenir fraudes, cuentas falsas y actividades prohibidas</li>
              <li>Entrenar y mejorar los modelos de IA (ELIANA) con datos anonimizados y agregados</li>
              <li>Cumplir con obligaciones legales aplicables</li>
            </ul>
            <p className="mt-2">No utilizamos tus datos para publicidad dirigida ni perfiles comerciales sin tu consentimiento explícito.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Compartición de Datos</h2>
            <p>No vendemos tus datos personales a terceros. Podemos compartir información limitada con:</p>
            <ul className="space-y-1 pl-4 mt-2">
              <li><strong>Proveedores de servicio esenciales:</strong> Supabase (base de datos y autenticación), Vercel (alojamiento), OpenAI (procesamiento de IA), Stripe (procesamiento de pagos). Todos bajo estrictos acuerdos de confidencialidad.</li>
              <li><strong>Autoridades legales:</strong> Cuando sea requerido por ley, orden judicial o proceso legal aplicable.</li>
              <li><strong>Otros usuarios:</strong> Tu perfil, contenido publicado y estadísticas de reputación son visibles para otros usuarios de la Plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Seguridad de los Datos</h2>
            <p>Implementamos medidas técnicas y organizativas para proteger tus datos, incluyendo cifrado en tránsito (TLS 1.3), cifrado en reposo, autenticación segura y monitoreo continuo. Sin embargo, ninguna transmisión por internet es completamente segura y no podemos garantizar seguridad absoluta.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Retención de Datos</h2>
            <p>Conservamos tus datos personales mientras tu cuenta esté activa. Al eliminar tu cuenta, los datos personales se borran en un plazo máximo de 30 días. Podemos retener cierta información por obligaciones legales o para prevenir fraudes, incluso después de la eliminación de la cuenta.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Derechos del Usuario</h2>
            <p>Dependiendo de tu jurisdicción, puedes tener los siguientes derechos sobre tus datos:</p>
            <ul className="space-y-1 pl-4 mt-2">
              <li><strong>Acceso:</strong> Solicitar una copia de los datos personales que tenemos sobre ti.</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos.</li>
              <li><strong>Eliminación:</strong> Solicitar la eliminación de tus datos personales (derecho al olvido).</li>
              <li><strong>Portabilidad:</strong> Recibir tus datos en un formato estructurado y de uso común.</li>
              <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos para ciertos fines.</li>
            </ul>
            <p className="mt-2">Para ejercer tus derechos, contáctanos en: <a href="mailto:privacidad@msmzafiro.com" className="text-indigo-400 hover:text-indigo-300">privacidad@msmzafiro.com</a>. Responderemos en un plazo máximo de 30 días.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Menores de Edad</h2>
            <p>La Plataforma no está dirigida a menores de 13 años. No recopilamos intencionalmente datos personales de menores sin consentimiento parental verificable. Si tenemos conocimiento de que hemos recopilado datos de un menor de 13 años sin el consentimiento parental requerido, eliminaremos dicha información.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Transferencias Internacionales de Datos</h2>
            <p>8.1. Sus datos pueden procesarse en servidores ubicados en Estados Unidos u otras jurisdicciones donde operen nuestros proveedores de servicios (Supabase, Vercel, OpenAI).</p>
            <p className="mt-2">8.2. Para usuarios en la Unión Europea, dichas transferencias se realizan conforme a mecanismos legales aplicables (Cláusulas Contractuales Estándar u otros marcos reconocidos).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Cookies y Tecnologías Similares</h2>
            <p>9.1. Utilizamos cookies esenciales para el funcionamiento de la Plataforma (sesión, autenticación) y cookies de análisis para entender el uso del servicio.</p>
            <p className="mt-2">9.2. Usted puede gestionar las preferencias de cookies desde la configuración de su navegador.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Cambios a esta Política</h2>
            <p>Podemos actualizar esta Política periódicamente. Los cambios materiales serán notificados mediante la Plataforma o al correo electrónico registrado.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Contacto</h2>
            <p>Para ejercer sus derechos o consultas sobre privacidad:</p>
            <p className="mt-2">MSM MY STORE LLC</p>
            <p>Condado de Osceola, Florida (Kissimmee), Estados Unidos</p>
            <p><a href="mailto:privacidad@msmzafiro.com" className="text-indigo-400 hover:text-indigo-300">privacidad@msmzafiro.com</a></p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Ley Aplicable</h2>
            <p>Esta Política se rige por las leyes del Estado de Florida, Estados Unidos, en coordinación con las protecciones de privacidad aplicables según la jurisdicción del usuario (GDPR, CCPA, u otras).</p>
          </section>

          <div className="pt-8 border-t border-white/10 text-sm text-white/40">
            <p>MSM MY STORE LLC &copy; 2026. Todos los derechos reservados.</p>
            <p className="mt-2">&ldquo;Cada pregunta construye el futuro.&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  )
}
