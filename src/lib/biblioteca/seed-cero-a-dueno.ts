'use client'

import type { Book, Chapter } from './types'
import { genId, now } from './helpers'
import { addBook, addChapters, updateBook, recordAuditEvent, getBook } from './storage'
import { syncBookToEliana } from './eliana-bridge'

const AUTHOR = 'Don Miguel Soria Martínez'
const BOOK_TITLE = 'De Cero a Dueño Digital'
const BOOK_DESC = 'Cómo entendí la infraestructura de mi empresa y dejé de depender ciegamente de la tecnología'
const COPYRIGHT = `© ${new Date().getFullYear()} ${AUTHOR}. Todos los derechos reservados.`
const BIO = `Miguel Soria es fundador y empresario con una visión centrada en la soberanía empresarial, la identidad de marca y la construcción de ecosistemas digitales con propósito. Su trabajo nace de una convicción clara: un emprendedor no necesita ser programador para liderar con autoridad el mundo tecnológico en el que vive su empresa, pero sí necesita entender sus estructuras esenciales.

A partir de su experiencia real enfrentando decisiones sobre dominios, hosting, permisos, marketplace, proveedores y control operativo, Miguel desarrolló una mirada práctica sobre lo que significa ser dueño digital. En lugar de abordar la tecnología como un misterio reservado a especialistas, la traduce al lenguaje del empresario que quiere proteger, ordenar y escalar lo que construye.

De Cero a Dueño Digital surge de ese proceso personal: pasar del miedo técnico a la claridad estratégica. Su propuesta combina reflexión, gobierno digital y herramientas prácticas para que otros fundadores, comerciantes y dueños de pequeñas empresas recuperen control sobre los activos que sostienen su negocio en Internet.`

export interface ChapterDef {
  title: string
  content: string
  targetWords: number
}

export const CHAPTERS: ChapterDef[] = [
  {
    title: 'Prólogo',
    targetWords: 1200,
    content: `Escena fundacional: la noche del miedo técnico.

No fue un tutorial. No fue un curso. No fue una conferencia. Fue una pregunta.

Una noche, mientras hablaba con un programador sobre el desarrollo de mi marketplace, sentí algo que no esperaba: miedo. No miedo a fracasar. No miedo a perder dinero. Miedo técnico. Yo tenía mi empresa registrada, tenía mi dominio comprado, pagaba mantenimiento mensual y mi página estaba en línea. Desde afuera, todo parecía estar en orden. Pero por dentro se abrió una grieta.

Me hice una pregunta que, hasta ese momento, nunca me había hecho con seriedad: ¿quién controla realmente la infraestructura donde vive mi empresa?

La pregunta me dejó en silencio. Porque entendí algo que nadie me había explicado con claridad: ser dueño legal no significa ser dueño técnico. Tener la marca no significa controlar el servidor. Pagar un dominio no significa gobernar el sistema donde viven tus datos, tus correos, tus pedidos, tus usuarios y tu reputación.

Este libro nace de esa decisión. No está escrito para ingenieros. Está escrito para dueños, fundadores, comerciantes, creativos y emprendedores que intuyen que algo importante se les está escapando cuando el mundo digital se vuelve demasiado técnico, demasiado opaco o demasiado dependiente de terceros.

Aquí no vas a encontrar un llamado a controlarlo todo manualmente. Vas a encontrar algo mejor: una forma de recuperar gobierno sin caer en paranoia, de entender la infraestructura sin perder tu esencia, y de pasar del miedo técnico a la soberanía empresarial.

Porque una empresa digital madura cuando deja de depender del misterio. Y un dueño se convierte en dueño digital el día que decide entender las llaves de su propia casa.`
  },
  {
    title: 'La noche que todo cambió',
    targetWords: 1800,
    content: `El instante de miedo como detonante intelectual y empresarial.

Todo comenzó una noche cualquiera. O al menos eso creía. Estaba revisando los informes mensuales de mi marketplace cuando recibí un mensaje de mi desarrollador: "Hay que renovar el certificado SSL del servidor, pero necesito acceso a la cuenta del hosting porque el proveedor cambió las políticas."

Esa frase, que parecía inofensiva, encendió una luz roja en mi cabeza. ¿Cómo era posible que mi propio desarrollador no tuviera acceso directo a algo tan fundamental? ¿Y si él se enfermaba? ¿Y si dejaba de trabajar conmigo? ¿Mi negocio se detenía porque alguien más tenía las llaves?

Empecé a preguntar. A revisar correos viejos. A buscar facturas, contratos, accesos. Y lo que encontró fue desconcertante: nadie en mi organización —incluyéndome a mí— podía responder con exactitud quién controlaba cada pieza de nuestra infraestructura digital.

El dominio estaba registrado a nombre de una persona que ya no trabajaba con nosotros. El hosting había sido contratado por un socio que ya no estaba en el negocio. Las cuentas de correo electrónico estaban configuradas con contraseñas que nadie recordaba haber creado. Y los backups —si existían— vivían en un servidor del que nadie tenía la factura.

Esa noche entendí que mi empresa no era realmente mía. Era un conjunto de servicios dispersos, contratados por distintas personas, pagados con distintas tarjetas, administrados con distintas credenciales. Mi empresa digital existía, sí. Pero no estaba gobernada. Estaba simplemente funcionando por inercia.

La diferencia entre funcionar y gobernar es la misma que hay entre vivir de alquiler y ser propietario. Cuando eres inquilino, pagas y esperas que todo funcione. Cuando eres propietario, entiendes la estructura, sabes dónde están las llaves, conoces a los proveedores y tienes un plan para cuando algo falla.

Esa noche, dejé de ser inquilino digital. Empecé el camino para convertirme en propietario.`
  },
  {
    title: 'Creía que era dueño',
    targetWords: 2200,
    content: `Desarma la ilusión de propiedad basada solo en marca, dominio o presencia web.

Durante años creí que tener mi empresa registrada y mi página web funcionando era suficiente para considerarme dueño de mi presencia digital. Pagaba puntualmente el dominio, renovaba el hosting cada año, y mi sitio estaba en línea 24/7. Desde cualquier perspectiva comercial, eso era tener presencia digital.

Pero tarde descubrí que presencia no es propiedad. Tener un dominio registrado no significa controlarlo. Tener una página en línea no significa gobernar el servidor donde vive. Tener una marca registrada no significa tener control sobre la infraestructura que la sostiene.

La ilusión de propiedad digital se construye sobre cuatro malentendidos comunes.

El primero es confundir el pago con el control. Pagar el dominio no te da control automático sobre su configuración técnica. El control real está en la cuenta del registrador, en el correo electrónico asociado, en la verificación de titularidad y en los accesos de administración.

El segundo es confundir la marca con la infraestructura. Tu marca es tu identidad comercial. Tu infraestructura es donde vive operativamente tu negocio en Internet. Son cosas distintas, gobernadas por contratos diferentes, administradas por personas diferentes y protegidas por mecanismos diferentes.

El tercero es confundir el acceso con la propiedad. Que alguien pueda entrar al panel de administración de tu web no significa que ese alguien sea el dueño. El acceso es una llave prestada. La propiedad es la escritura de la casa.

El cuarto es confundir el funcionamiento con el gobierno. Que tu web funcione hoy no significa que esté gobernada para funcionar mañana, ni que puedas recuperarla si algo sale mal, ni que tengas claro qué hacer si tu desarrollador desaparece.

Este capítulo es el primero de muchos que te ayudarán a desmontar estas confusiones.`
  },
  {
    title: 'El sueño de la casa',
    targetWords: 1800,
    content: `Hace tiempo tuve un sueño recurrente. En el sueño, yo estaba frente a una casa. Una casa grande, de dos pisos, con un jardín al frente y una cerca blanca. En el sueño, yo sabía que era mi casa. Pero cuando intentaba abrir la puerta, las llaves no funcionaban. Entraba por la ventana, y cuando lograba estar adentro, no reconocía los muebles. Las habitaciones cambiaban de lugar. Las escaleras llevaban a sitios inesperados. Y había personas viviendo allí que yo no había invitado.

El sueño me angustiaba porque mi casa, siendo mía, no se sentía mía. No la controlaba. No sabía quién más tenía acceso. No podía cambiar la cerradura porque no sabía cuántas copias de la llave existían ni en manos de quién estaban.

Cuando empecé a entender la infraestructura digital de mi empresa, me di cuenta de que el sueño no era un sueño. Era una radiografía exacta de mi negocio en Internet.

El dominio es el nombre de la calle donde está tu casa. Es la dirección que la gente usa para encontrarte. Pero tener la dirección no significa tener la escritura.

El hosting es el terreno donde está construida la casa. Es el espacio físico —o virtual— donde tus archivos, tu base de datos y tu correo electrónico residen. Pero el terreno puede estar alquilado, y el contrato puede estar a nombre de otra persona.

El contenido de tu web son los muebles, las paredes, la decoración. Es lo que la gente ve cuando entra. Pero los muebles pueden ser prestados, alquilados o incluso copiados sin que tú lo sepas.

Las cuentas de administrador son las llaves de cada habitación. Y en mi sueño, como en mi empresa, yo no sabía quién más tenía copias de esas llaves.

La lección del sueño fue dura pero necesaria: no basta con que la casa sea tuya en el papel. Tienes que poder abrir la puerta, conocer cada habitación, saber quién tiene llaves y poder cambiar la cerradura si hace falta.

Eso es lo que significa ser dueño digital.`
  },
  {
    title: 'Qué es realmente una página web',
    targetWords: 2600,
    content: `Cuando le preguntas a un emprendedor qué es una página web, la respuesta suele ser: "Es donde mi negocio vive en Internet." No es una mala respuesta. Pero es incompleta. Una página web no es una sola cosa. Es cinco cosas distintas que trabajan juntas, y cada una de ellas puede estar controlada por una persona, empresa o contrato diferente.

Vamos por partes.

DOMINIO. El dominio es el nombre de tu negocio en Internet: mituenda.com, tublog.net, miempresa.org. Es la dirección que la gente escribe en el navegador para encontrarte. Pero el dominio no es tu página web. Es solo el nombre. El control del dominio depende de tres cosas: quién lo registró, a nombre de quién está registrado y qué correo electrónico se usó para la registración. Si no controlas esas tres cosas, no controlas tu dominio. El DNS —Domain Name System— es la guía telefónica de Internet. Traduce el nombre de tu dominio (mituenda.com) a la dirección numérica (IP) donde realmente está alojada tu página web. Sin DNS, escribir mituenda.com no llevaría a ningún lado. El control del DNS es tan importante como el control del dominio. Quien controla los DNS, controla hacia dónde apunta tu nombre en Internet. La registración de dominios se rige por contratos y bases de datos globales como RDAP (sucesor de WHOIS), que permiten verificar la titularidad legal de un dominio. No es un juego: es infraestructura crítica de Internet.

HOSTING. El hosting es el espacio físico o virtual donde vive tu página web. Es un servidor —una computadora encendida 24/7— que almacena tus archivos y los entrega cuando alguien los solicita. El hosting no es el dominio ni la página web. Es el terreno donde construyes tu casa digital.

CÓDIGO. El código es el conjunto de instrucciones que le dicen al servidor qué mostrar y cómo comportarse. Es la estructura de tu página web: los textos, las imágenes, los formularios, los botones, las reglas de negocio. Sin código, el servidor es solo una máquina vacía.

BASE DE DATOS. La base de datos es donde tu página web guarda la información dinámica: usuarios, pedidos, productos, comentarios, configuraciones. Sin base de datos, tu página web sería estática: mostraría siempre el mismo contenido a todos los visitantes.

CORREO ELECTRÓNICO. El correo profesional (tucorreo@tudominio.com) es un servicio separado del hosting, del dominio y de la página web. Puedes tener tu dominio en un proveedor, tu hosting en otro y tu correo en un tercero.

CADA CAPA ES INDEPENDIENTE. La lección más importante de este capítulo es que cada una de estas capas puede estar contratada con un proveedor diferente, registrada a nombre de una persona diferente y administrada por un técnico diferente. Cuando firmas un contrato con un desarrollador o una agencia, no estás contratando "una página web". Estás contratando la coordinación de todas estas capas. Y si no entiendes cada capa por separado, es muy fácil perder el control de una de ellas sin darte cuenta.

Al final de este capítulo, deberías poder dibujar un diagrama simple con cinco bloques: dominio → DNS → hosting → código → base de datos. Y deberías poder señalar con el dedo dónde está cada uno y quién lo controla.`
  },
  {
    title: 'La máquina no tiene intención',
    targetWords: 2200,
    content: `Una de las experiencias más desconcertantes para un emprendedor no técnico es enfrentarse a un error inesperado en su página web. El sitio se cae. El carrito de compras deja de funcionar. Los correos no llegan. El panel de administración no responde. La primera reacción suele ser emocional: "alguien está haciendo algo malo", "me están saboteando", "esto es un ataque".

La realidad es casi siempre más simple y más estructural: la máquina no tiene intención.

Los sistemas informáticos no actúan por malicia. Actúan por configuración. Cuando algo falla, la causa casi nunca es una intención maliciosa. Es una de estas cinco cosas:

1. Configuración incorrecta. Alguien cambió algo sin saber lo que hacía, o sin documentar el cambio. Un permiso mal ajustado, una contraseña mal escrita, una ruta mal configurada.

2. Permiso mal asignado. Alguien tiene más acceso del que debería, o menos del que necesita. O el sistema fue configurado con permisos demasiado amplios "para que funcionara rápido" y luego nunca se ajustaron.

3. Secreto expuesto. Una clave de API, una contraseña de base de datos o un token de autenticación quedó visible en un repositorio público, en un archivo de configuración o en un log.

4. Dependencia rota. El sitio funciona porque depende de un servicio externo que dejó de funcionar. Un plugin que no se actualizó, un certificado que venció, una API que cambió.

5. Falta de capacidad. El servidor no está preparado para el tráfico que recibió. La base de datos no está optimizada para las consultas que se le están haciendo.

Ninguna de estas causas requiere malicia. Pero todas requieren gobierno. Y todas son prevenibles con una combinación de configuración cuidadosa, monitoreo básico y documentación mínima.

Entender que la máquina no tiene intención es liberador porque te permite pasar del miedo a la acción. En lugar de preguntarte "¿quién me está haciendo esto?", empiezas a preguntarte "¿qué configuré mal, qué no revisé, qué no documenté?".

Ese cambio de pregunta es el primer paso hacia la gobernanza digital.`
  },
  {
    title: 'Cómo funciona realmente un servidor',
    targetWords: 2600,
    content: `Para un emprendedor no técnico, la palabra "servidor" suena a una caja negra ubicada en un lugar remoto, manejada por personas que hablan en código. La realidad es más simple de lo que parece.

Un servidor es una computadora. Una computadora como la que tienes en tu escritorio, pero diseñada para estar encendida 24/7, conectada a Internet a alta velocidad y optimizada para ejecutar tareas específicas sin intervención humana constante.

Dentro de esa computadora hay:

UN SISTEMA OPERATIVO. Generalmente Linux. Es el software base que permite que todo lo demás funcione. Es el equivalente a Windows o macOS en tu computadora personal. Como dueño de negocio, no necesitas saber comandos de Linux. Pero necesitas saber quién tiene acceso administrativo a ese sistema operativo, cómo se accede y qué medidas de seguridad tiene.

UN PANEL DE CONTROL. Muchos servidores comerciales incluyen un panel gráfico (cPanel, Plesk, CyberPanel) que facilita tareas comunes: crear cuentas de correo, administrar archivos, configurar bases de datos. El panel es tu interfaz visible hacia el servidor. Si no tienes acceso al panel, no tienes acceso al servidor.

ARCHIVOS. Tu página web es un conjunto de archivos almacenados en el servidor. Archivos de código, imágenes, documentos, configuraciones. Sin acceso a estos archivos, no puedes modificar tu página web más allá de lo que permita elCMS o el panel.

BASE DE DATOS. La base de datos vive dentro del servidor o en un servidor aparte. Almacena la información dinámica de tu negocio: usuarios, productos, pedidos, transacciones. Sin acceso a la base de datos, tu página web puede estar en línea pero no puedes extraer información de tu propio negocio.

LOGS. Los servidores registran todo lo que sucede: quién entra, qué hace, cuándo, desde dónde. Estos registros se llaman logs. Son la bitácora del servidor. Si algo sale mal, los logs son el primer lugar donde buscar respuestas. Si no tienes acceso a los logs, estás operando a ciegas.

La clave de este capítulo es entender que un servidor no es magia. Es una máquina alquilada o propia, con un sistema operativo, un panel, archivos, una base de datos y una bitácora. Y cada uno de esos componentes requiere acceso, configuración y supervisión.

Como dueño digital, tu responsabilidad no es administrar el servidor personalmente. Tu responsabilidad es saber dónde está, quién lo administra, cómo se accede y qué pasa si ese administrador deja de estar disponible.`
  },
  {
    title: 'Frontend y backend',
    targetWords: 2400,
    content: `Hay una división fundamental en el mundo del software que todo dueño de negocio debería entender: la diferencia entre frontend y backend.

FRONTEND es lo que el usuario ve y con lo que interactúa. Los botones, los menús, los formularios, las imágenes, los textos. Todo lo que ocurre en el navegador del usuario. Es la cara visible de tu negocio digital.

BACKEND es lo que ocurre detrás de escena. La lógica que procesa un pedido cuando el usuario hace clic en "Comprar". La validación que verifica si hay stock. El cálculo que determina el total con impuestos y envío. La comunicación con la pasarela de pagos. El almacenamiento del pedido en la base de datos.

¿Por qué es importante que un dueño no técnico entienda esta división? Por tres razones.

PRIMERA: Porque los problemas suelen estar en el backend, no en el frontend. Cuando un usuario te dice que "la página no funciona", puede estar viendo un frontend perfecto que no puede completar una acción porque el backend está caído, lento o mal configurado. Si solo revisas el frontend, pensarás que todo está bien. Y no lo estará.

SEGUNDA: Porque los cambios en el frontend son cosméticos y los cambios en el backend son estructurales. Cambiar el color de un botón o el texto de un título es frontend. Cambiar la lógica de precios, la forma en que se calculan los impuestos o el flujo de aprobación de pedidos es backend. Ambos tipos de cambio son válidos, pero tienen distinto riesgo, distinto costo y distinto tiempo de implementación.

TERCERA: Porque la seguridad del backend es más crítica que la del frontend. El frontend está expuesto al público. Cualquiera puede verlo, inspeccionarlo e intentar manipularlo. Por eso las validaciones importantes —las que realmente protegen tu negocio— deben ocurrir en el backend, donde el usuario no puede verlas ni modificarlas.

Como dueño digital, tu responsabilidad es asegurarte de que ambos lados de tu aplicación estén documentados, supervisados y respaldados. No necesitas escribir código. Necesitas hacer las preguntas correctas: ¿Dónde está el backend? ¿Quién lo mantiene? ¿Cómo se protege? ¿Qué pasa si falla?`
  },
  {
    title: 'WordPress sin misterio',
    targetWords: 2200,
    content: `WordPress es el sistema de gestión de contenidos (CMS) más utilizado del mundo. Potencia aproximadamente el 40% de todos los sitios web. Es probable que tu negocio digital funcione sobre WordPress, o que hayas considerado usarlo. Pero WordPress es también una de las mayores fuentes de confusión para emprendedores no técnicos.

WordPress no es "una página web". Es un software que permite crear y gestionar una página web sin escribir código. Pero detrás de esa facilidad hay una estructura que conviene entender.

WORDPRESS TIENE VARIAS CAPAS. El núcleo de WordPress es el software base que se actualiza periódicamente. Los temas controlan la apariencia visual. Los plugins añaden funcionalidades (tienda, formularios, SEO, seguridad). La base de datos almacena todo el contenido. Y el servidor aloja todo el conjunto.

CADA CAPA PUEDE FALLAR POR SEPARADO. Un plugin desactualizado puede romper el sitio aunque el núcleo esté perfecto. Un tema mal configurado puede ralentizar la página aunque el servidor sea rápido. Una base de datos corrupta puede hacer desaparecer el contenido aunque los archivos estén intactos.

EL ROL DE ADMINISTRADOR EN WORDPRESS NO LO ES TODO. Ser administrador de WordPress te da control sobre el contenido y la configuración del CMS. Pero no te da control sobre el dominio, ni sobre el DNS, ni sobre el servidor, ni sobre la base de datos. Un administrador de WordPress puede publicar contenido, instalar plugins y cambiar temas. Pero no puede transferir el dominio, ni cambiar los DNS, ni acceder al servidor, ni hacer un backup de la base de datos.

LA SEGURIDAD DE WORDPRESS DEPENDE DE CADA CAPA. Un ataque a WordPress puede ocurrir a través de un plugin vulnerable, una contraseña débil en el panel de administración, un tema desactualizado, o una configuración insegura del servidor. Proteger tu sitio WordPress requiere atención en todas las capas.

Si tu negocio usa WordPress, tu responsabilidad como dueño digital no es administrar el CMS. Es asegurarte de que alguien competente administre cada capa, que los accesos estén documentados, que los backups sean regulares y comprobados, y que el dominio y el servidor estén bajo tu control, no solo el panel de WordPress.`
  },
  {
    title: 'El miedo al administrador',
    targetWords: 2200,
    content: `Hay un momento en el viaje de todo emprendedor digital en el que aparece el miedo al administrador. Es ese instante en que alguien te dice: "Necesito acceso de administrador para solucionar esto." Y tú no sabes qué implica exactamente dar ese acceso. ¿Puede romper algo? ¿Puede ver información confidencial? ¿Puede quedarse con el acceso para siempre?

El miedo al administrador es legítimo, pero también es producto de la falta de claridad. Porque "administrador" no significa lo mismo en todos los sistemas.

SER ADMINISTRADOR EN WORDPRESS significa poder publicar contenido, instalar plugins, cambiar temas y gestionar usuarios. No significa tener control sobre el dominio, ni sobre el servidor, ni sobre la base de datos.

SER ADMINISTRADOR EN EL PANEL DE HOSTING significa poder gestionar archivos, crear cuentas de correo, configurar bases de datos y acceder a los logs del servidor. No significa tener control sobre el dominio ni sobre los DNS.

SER ADMINISTRADOR EN EL REGISTRADOR DE DOMINIOS significa poder transferir el dominio, cambiar los DNS, modificar los datos de contacto y renovar el registro. Este es el nivel más alto de control.

SER ADMINISTRADOR EN LOS DNS significa poder cambiar hacia dónde apunta tu dominio en Internet. Quien controla los DNS, controla el destino de tu tráfico.

El miedo al administrador se resuelve con tres prácticas:

PRIMERA: Documentar qué tipo de administrador necesita cada tarea. No todas las tareas requieren acceso a todo. Un desarrollador que necesita actualizar un plugin no necesita acceso al registrador de dominios.

SEGUNDA: Conceder acceso temporal cuando sea posible. Muchas plataformas permiten generar accesos temporales que caducan automáticamente después de un período.

TERCERA: Mantener un registro de quién tiene acceso a qué. Una matriz simple con sistemas, usuarios y niveles de acceso es suficiente para mantener el control.

El objetivo no es eliminar el acceso de administrador. Es gobernarlo.`
  },
  {
    title: 'Dueño legal vs dueño técnico',
    targetWords: 3200,
    content: `Este es el capítulo central del libro. La tesis que lo sostiene todo: hay una diferencia fundamental entre ser dueño legal y ser dueño técnico. Y la mayoría de los emprendedores no saben que esta diferencia existe.

SER DUEÑO LEGAL significa que tu empresa está registrada, que tienes una marca, que has pagado por un dominio y que tienes contratos con proveedores. Es la capa visible de la propiedad. Es la que te da derecho a reclamar, pero no necesariamente te da capacidad de ejecutar.

SER DUEÑO TÉCNICO significa que tienes control operativo sobre cada activo digital crítico de tu empresa. Que puedes acceder al dominio cuando lo necesitas. Que sabes dónde están los DNS y cómo se configuran. Que tienes las credenciales del servidor. Que puedes restaurar un backup sin depender de un tercero. Que sabes quién tiene acceso a qué y puedes revocarlo cuando sea necesario.

La diferencia entre ambos es la diferencia entre tener la escritura de una casa y tener las llaves de esa casa. La escritura demuestra que la casa es tuya. Las llaves demuestran que puedes entrar, salir y controlar quién más tiene acceso.

¿POR QUÉ EXISTE ESTA DIFERENCIA? Porque la infraestructura digital se construye por capas, cada capa se contrata por separado, y cada contrato puede estar a nombre de una persona o empresa distinta. Es muy común que el dominio esté a nombre del fundador, el hosting a nombre del desarrollador, el correo a nombre de un empleado que ya no trabaja en la empresa y los DNS gestionados por un proveedor que nadie recuerda haber contratado.

¿CÓMO SE CIERRA ESTA BRECHA? Con tres acciones:

1. INVENTARIO. Levantar un mapa completo de todos tus activos digitales: dominios, DNS, hosting, CMS, repositorios, correos, pasarelas de pago, redes sociales, herramientas de IA, cuentas de analytics.

2. TITULARIDAD. Verificar que cada activo esté contratado a nombre de la empresa o del fundador, no a nombre de un empleado, socio, desarrollador o proveedor.

3. ACCESO. Asegurarse de que al menos dos personas de confianza en la organización tengan acceso a cada activo crítico, y que exista un método de recuperación documentado.

Cuando cierras la brecha entre dueño legal y dueño técnico, tu empresa digital pasa de ser un conjunto de servicios sueltos a ser un sistema gobernado. Y eso es lo que marca la diferencia entre un negocio que funciona por inercia y un negocio que está realmente bajo control.`
  },
  {
    title: 'Gobernanza digital',
    targetWords: 2800,
    content: `La gobernanza digital es el conjunto de políticas, procesos y responsabilidades que determinan cómo se administran, protegen y supervisan los activos digitales de una empresa. Es el sistema de gobierno de tu infraestructura tecnológica.

PARA PYMES, la gobernanza digital no necesita ser compleja. No necesitas un comité de tecnología ni un manual de 200 páginas. Necesitas cuatro cosas:

1. UNA MATRIZ DE ROLES Y ACCESOS. Un documento simple que indique, para cada sistema crítico, quién tiene acceso, qué nivel de acceso tiene y desde cuándo. Esta matriz debe revisarse cada tres meses.

2. UN PRINCIPIO DE MÍNIMO PRIVILEGIO. Cada persona debe tener el acceso mínimo necesario para hacer su trabajo, nada más. Si alguien necesita acceso administrativo por una tarea específica, se concede temporalmente y se revoca al terminar.

3. UN PROCESO DE ALTA Y BAJA. Cuando una persona nueva se incorpora al equipo, debe recibir solo los accesos que necesita. Cuando una persona sale del equipo —por cualquier motivo— todos sus accesos deben ser revocados el mismo día.

4. UNA BITÁCORA DE CAMBIOS. Un registro simple de qué cambios se hicieron, quién los hizo, cuándo y por qué. No necesita ser técnico. Una hoja de cálculo compartida es suficiente.

LA GOBERNANZA DIGITAL NO ES CONTROL OBSESIVO. ES MADUREZ EMPRESARIAL. Una empresa que crece sin gobernanza digital eventualmente se encuentra con problemas que podrían haberse evitado: un empleado que se va y se lleva accesos, un proveedor que cambia configuraciones sin avisar, un backup que no funciona porque nadie lo probó.

La gobernanza digital es el seguro de que tu empresa digital puede operar sin importar quién esté en el equipo. Es la garantía de que el negocio no depende de una sola persona. Es la certeza de que, si algo sale mal, sabes exactamente qué hacer y a quién recurrir.

Al final de este capítulo, deberías poder responder tres preguntas: ¿Quién tiene acceso a qué? ¿Cómo se concede y revoca el acceso? ¿Qué pasa si alguien crítico deja la empresa mañana?`
  },
  {
    title: 'Cómo protegen las grandes empresas',
    targetWords: 3000,
    content: `Las grandes empresas tecnológicas tienen presupuestos de seguridad que las pymes no pueden igualar. Pero los principios que usan para protegerse son universales y pueden adaptarse a cualquier escala.

PRINCIPIO 1: CAPAS DE SEGURIDAD. No existe una defensa única que proteja todo. Las grandes empresas construyen capas: seguridad física de servidores, seguridad de red, seguridad de aplicaciones, seguridad de acceso, seguridad de datos. Cada capa asume que la capa anterior puede fallar.

ADAPTACIÓN PYME: No necesitas todas las capas. Necesitas al menos tres: contraseñas fuertes y MFA en todas las cuentas críticas; backups automáticos y probados; y accesos documentados y revocables.

PRINCIPIO 2: ACCESO GRANULAR. Nadie en una gran empresa tiene acceso a todo. Cada sistema tiene roles definidos con permisos específicos. Un desarrollador no tiene acceso a los datos financieros. Un contador no tiene acceso al servidor de producción.

ADAPTACIÓN PYME: Crea roles simples: administrador (acceso total), editor (puede modificar contenido), consultor (acceso temporal y limitado) y visitante (solo lectura). No des el rol de administrador a nadie que no lo necesite absolutamente.

PRINCIPIO 3: AUTENTICACIÓN MULTIFACTOR. Las grandes empresas exigen MFA para acceder a sistemas críticos. No basta con una contraseña. Se requiere un segundo factor: un código generado por una aplicación, una llave de seguridad física o una huella digital.

ADAPTACIÓN PYME: Activa MFA en todas las cuentas que lo permitan: correo electrónico, registrador de dominios, panel de hosting, redes sociales, pasarela de pagos.

PRINCIPIO 4: AUDITORÍA Y REGISTRO. Las grandes empresas registran quién hace qué, cuándo y desde dónde. Estos registros permiten detectar anomalías, investigar incidentes y demostrar cumplimiento.

ADAPTACIÓN PYME: Activa los logs de tus sistemas si están disponibles. Revisa mensualmente quién ha iniciado sesión y qué cambios se han realizado.

PRINCIPIO 5: RECUPERACIÓN DOCUMENTADA. Las grandes empresas tienen planes de recuperación probados. Saben exactamente qué hacer si un servidor falla, si un ataque tiene éxito o si un empleado crítico desaparece.

ADAPTACIÓN PYME: Documenta un plan simple de recuperación. Debe incluir: cómo restaurar la página web desde un backup, cómo recuperar el acceso al dominio, cómo restaurar el correo electrónico y a quién llamar en cada caso.

Las grandes empresas no son invulnerables porque tengan más dinero. Son más resilientes porque tienen estructura. Y la estructura se puede construir a cualquier escala.`
  },
  {
    title: 'Tu inventario de control',
    targetWords: 2800,
    content: `Este es el capítulo más práctico del libro. Aquí vas a construir el mapa de tu imperio digital. No es un ejercicio teórico. Es una herramienta que vas a usar para tomar el control real de tu infraestructura.

EL INVENTARIO DE CONTROL es un documento que lista cada activo digital crítico de tu empresa, quién lo controla, cómo se accede y qué pasa si ese acceso se pierde.

PARA CONSTRUIRLO, NECESITAS RESPONDER ESTAS PREGUNTAS POR CADA ACTIVO:

1. DOMINIOS. ¿Cuántos dominios tiene tu empresa? ¿A nombre de quién están registrados? ¿Quién paga la renovación? ¿Dónde están los DNS? ¿Tienes acceso al panel del registrador?

2. HOSTING. ¿Dónde está alojada tu página web? ¿Quién paga el hosting? ¿Tienes acceso al panel de control? ¿Sabes las credenciales del servidor?

3. CORREO ELECTRÓNICO. ¿Dónde está configurado tu correo profesional? ¿Quién administra las cuentas de correo? ¿Tienes acceso a la administración?

4. CMS Y APLICACIONES. ¿Usas WordPress, Shopify, Magento u otro CMS? ¿Quién tiene acceso de administrador? ¿Está actualizado?

5. REPOSITORIOS. ¿Tu código está en un repositorio como GitHub, GitLab o Bitbucket? ¿Quién tiene acceso? ¿Quién puede hacer despliegues?

6. PASARELAS DE PAGO. ¿Qué sistema usas para cobrar? ¿Stripe, PayPal, Mercado Pago? ¿Quién tiene acceso al panel de administración?

7. REDES SOCIALES. ¿Quién administra las cuentas corporativas? ¿Hay MFA activado? ¿Hay un plan de recuperación?

8. HERRAMIENTAS DE IA. ¿Usas ChatGPT, Claude u otras herramientas con datos de la empresa? ¿Quién tiene acceso?

9. ANALYTICS. ¿Google Analytics, Search Console, otras herramientas? ¿Quién tiene acceso?

10. PROVEEDORES. ¿Qué otros servicios contratados son críticos para tu operación? ¿Quién los contrató? ¿A nombre de quién están?

UNA VEZ QUE TENGAS EL INVENTARIO, CLASIFICA CADA ACTIVO:
- Crítico: si falla o se pierde, tu negocio se detiene
- Importante: si falla, tu operación se ve afectada pero no se detiene
- Prescindible: puedes vivir sin él temporalmente

LOS ACTIVOS CRÍTICOS DEBEN TENER:
- Al menos dos administradores con acceso
- MFA obligatorio
- Backup verificado
- Método de recuperación documentado

Tu inventario de control es el documento más importante que vas a crear leyendo este libro. Guárdalo en un lugar seguro. Compártelo solo con personas de confianza. Y revísalo cada tres meses.`
  },
  {
    title: 'Roles, permisos y MFA',
    targetWords: 2600,
    content: `En el mundo digital, no todas las llaves abren todas las puertas. O al menos, no deberían. La gestión de roles, permisos y autenticación es la forma en que controlas quién puede hacer qué en tus sistemas.

AUTENTICACIÓN VS AUTORIZACIÓN. Son dos conceptos distintos que a menudo se confunden. La autenticación verifica quién eres (tu identidad). La autorización determina qué puedes hacer (tus permisos). Que alguien esté autenticado no significa que deba tener acceso a todo.

ROLES. Un rol es un conjunto predefinido de permisos. En lugar de asignar permisos individuales a cada persona, asignas roles. Los roles más comunes en los sistemas digitales son:

- SUPERADMINISTRADOR: Acceso total a todo. Reservado para el dueño o la persona de máxima confianza.
- ADMINISTRADOR: Puede gestionar usuarios, contenido y configuración, pero no tiene control sobre el dominio ni el servidor.
- EDITOR: Puede crear y modificar contenido, pero no gestionar usuarios ni cambiar configuraciones.
- COLABORADOR: Puede trabajar en contenido, pero no publicarlo sin aprobación.
- CONSULTOR: Acceso temporal y limitado a sistemas específicos para proyectos concretos.

MFA — AUTENTICACIÓN MULTIFACTOR. La MFA es un mecanismo de seguridad que requiere más de una prueba de identidad para acceder a un sistema. Las tres categorías de factores son:

1. ALGO QUE SABES: Una contraseña o un PIN.
2. ALGO QUE TIENES: Un teléfono, una llave de seguridad física, una aplicación generadora de códigos.
3. ALGO QUE ERES: Tu huella digital, tu rostro, tu voz.

La MFA es obligatoria en todas las cuentas críticas: correo electrónico principal, registrador de dominios, panel de hosting, pasarela de pagos, redes sociales corporativas.

PRIVILEGIO MÍNIMO. El principio de privilegio mínimo dice que cada persona debe tener solo los permisos necesarios para hacer su trabajo. Ni uno más. Esto reduce el riesgo de errores accidentales, accesos no autorizados y daños en caso de que una cuenta sea comprometida.

REVISIÓN PERIÓDICA. Los roles y permisos deben revisarse cada tres meses. Las personas cambian de rol, los proyectos terminan, los contratos se cierran. Los accesos que no se revisan se convierten en riesgos silenciosos.

Al final de este capítulo, deberías tener una matriz de roles y accesos para tu empresa, con MFA activado en todas las cuentas críticas y un proceso definido para conceder y revocar accesos.`
  },
  {
    title: 'Backups, restauración y continuidad',
    targetWords: 3200,
    content: `Tener un backup es importante. Pero no es suficiente. Lo que realmente importa es poder restaurar. Un backup que no se ha probado no es un backup. Es un archivo que ocupa espacio y da una falsa sensación de seguridad.

QUÉ SE RESPALDA. No todo necesita el mismo nivel de protección. Clasifica tus datos en tres categorías:

- CRÍTICOS: Base de datos de clientes, pedidos, productos, configuración del sistema. Sin esto, tu negocio no puede operar.
- IMPORTANTES: Archivos del sitio web, imágenes, documentos, correos electrónicos. Perderlos afecta tu operación pero no la detiene por completo.
- PRESCINDIBLES: Logs antiguos, copias temporales, archivos que pueden regenerarse.

FRECUENCIA DE BACKUP. Los datos críticos deben respaldarse diariamente. Los importantes, semanalmente. Los prescindibles, mensualmente o bajo demanda.

RETENCIÓN. No necesitas guardar todos los backups para siempre. Una política razonable es: backups diarios de los últimos 7 días, backups semanales de las últimas 4 semanas, backups mensuales de los últimos 12 meses.

ALMACENAMIENTO OFF-SITE. Los backups deben almacenarse en un lugar diferente al del sistema original. Si tu servidor se incendia, tu backup no debería estar en el mismo servidor. Usa almacenamiento en la nube, un servidor externo o un disco duro desconectado.

PRUEBA DE RESTAURACIÓN. Al menos una vez al mes, prueba que puedes restaurar un backup completo en un entorno diferente. No importa que tengas 365 backups si ninguno funciona cuando lo necesitas.

PROCEDIMIENTO DE RESTAURACIÓN. Documenta los pasos exactos para restaurar cada sistema crítico. Incluye: dónde están los backups, quién tiene acceso, cuánto tiempo toma la restauración y a quién llamar si algo sale mal.

RPO Y RTO. Son dos métricas que definen tu tolerancia a la pérdida de datos y al tiempo de inactividad.

- RPO (Recovery Point Objective): La cantidad máxima de datos que estás dispuesto a perder. Si tu RPO es de 24 horas y haces backups diarios, puedes perder hasta un día de datos.
- RTO (Recovery Time Objective): El tiempo máximo que estás dispuesto a estar sin operar. Si tu RTO es de 4 horas, tu plan de restauración debe poder tener el sistema funcionando en menos de 4 horas.

Al final de este capítulo, deberías tener una política de backups documentada, con frecuencia definida, almacenamiento off-site, prueba de restauración programada y métricas de RPO/RTO claras.`
  },
  {
    title: 'Código, propiedad intelectual y contratos',
    targetWords: 3200,
    content: `Cuando contratas a un desarrollador o una agencia para construir tu página web, ¿quién es el dueño del código? ¿Tú, que pagaste por él? ¿El desarrollador, que lo escribió? ¿La agencia, que coordinó el proyecto? La respuesta no es automática. Depende de lo que diga el contrato.

PROPIEDAD INTELECTUAL DEL CÓDIGO. En la mayoría de las jurisdicciones, el código es una obra protegida por derechos de autor. El creador del código es el titular de los derechos, a menos que haya un contrato que transfiera esa titularidad al cliente. Esto significa que, si no hay un contrato explícito de cesión de derechos, el desarrollador puede legalmente reutilizar tu código en otros proyectos, o prohibirte modificarlo sin su permiso.

CESIÓN VS LICENCIA. La cesión transfiere la propiedad del código. La licencia permite usar el código sin transferir la propiedad. Como dueño de negocio, quieres una cesión de derechos, no una licencia.

CONTRATOS ESENCIALES. Para proteger tu propiedad intelectual digital, necesitas al menos estos documentos:

1. ACUERDO DE PRESTACIÓN DE SERVICIOS TECNOLÓGICOS. Define el alcance del proyecto, los entregables, los plazos, el costo y las condiciones de pago.

2. CESIÓN DE DERECHOS SOBRE EL CÓDIGO. Transfiere la titularidad del código del desarrollador a tu empresa.

3. ACUERDO DE CONFIDENCIALIDAD (NDA). Protege la información sensible de tu empresa que compartes con el desarrollador.

4. ACUERDO DE ACCESO DE ADMINISTRADOR. Regula el acceso del desarrollador a tus sistemas críticos.

5. HANDOFF / ENTREGA TÉCNICA. Documenta toda la información necesaria para que otra persona pueda tomar el control del proyecto.

WORK MADE FOR HIRE. En Estados Unidos, la doctrina de "work made for hire" establece que el cliente es el autor legal de ciertas obras creadas por un contratista. Pero esta doctrina tiene condiciones específicas y no se aplica automáticamente en todos los países ni a todo tipo de código.

TRADE SECRETS Y CONFIDENCIALIDAD. Además del código, tu empresa tiene secretos comerciales: algoritmos, procesos, datos de clientes, estrategias de precios. Estos secretos deben protegerse mediante acuerdos de confidencialidad y medidas de seguridad razonables.

La recomendación de este capítulo es clara: no empieces un proyecto tecnológico sin un contrato por escrito que incluya cesión de derechos, confidencialidad y handoff. El precio de un contrato es mucho menor que el costo de perder el control de tu código.`
  },
  {
    title: 'Cómo trabajar con desarrolladores sin ceder el control',
    targetWords: 2800,
    content: `Trabajar con desarrolladores es indispensable para cualquier negocio digital que quiera crecer. Pero la relación entre un emprendedor no técnico y un desarrollador puede ser compleja. El emprendedor necesita delegar, pero no quiere perder el control. El desarrollador necesita autonomía, pero no quiere asumir responsabilidades que no le corresponden.

La clave está en la estructura, no en la desconfianza.

REPOSITORIO Y RAMAS. El código de tu proyecto debe vivir en un repositorio compartido (GitHub, GitLab, Bitbucket). El repositorio debe tener al menos dos ramas: main (producción) y develop (desarrollo). Los cambios no se hacen directamente en main. Se hacen en ramas separadas, se revisan y luego se fusionan.

ENTORNOS SEPARADOS. Debe haber al menos tres entornos: desarrollo (donde se construye), staging o preview (donde se prueba antes de publicar) y producción (donde ven los usuarios). Los desarrolladores pueden tener acceso libre a desarrollo y staging. El acceso a producción debe ser controlado y documentado.

TICKETS Y DOCUMENTACIÓN. Cada cambio debe estar asociado a un ticket o tarea que describa qué se va a hacer, por qué y cuándo. Esto no es burocracia. Es trazabilidad. Sin tickets, no hay registro de cambios.

ACCESO TEMPORAL. Cuando un desarrollador necesita acceso administrativo a un sistema crítico, el acceso debe ser temporal. Muchas plataformas permiten generar accesos que caducan automáticamente después de 24 horas o al completar la tarea.

HANDOFF. El handoff es la entrega formal del proyecto. Incluye: acceso al repositorio, variables de entorno, credenciales de servicios externos, documentación de arquitectura, instrucciones de despliegue y plan de contingencia.

ONBOARDING Y OFFBOARDING. Cuando un desarrollador nuevo se incorpora, debe recibir solo los accesos que necesita para su trabajo. Cuando un desarrollador se va, todos sus accesos deben ser revocados el mismo día.

REVISIONES PERIÓDICAS. Revisa cada tres meses los accesos activos, los roles asignados y las cuentas de servicio. Los proyectos cambian. Los equipos cambian. Los accesos que no se revisan se acumulan.

La relación con tus desarrolladores no tiene que ser de desconfianza. Tiene que ser de estructura. La estructura no es falta de fe. Es madurez empresarial. Y es la base de una colaboración sana y duradera.`
  },
  {
    title: 'Tu plan de 30 días para convertirte en dueño digital',
    targetWords: 2600,
    content: `Has llegado al capítulo de acción. Los conceptos están claros. Las herramientas están listas. Ahora es momento de ejecutar. Este plan de 30 días está diseñado para que puedas implementarlo mientras sigues operando tu negocio.

SEMANA 1: INVENTARIO Y VERIFICACIÓN

DÍA 1: Lista todos tus dominios. Verifica a nombre de quién están registrados y cuándo vencen. Para cada dominio, accede al panel del registrador y verifica que tengas control.

DÍA 2: Identifica los DNS de cada dominio. ¿Están en el registrador o en un servicio externo como Cloudflare? ¿Tienes acceso a la gestión de DNS?

DÍA 3: Documenta tu hosting. ¿Dónde está alojada tu página web? ¿Tienes acceso al panel de control? ¿Sabes las credenciales del servidor?

DÍA 4: Lista tus cuentas de correo profesional. ¿Dónde están configuradas? ¿Quién las administra? ¿Tienes acceso a la administración?

DÍA 5-7: Verifica los accesos de recuperación de cada cuenta crítica. ¿El correo de recuperación es accesible? ¿El teléfono de recuperación está actualizado? ¿Hay un segundo administrador con acceso?

SEMANA 2: SEGURIDAD Y ACCESOS

DÍA 8-9: Activa MFA en todas las cuentas que lo permitan. Empieza por el correo electrónico principal, el registrador de dominios y el panel de hosting.

DÍA 10-11: Revisa los roles y permisos de cada sistema. ¿Hay personas con más acceso del que necesitan? ¿Hay cuentas de personas que ya no trabajan en la empresa?

DÍA 12-13: Crea una matriz de accesos. Documenta quién tiene acceso a qué sistema, con qué nivel y desde cuándo.

DÍA 14: Define un proceso de alta y baja de usuarios. ¿Qué pasa cuando una persona nueva se incorpora? ¿Qué pasa cuando alguien se va?

SEMANA 3: BACKUPS Y RECUPERACIÓN

DÍA 15-16: Define tu política de backups. ¿Qué se respalda? ¿Con qué frecuencia? ¿Dónde se almacena?

DÍA 17-18: Configura backups automáticos para tus datos críticos. Si ya existen, verifica que estén funcionando.

DÍA 19-20: Prueba una restauración completa en un entorno de prueba. Documenta los pasos y el tiempo que tomó.

DÍA 21: Crea un plan de recuperación simple: qué hacer si el servidor falla, si el dominio expira, si un ataque tiene éxito.

SEMANA 4: DOCUMENTACIÓN Y GOBIERNO

DÍA 22-23: Documenta la arquitectura de tu infraestructura digital. Un diagrama simple con las capas y los proveedores es suficiente.

DÍA 24-25: Prepara los contratos que necesitas: cesión de derechos, confidencialidad, handoff. Consúltalos con tu abogado.

DÍA 26-27: Programa revisiones trimestrales de accesos, permisos y backups. Ponlas en tu calendario.

DÍA 28-29: Comparte el plan de gobierno con tu equipo. Explica por qué es importante y qué roles tiene cada persona.

DÍA 30: Celebra. Has pasado de ser un inquilino digital a ser un dueño digital. Todavía hay trabajo por hacer, pero ahora tienes el mapa, las llaves y el gobierno de tu propia casa.`
  },
  {
    title: 'Conclusión',
    targetWords: 1200,
    content: `Hace algunas páginas, comenzamos con una pregunta: ¿quién controla realmente la infraestructura donde vive tu empresa?

Ahora tienes la respuesta. O mejor dicho, tienes las herramientas para construir tu propia respuesta.

Ser dueño digital no es un destino. Es una práctica continua. No es un certificado que cuelgas en la pared. Es una decisión que tomas cada día: la decisión de mantener el control sobre los activos digitales que sostienen tu negocio.

No necesitas convertirte en programador. No necesitas administrar cada servidor personalmente. No necesitas desconfiar de tu equipo ni de tus proveedores. Lo que necesitas es estructura. Y estructura se puede construir a cualquier escala, con cualquier presupuesto y en cualquier industria.

El camino de cero a dueño digital tiene tres etapas:

PRIMERA: TOMAR CONCIENCIA. Entender que tener presencia digital no es lo mismo que tener control digital. Descubrir las capas de tu infraestructura y las brechas entre tu propiedad legal y tu propiedad técnica.

SEGUNDA: CONSTRUIR INVENTARIO. Levantar el mapa de tus activos digitales, verificar la titularidad de cada uno, documentar los accesos y establecer un proceso de gobierno.

TERCERA: MANTENER EL GOBIERNO. Revisar periódicamente los accesos, probar los backups, actualizar los contratos y formar a tu equipo en cultura de control digital.

No importa en qué etapa te encuentres ahora. Lo que importa es que has comenzado el viaje. Y cada paso que des en dirección al control digital es un paso que fortalece tu empresa, protege tu trabajo y asegura tu legado.

Porque al final del día, ser dueño digital no se trata de controlarlo todo. Se trata de entender lo suficiente para gobernar lo que delega. Se trata de tener las llaves de tu propia casa, aunque no abras todas las puertas personalmente.

Eso es lo que significa pasar de cero a dueño digital.

Y ahora que lo sabes, la pregunta no es si puedes hacerlo.

La pregunta es: ¿vas a hacerlo?`
  },
  {
    title: 'Apéndices',
    targetWords: 6000,
    content: `APÉNDICE A: INVENTARIO DE ACTIVOS DIGITALES

Plantilla para listar y clasificar todos los activos digitales de tu empresa.

Activo | Tipo | Proveedor | Titular legal | Cuenta admin | Recuperación | MFA | Estado | Riesgo | Última revisión
--- | --- | --- | --- | --- | --- | --- | --- | --- | ---
[dominio.com] | Dominio | [registrador] | [persona/empresa] | [email] | [método] | Sí/No | Activo | Alto | [fecha]

APÉNDICE B: MATRIZ DE ROLES Y ACCESOS

Plantilla para documentar quién tiene acceso a qué.

Sistema | Superadmin | Admin | Editor | Colaborador | Consultor
--- | --- | --- | --- | --- | ---
Registrador de dominios | Dueño | COO | — | — | Temporal
Panel de hosting | Dueño | CTO | — | — | Temporal
CMS (WordPress) | Dueño | CTO | Editor | Colaborador | Temporal
Repositorio (GitHub) | Dueño | CTO | — | — | Temporal
Pasarela de pagos | Dueño | Contador | — | — | —

APÉNDICE C: POLÍTICA MÍNIMA DE BACKUPS

1. Los datos críticos (base de datos, configuración) se respaldan diariamente.
2. Los datos importantes (archivos del sitio, imágenes) se respaldan semanalmente.
3. Los backups se almacenan en un servicio externo al servidor principal.
4. Una vez al mes se prueba la restauración completa en un entorno de prueba.
5. El procedimiento de restauración está documentado en el runbook correspondiente.

APÉNDICE D: PLAN DE RECUPERACIÓN ANTE INCIDENTES

INCIDENTE: Pérdida de acceso al dominio
1. Contactar al registrador para verificación de identidad
2. Presentar documentación de titularidad (facturas, contrato)
3. Restablecer acceso mediante el proceso de recuperación del registrador
4. Cambiar contraseñas, activar MFA, verificar DNS
5. Documentar el incidente y actualizar contactos de recuperación

INCIDENTE: Caída del servidor
1. Verificar estado desde el panel de hosting
2. Si es posible, intentar reinicio remoto
3. Si no responde, restaurar desde el último backup en un servidor alternativo
4. Actualizar DNS si es necesario
5. Documentar el incidente y la causa raíz

APÉNDICE E: GLOSARIO

- DOMINIO: Identificador único de un sitio web en Internet (ejemplo: mituenda.com)
- DNS: Sistema que traduce nombres de dominio a direcciones IP
- HOSTING: Servicio que almacena los archivos de un sitio web en un servidor
- CMS: Sistema de gestión de contenidos (WordPress, Shopify, etc.)
- BACKEND: Parte del sistema que procesa datos y ejecuta lógica del lado del servidor
- FRONTEND: Parte del sistema que el usuario ve e interactúa en el navegador
- MFA: Autenticación multifactor — requiere más de una prueba de identidad
- RPO: Cantidad máxima de datos que se puede perder (medido en tiempo)
- RTO: Tiempo máximo para restaurar la operación después de un incidente
- RDAP: Protocolo moderno para acceder a datos de registración de dominios (sucesor de WHOIS)

APÉNDICE F: CONTRATOS A SOLICITAR AL ABOGADO

1. Acuerdo de prestación de servicios tecnológicos
2. Cesión de derechos sobre código y materiales
3. Acuerdo de confidencialidad (NDA)
4. Acuerdo de acceso de administrador
5. Handoff / entrega técnica
6. Política interna de accesos y offboarding
7. Addendum de protección de datos (si aplica)

APÉNDICE G: PREGUNTAS PARA ENTREVISTAR A UN DESARROLLADOR O AGENCIA

1. ¿Cómo gestionan el código? (repositorio, ramas, versiones)
2. ¿Cómo manejan los entornos? (desarrollo, staging, producción)
3. ¿Cómo documentan los cambios? (tickets, commits, documentación)
4. ¿Cómo entregan el proyecto al cliente? (handoff, acceso, documentación)
5. ¿Qué pasa si la relación termina? (reversibilidad, acceso, código)
6. ¿Cómo protegen la información confidencial? (NDA, accesos, seguridad)
7. ¿Cómo manejan los backups y la recuperación?
8. ¿Quién es el dueño del código al final del proyecto?

APÉNDICE H: CHECKLIST DE PUBLICACIÓN DIGITAL

Antes de lanzar un sitio web:
- [ ] Dominio registrado a nombre de la empresa o del fundador
- [ ] DNS configurados y verificados
- [ ] Hosting contratado con acceso documentado
- [ ] MFA activado en todas las cuentas críticas
- [ ] Backup del sitio completo antes del lanzamiento
- [ ] Prueba de restauración completada
- [ ] Contratos firmados con todos los proveedores
- [ ] Acceso de administrador documentado
- [ ] Plan de contingencia en caso de caída
- [ ] Revisiones trimestrales programadas`
  },
]

export function seedDeCeroADuenoDigital(publish: boolean = false): { bookId: string; chapterCount: number } | null {
  if (typeof window === 'undefined') return null

  const existingBooks = JSON.parse(localStorage.getItem('zafiro_biblioteca_libros') || '[]')
  const alreadyExists = existingBooks.find((b: any) => b.title === BOOK_TITLE)
  if (alreadyExists) {
    if (publish && alreadyExists.status !== 'PUBLICADO') {
      updateBook(alreadyExists.id, { status: 'PUBLICADO', publishedAt: now() })
      recordAuditEvent('LIBRO_PUBLICADO', alreadyExists.id)
      const book = getBook(alreadyExists.id)
      if (book) syncBookToEliana(book)
    }
    return { bookId: alreadyExists.id, chapterCount: alreadyExists.chapterCount }
  }

  const totalWords = CHAPTERS.reduce((acc, ch) => acc + ch.content.split(/\s+/).filter(w => w.length > 0).length, 0)

  const book: Book = {
    id: genId(),
    title: BOOK_TITLE,
    subtitle: 'Cómo entendí la infraestructura de mi empresa y dejé de depender ciegamente de la tecnología',
    authorName: AUTHOR,
    description: BOOK_DESC,
    biography: BIO,
    coverColor: '#00D9FF',
    format: 'txt',
    status: publish ? 'PUBLICADO' : 'SUBIDO',
    chapterCount: CHAPTERS.length,
    currentChapterIndex: 0,
    copyright: COPYRIGHT,
    rightsReserved: true,
    wordCount: totalWords,
    tags: ['gobernanza-digital', 'infraestructura', 'emprendedores', 'dominios', 'dns', 'mfa', 'backups', 'propiedad-intelectual'],
    publishedAt: publish ? now() : undefined,
    createdAt: now(),
    updatedAt: now(),
  }

  const chapters: Chapter[] = CHAPTERS.map((ch, i) => ({
    id: genId(),
    bookId: book.id,
    index: i + 1,
    title: ch.title,
    content: ch.content,
    wordCount: ch.content.split(/\s+/).filter(w => w.length > 0).length,
    createdAt: now(),
  }))

  addBook(book)
  addChapters(chapters)
  updateBook(book.id, { chapterCount: chapters.length })
  recordAuditEvent(publish ? 'LIBRO_PUBLICADO' : 'LIBRO_SUBIDO', book.id, `${chapters.length} capítulos, ${totalWords} palabras`)

  if (publish) {
    try { syncBookToEliana(book) } catch { /* silent */ }
  }

  return { bookId: book.id, chapterCount: chapters.length }
}
