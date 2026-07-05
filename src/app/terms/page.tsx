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
            <p>El manejo de tus datos personales se rige por nuestra <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">Política de Privacidad</Link>. En resumen:</p>
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
            <h2 className="text-xl font-semibold text-white mb-3">9. Limitación de Responsabilidad</h2>
            <p className="text-amber-400/80 text-xs mb-3">⚠️ No podemos garantizar seguridad absoluta de los datos transmitidos por internet.</p>
            <p>9.1. LA PLATAFORMA SE PROPORCIONA "TAL CUAL" Y "SEGÚN DISPONIBILIDAD", SIN GARANTÍAS DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS.</p>
            <p className="mt-2">9.2. EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY APLICABLE, MSM MY STORE LLC NO SERÁ RESPONSABLE POR DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES O CONSECUENTES DERIVADOS DEL USO DE LA PLATAFORMA.</p>
            <p className="mt-2">9.3. La Compañía no es responsable del contenido publicado por terceros usuarios ni de las respuestas generadas por IA, conforme a las protecciones aplicables bajo la Sección 230 de la Communications Decency Act de Estados Unidos, en la medida en que la ley lo permita.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Indemnización</h2>
            <p>El usuario acepta indemnizar y mantener indemne a MSM MY STORE LLC, sus directivos y empleados, frente a cualquier reclamo derivado del uso indebido de la Plataforma o violación de estos Términos.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Suspensión y Terminación</h2>
            <p>La Compañía puede suspender o terminar cuentas que violen estos Términos, incluyendo pero no limitado a: cuentas falsas, manipulación del sistema de reputación, contenido ilegal, o abuso del sistema de IA.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Modificaciones</h2>
            <p>La Compañía puede modificar estos Términos en cualquier momento. Los cambios materiales serán notificados a los usuarios mediante la Plataforma o correo electrónico registrado.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Ley Aplicable y Jurisdicción</h2>
            <p>13.1. Estos Términos y Condiciones se rigen e interpretan de acuerdo con las leyes del Estado de Florida, Estados Unidos, sin dar efecto a sus disposiciones sobre conflicto de leyes.</p>
            <p className="mt-2">13.2. Jurisdicción exclusiva: Cualquier disputa, reclamo, controversia o demanda que surja de o esté relacionada con estos Términos, el uso de la Plataforma, o los servicios ofrecidos por MSM MY STORE LLC, deberá presentarse exclusivamente ante los tribunales estatales o federales ubicados en el Condado de Osceola, Florida (Kissimmee), Estados Unidos. El usuario acepta expresamente someterse a la jurisdicción personal de dichos tribunales y renuncia a cualquier objeción basada en jurisdicción inconveniente (forum non conveniens).</p>
            <p className="mt-2">13.3. Renuncia a acción colectiva: En la máxima medida permitida por la ley, el usuario acepta que cualquier reclamo se resolverá de forma individual, y renuncia a su derecho a participar en una demanda colectiva (class action) contra la Compañía.</p>
            <p className="mt-2">13.4. Arbitraje (opcional, recomendado): La Compañía podrá requerir que las disputas se resuelvan mediante arbitraje vinculante individual antes de recurrir a los tribunales, conforme a las reglas de la American Arbitration Association (AAA), como paso adicional para reducir litigios costosos.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">14. Contacto</h2>
            <p>MSM MY STORE LLC</p>
            <p>Condado de Osceola, Florida (Kissimmee), Estados Unidos</p>
            <p className="mt-2 text-white/40">MSM Zafiro — Inteligencia Artificial Internacional</p>
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
