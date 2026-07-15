'use client'

import Link from "next/link"
import { ArrowLeft, Gem, Shield, FileText, AlertCircle } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"

export default function TermsPage() {
  usePageTitle("Términos y Condiciones — ZAFIRO")

  const sections = [
    {
      title: "1. Aceptación de los Términos",
      content: "Al acceder y utilizar ZAFIRO (en adelante, 'la Plataforma'), aceptas estar sujeto a estos Términos y Condiciones, incluyendo los términos específicos de Planes y Suscripciones detallados más adelante. Si no estás de acuerdo con alguna parte, no debes usar la Plataforma. MSM MY STORE LLC se reserva el derecho de modificar estos términos en cualquier momento, notificando a los usuarios mediante la publicación de la versión actualizada en la Plataforma.",
    },
    {
      title: "2. Definiciones",
      content: "'ZAFIRO': Sistema Operativo de Microrredes Inteligentes del ecosistema MSM. 'Usuario / Titular de cuenta': persona o negocio registrado en ZAFIRO. 'Plan': nivel de servicio contratado (Básico, Pro, Empresarial u otros que MSM MY STORE LLC defina). 'Ciclo de facturación': período mensual, trimestral o anual por el cual se cobra el plan. 'Renovación': continuación automática del plan al finalizar el ciclo vigente. 'Upgrade': cambio a un plan superior. 'Downgrade / Cancelación': reducción o terminación de la suscripción. 'ELIANA': inteligencia artificial que automatiza procesos de la plataforma. 'PTS': Puntos de Conocimiento, unidad de valor del sistema MSM Rewards. 'Creador': usuario que mantiene un perfil público con plataformas conectadas.",
    },
    {
      title: "3. Uso de la Plataforma",
      content: "ZAFIRO permite: (a) realizar preguntas y publicar respuestas; (b) conectar plataformas externas (redes sociales, canales, sitios web, aplicaciones) a un perfil unificado; (c) participar en Círculos y comunidades; (d) ganar PTS y acceder a membresías premium; (e) utilizar ELIANA para análisis de contenido y automatización de operaciones; (f) gestionar inventario, ventas, caja y economía del ecosistema MSM. El usuario se compromete a no utilizar la Plataforma para actividades ilícitas, difundir desinformación, acosar a otros usuarios o violar derechos de propiedad intelectual.",
    },
    {
      title: "4. Conexión de Plataformas Externas",
      content: "ZAFIRO permite conectar enlaces públicos a plataformas externas (YouTube, Instagram, TikTok, Facebook, X, Telegram, WhatsApp, GitHub, blogs, sitios web, tiendas, etc.). Al conectar una plataforma, el creador autoriza explícitamente la visualización de vista previa de su contenido en ZAFIRO. ZAFIRO NO almacena el contenido original de dichas plataformas. Solo guarda metadatos (título, descripción, URL) y resúmenes generados por ELIANA. Las vistas previas se generan utilizando las capacidades permitidas por cada plataforma y sus APIs oficiales. Cada plataforma origen conserva sus propias políticas de derechos de autor y es responsable de gestionar cualquier infracción. El creador es responsable del contenido que publica en sus propias plataformas.",
    },
    {
      title: "5. Propiedad Intelectual",
      content: "El contenido generado por los usuarios (preguntas, respuestas, comentarios) es propiedad de sus autores, quienes otorgan a ZAFIRO una licencia no exclusiva para mostrar, organizar y promover dicho contenido dentro de la Plataforma. Los metadatos y resúmenes generados por ELIANA son propiedad de MSM MY STORE LLC. El contenido original alojado en plataformas externas permanece bajo los términos de dichas plataformas.",
    },
    {
      title: "6. Automatización e Inteligencia Artificial",
      content: "ZAFIRO utiliza inteligencia artificial (ELIANA) para automatizar múltiples procesos: registro y verificación de usuarios, gestión de membresías, procesamiento de pagos a través de Stripe, renovaciones, cancelaciones, sistema de referidos, acreditación de PTS, moderación inicial de contenido, detección de spam y fraude, notificaciones, recomendaciones personalizadas y soporte básico. Los usuarios aceptan que ciertas decisiones de la plataforma pueden ser tomadas automáticamente por ELIANA. Las decisiones que requieren juicio humano complejo (disputas, apelaciones, bloqueos de cuenta, asuntos legales) serán escaladas a revisión humana. MSM MY STORE LLC se reserva el derecho de mejorar y actualizar sus sistemas de automatización sin previo aviso.",
    },
    {
      title: "7. Sistema MSM Rewards y PTS",
      content: "Los PTS (Puntos de Conocimiento) se otorgan por contribuciones valiosas. No tienen valor monetario real ni son transferibles fuera de la Plataforma. MSM MY STORE LLC se reserva el derecho de ajustar las tasas de PTS, los niveles y los beneficios asociados. Los PTS obtenidos mediante fraude o violación de estos términos serán revocados.",
    },
    {
      title: "8. Planes y Suscripciones",
      content: "Los planes de suscripción (Básico, Pro, Empresarial y otros que MSM MY STORE LLC defina) ofrecen funcionalidades adicionales según el nivel contratado. El detalle de cada plan, sus beneficios y precios están disponibles en la sección Membresías de la Plataforma. El usuario selecciona libremente el plan que desea contratar y el ciclo de facturación (mensual, trimestral o anual). Los pagos se procesan a través de Stripe u otros procesadores que MSM MY STORE LLC designe.",
    },
    {
      title: "9. Renovación",
      content: "Salvo que el usuario cancele antes de la fecha de corte del ciclo vigente, el plan se renueva automáticamente por un período igual al contratado originalmente. MSM MY STORE LLC notificará al usuario, con al menos 7 días de anticipación, la fecha de renovación y el monto a cobrar, a través de correo electrónico o notificación en la app. Si el método de pago falla en la renovación, el usuario dispondrá de un período de gracia de 7 días para regularizar el pago antes de que el servicio se suspenda o degrade a un plan básico. Los precios de renovación pueden variar respecto al ciclo anterior si MSM MY STORE LLC actualiza su tabla de precios, siempre con notificación previa.",
    },
    {
      title: "10. Aumento de Plan (Upgrade)",
      content: "El usuario puede solicitar un aumento de plan en cualquier momento desde su panel de cuenta o mediante ELIANA. El cambio a un plan superior se activa de forma inmediata una vez confirmado el pago correspondiente. El cobro por el aumento de plan se calculará de forma prorrateada: se cobra la diferencia entre el plan actual y el nuevo plan por los días restantes del ciclo de facturación vigente. Las funcionalidades adicionales del nuevo plan quedan disponibles desde el momento de la confirmación del pago. Todo aumento de plan queda registrado en el módulo de auditoría para trazabilidad.",
    },
    {
      title: "11. Baja de Plan (Downgrade) y Cancelación",
      content: "El usuario puede solicitar una baja de plan o cancelación total en cualquier momento desde su panel de cuenta. Una baja de plan o cancelación no genera reembolso por el tiempo restante del ciclo ya pagado, salvo que la ley aplicable exija lo contrario o MSM MY STORE LLC decida ofrecerlo como cortesía. El cambio a un plan inferior o la cancelación se hace efectivo al finalizar el ciclo de facturación vigente, salvo que el usuario solicite que sea inmediato (perdiendo acceso inmediato a las funcionalidades del plan superior). Al cancelar, los datos del usuario (inventario, historial de ventas, conversaciones con ELIANA, configuración) se conservan durante 90 días antes de eliminarse definitivamente, para permitir reactivación de cuenta. La cancelación no exime al usuario de pagos pendientes generados antes de la fecha efectiva de baja.",
    },
    {
      title: "12. Cambios por Voz o Mediante ELIANA",
      content: "Los comandos de voz o texto dirigidos a ELIANA para renovar, aumentar o dar de baja un plan se consideran solicitudes válidas del usuario solo si provienen de una cuenta autenticada con permisos suficientes (rol OWNER para cambios de plan, salvo que se autorice explícitamente a otro rol). Toda acción de este tipo requiere confirmación explícita del usuario antes de ejecutarse. ELIANA no ejecuta cambios de plan, pagos o cancelaciones de forma automática sin esa confirmación.",
    },
    {
      title: "13. Sistema de Referidos",
      content: "Los usuarios pueden compartir enlaces de referido únicos. Las bonificaciones por referido se acreditan en PTS cuando el nuevo usuario completa su registro. Los términos del programa de referidos pueden ser modificados en cualquier momento.",
    },
    {
      title: "14. Sponsors y Publicidad",
      content: "Los Sponsors son marcas o creadores que patrocinan contenido dentro de ZAFIRO. Las relaciones comerciales entre Sponsors y MSM MY STORE LLC se rigen por acuerdos separados. MSM MY STORE LLC se reserva el derecho de rechazar o eliminar cualquier contenido patrocinado que considere inapropiado.",
    },
    {
      title: "15. Privacidad y Datos",
      content: "El tratamiento de datos personales se rige por nuestra Política de Privacidad. ZAFIRO implementa medidas de seguridad técnicas y organizativas para proteger la información de los usuarios. No compartimos datos personales con terceros sin consentimiento explícito, excepto cuando sea requerido por ley. Ciertas funciones reguladas (ej. procesamiento de pagos, wallets, remesas) pueden requerir un período de retención de datos mayor por obligaciones legales o contractuales con terceros proveedores.",
    },
    {
      title: "16. Moderación y Conducta",
      content: "ZAFIRO combina moderación por IA (ELIANA) y revisión humana. Los usuarios deben seguir las Reglas de la Comunidad. Las infracciones pueden resultar en: advertencia, suspensión temporal, pérdida de PTS, o eliminación permanente de la cuenta. MSM MY STORE LLC se reserva el derecho de eliminar contenido que viole estos términos sin previo aviso.",
    },
    {
      title: "17. Limitación de Responsabilidad",
      content: "ZAFIRO se proporciona 'tal cual', sin garantías de disponibilidad continua, precisión del contenido o idoneidad para un propósito particular. MSM MY STORE LLC no es responsable por daños directos o indirectos derivados del uso de la Plataforma, incluyendo pero no limitado a: pérdida de datos, interrupción del servicio, o acciones de otros usuarios.",
    },
    {
      title: "18. Modificaciones a Estos Términos",
      content: "MSM MY STORE LLC puede actualizar estos términos en cualquier momento. Los cambios se notificarán con al menos 15 días de anticipación antes de entrar en vigor. El uso continuado del servicio después de la fecha de entrada en vigor de los cambios constituye aceptación de los nuevos términos.",
    },
    {
      title: "19. Ley Aplicable",
      content: "Estos términos se rigen por las leyes del Estado de Florida, Estados Unidos, y leyes federales de EE.UU. aplicables. Cualquier disputa será resuelta en los tribunales de Port Saint Lucie, Florida, EE.UU.",
    },
    {
      title: "20. Contacto",
      content: "Para consultas sobre estos términos, renovaciones, cambios de plan o cancelaciones, contáctanos en: soporte@msmmystore.com o a través del formulario de contacto en /contact. MSM MY STORE LLC — Port Saint Lucie, Florida, EE.UU.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Términos y Condiciones</h1>
            <p className="text-sm text-slate-400">Última actualización: Julio 2026</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 glass-strong p-6 glow-border mb-6">
          <p className="text-xs text-slate-400 leading-relaxed">
            Estos términos rigen el uso de ZAFIRO, la primera Red Social del Conocimiento impulsada por Inteligencia Artificial. 
            Al utilizar la plataforma, aceptas estos términos en su totalidad. Te recomendamos leerlos detenidamente.
          </p>
        </div>

        <div className="space-y-3">
          {sections.map((s, i) => (
            <div key={i} className="p-5 rounded-2xl glass">
              <h2 className="text-sm font-bold text-white mb-2">{s.title}</h2>
              <p className="text-[11px] text-slate-400 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-[10px] text-slate-500">
          <p>Parte del <Link href="/ecosystem" className="text-[#00D9FF] hover:underline">Ecosistema MSM</Link></p>
        </div>
      </div>
    </div>
  )
}
