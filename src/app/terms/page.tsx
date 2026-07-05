import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-white/40 hover:text-white/70 transition-colors text-sm mb-8 inline-block">
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Términos y Condiciones</h1>
        <p className="text-white/40 text-sm mb-8">Última actualización: Julio 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Aceptación de los Términos</h2>
            <p>Al acceder, registrarte o utilizar MSM Zafiro (&ldquo;la Plataforma&rdquo;), aceptas cumplir con estos Términos y Condiciones, nuestra Política de Privacidad y cualquier otra política publicada en la Plataforma. Si no estás de acuerdo con alguno de estos términos, no debes usar la Plataforma.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Definiciones</h2>
            <ul className="space-y-2 pl-4">
              <li><strong>Usuario:</strong> Toda persona que acceda o se registre en la Plataforma.</li>
              <li><strong>ELIANA:</strong> Asistente de inteligencia artificial de MSM Zafiro que genera respuestas, resúmenes y traducciones.</li>
              <li><strong>Contenido:</strong> Preguntas, respuestas, comentarios, imágenes y cualquier material publicado en la Plataforma.</li>
              <li><strong>Número de teléfono verificado:</strong> Número confirmado vía código SMS o WhatsApp durante el registro.</li>
              <li><strong>Red social:</strong> Google, Facebook, Apple o cualquier otro proveedor de identidad soportado.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Registro y Cuenta</h2>
            <p>Para usar la Plataforma es obligatorio registrarse proporcionando:</p>
            <ul className="space-y-1 pl-4 mt-2">
              <li><strong>Número de teléfono:</strong> Obligatorio. Será verificado mediante código enviado por SMS o WhatsApp. Cada número solo puede tener una cuenta activa.</li>
              <li><strong>Contraseña:</strong> Debe tener al menos 6 caracteres. Eres responsable de mantenerla segura.</li>
              <li><strong>Email:</strong> Opcional pero recomendado para recuperación de cuenta.</li>
            </ul>
            <p className="mt-2">Está prohibido crear múltiples cuentas, cuentas falsas o suplantar la identidad de otra persona. El número de teléfono es único e intransferible.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Verificación Telefónica</h2>
            <p>Al registrarte, aceptas recibir un código de verificación vía SMS o WhatsApp al número proporcionado. Este código confirma que eres el titular del número. La verificación telefónica tiene los siguientes propósitos:</p>
            <ul className="space-y-1 pl-4 mt-2">
              <li>Prevenir la creación de cuentas falsas o duplicadas</li>
              <li>Permitir la recuperación de cuenta en caso de pérdida de acceso</li>
              <li>Garantizar que cada usuario es una persona real</li>
              <li>Detectar y bloquear actividades fraudulentas</li>
            </ul>
            <p className="mt-2">Si cambias de número telefónico, puedes crear una nueva cuenta con tu nuevo número. La cuenta anterior quedará inactiva.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Autenticación por Redes Sociales</h2>
            <p>Alternativamente, puedes registrarte utilizando tu cuenta de Google, Facebook o Apple. Al hacerlo, autorizas a la Plataforma a acceder a tu información básica de perfil (nombre, email, foto) de acuerdo con la política de privacidad de cada proveedor. No almacenamos contraseñas de redes sociales.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Recuperación de Cuenta</h2>
            <p>Si pierdes acceso a tu cuenta (olvido de contraseña, cambio de dispositivo, etc.), puedes recuperarla mediante:</p>
            <ul className="space-y-1 pl-4 mt-2">
              <li><strong>Verificación telefónica:</strong> Ingresa tu número y recibirás un código por WhatsApp para restablecer tu contraseña.</li>
              <li><strong>Email:</strong> Si registraste un email, recibirás un enlace de recuperación.</li>
              <li><strong>Red social:</strong> Si usaste Google/Facebook/Apple, puedes iniciar sesión nuevamente con ese proveedor.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Privacidad y Protección de Datos</h2>
            <p>El manejo de tus datos personales se rige por nuestra <Link href="/terms#privacidad" className="text-indigo-400 hover:text-indigo-300">Política de Privacidad</Link>. En resumen:</p>
            <ul className="space-y-1 pl-4 mt-2">
              <li><strong>Datos recopilados:</strong> Nombre, número de teléfono, email, foto de perfil, contenido publicado, interacciones, datos de uso y ubicación aproximada.</li>
              <li><strong>Uso de datos:</strong> Operación de la plataforma, mejora de servicios, personalización de contenido, seguridad y prevención de fraude.</li>
              <li><strong>Compartición:</strong> No vendemos tus datos personales. Podemos compartirlos con proveedores de servicio esenciales (Stripe para pagos, Supabase para base de datos, OpenAI para IA) bajo estrictos acuerdos de confidencialidad.</li>
              <li><strong>WhatsApp:</strong> Los números de teléfono se utilizan exclusivamente para verificación y recuperación de cuenta. No compartimos números con terceros sin tu consentimiento.</li>
              <li><strong>Retención:</strong> Conservamos tus datos mientras tu cuenta esté activa. Al eliminarla, los datos personales se borran en un plazo máximo de 30 días.</li>
              <li><strong>Derechos:</strong> Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos escribiendo a <a href="mailto:privacidad@msmzafiro.com" className="text-indigo-400 hover:text-indigo-300">privacidad@msmzafiro.com</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Uso del Número de Teléfono y WhatsApp</h2>
            <ul className="space-y-1 pl-4">
              <li>El número de teléfono es tu identificador principal en la plataforma.</li>
              <li>Se utiliza para verificar tu identidad, recuperar tu cuenta y prevenir fraudes.</li>
              <li>Solo enviamos mensajes de WhatsApp para: (a) verificación de registro, (b) recuperación de cuenta, (c) notificaciones de seguridad importantes.</li>
              <li>No enviamos mensajes publicitarios ni spam por WhatsApp.</li>
              <li>Puedes solicitar la desvinculación de tu número en cualquier momento, lo que implicará la eliminación de tu cuenta.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Licencia de Uso</h2>
            <p>MSM Zafiro te otorga una licencia limitada, no exclusiva, no transferible y revocable para acceder y usar la Plataforma de acuerdo con estos términos. No está permitido:</p>
            <ul className="space-y-1 pl-4 mt-2">
              <li>Reproducir, distribuir o modificar la Plataforma sin autorización</li>
              <li>Usar la Plataforma para actividades ilegales o fraudulentas</li>
              <li>Realizar ingeniería inversa, extraer datos masivamente (scraping) o interferir con el funcionamiento de la Plataforma</li>
              <li>Crear cuentas automatizadas o bots sin autorización expresa</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contenido Generado por Usuarios</h2>
            <p>Los usuarios retienen la propiedad intelectual de su contenido. Al publicar en la Plataforma, otorgas a MSM Zafiro una licencia mundial, gratuita y no exclusiva para mostrar, distribuir y reproducir tu contenido dentro de la Plataforma con el fin de operar y mejorar el servicio. Puedes eliminar tu contenido en cualquier momento, y dejaremos de mostrarlo públicamente en un plazo razonable.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. IA y Contenido Generado por ELIANA</h2>
            <p>Las respuestas generadas por ELIANA (inteligencia artificial) son asistidas por modelos de lenguaje y no constituyen asesoramiento profesional, médico, legal ni financiero. Características importantes:</p>
            <ul className="space-y-1 pl-4 mt-2">
              <li>ELIANA puede cometer errores. Verifica siempre la información con fuentes especializadas.</li>
              <li>No almacenamos conversaciones de IA para entrenar modelos externos sin tu consentimiento.</li>
              <li>Las conversaciones con ELIANA pueden ser revisadas para mejorar la calidad del servicio.</li>
              <li>ELIANA no reemplaza el juicio humano ni la validación de expertos en la plataforma.</li>
              <li>El uso de la IA se rige por límites de créditos según tu plan (Free, Plus o Pro).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Monetización y Planes</h2>
            <p>La Plataforma ofrece planes Free (gratuito), Plus y Pro (suscripción). Los pagos se procesan a través de Stripe. Las suscripciones se renuevan automáticamente a menos que se cancelen 24 horas antes del próximo período de facturación. No ofrecemos reembolsos por períodos parciales. Los precios están en USD y pueden incluir impuestos aplicables.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Sistema de Seguidores y Reputación</h2>
            <p>Los usuarios pueden seguir a otros usuarios. El sistema de seguidores es público y visible en los perfiles. El Zafiro Score es un indicador de reputación basado en la calidad de las contribuciones. El score no tiene valor monetario y puede fluctuar según la actividad del usuario.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">14. Conducta del Usuario</h2>
            <p>Los usuarios se comprometen a:</p>
            <ul className="space-y-1 pl-4 mt-2">
              <li>Publicar contenido respetuoso y constructivo</li>
              <li>No acosar, discriminar o amenazar a otros usuarios</li>
              <li>No publicar información falsa, engañosa o difamatoria</li>
              <li>No compartir contenido ilegal, violento, sexualmente explícito o que infrinja derechos de autor</li>
              <li>No realizar spam, phishing o actividades fraudulentas</li>
              <li>No manipular votos, puntuaciones o el sistema de reputación</li>
            </ul>
            <p className="mt-2">El incumplimiento puede resultar en suspensión temporal o eliminación permanente de la cuenta sin previo aviso.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">15. Limitación de Responsabilidad</h2>
            <p>MSM Zafiro no se hace responsable por:</p>
            <ul className="space-y-1 pl-4 mt-2">
              <li>Daños indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de usar la Plataforma</li>
              <li>Pérdida de datos, ingresos o oportunidades de negocio</li>
              <li>El contenido generado por usuarios o por la IA</li>
              <li>Interrupciones del servicio por mantenimiento, problemas técnicos o casos de fuerza mayor</li>
              <li>Actuaciones de terceros (proveedores de servicio, otros usuarios, etc.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">16. Modificaciones</h2>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados con al menos 15 días de anticipación mediante:</p>
            <ul className="space-y-1 pl-4 mt-2">
              <li>Publicación en la Plataforma</li>
              <li>Notificación push o por WhatsApp (si está habilitado)</li>
              <li>Correo electrónico (si lo proporcionaste)</li>
            </ul>
            <p className="mt-2">Si no estás de acuerdo con los cambios, puedes cancelar tu cuenta antes de que entren en vigor.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">17. Terminación</h2>
            <p>Puedes eliminar tu cuenta en cualquier momento desde la configuración de perfil. MSM Zafiro puede suspender o eliminar tu cuenta si violas estos términos. Al terminar la relación, perderás acceso a tu contenido y datos personales, los cuales serán eliminados en un plazo máximo de 30 días, salvo obligación legal de retenerlos.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">18. Ley Aplicable y Jurisdicción</h2>
            <p>Estos términos se rigen por las leyes de México. Cualquier disputa será resuelta en los tribunales competentes de la Ciudad de México, renunciando a cualquier otro fuero que pudiera corresponder.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">19. Contacto</h2>
            <p>MSM Zafiro opera con inteligencia artificial internacional. No hay correos humanos, no hay oficinas, no hay burocracia. Todo el sistema es gestionado por IA. Disfruta la plataforma.</p>
          </section>

          <div className="pt-8 border-t border-white/10 text-sm text-white/40">
            <p>MSM Zafiro — Inteligencia Artificial Internacional</p>
            <p className="mt-2">&ldquo;Cada pregunta construye el futuro.&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  )
}
