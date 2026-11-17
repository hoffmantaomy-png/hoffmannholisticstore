# MEMORIA TOTAL DE PROYECTOS, CONFIGURACIÓN Y NEGOCIO
> **Documento maestro de exportación y contexto integral para agentes de IA**  
> *Fecha de generación:* 15 de noviembre de 2026  
> *Propietario:* Taomy Alberto Hoffmann Restrepo  
> *Ubicación del archivo:* `C:\Users\usuario\Documents\MEMORIA-TOTAL-PROYECTOS.md`

---

## 1. IDENTIDAD Y PERFIL DEL TITULAR

- **Nombre completo:** Taomy Alberto Hoffmann Restrepo
- **Documento de Identidad:** Cédula de Identidad V-23.438.242 (República Bolivariana de Venezuela)
- **Ubicación:** Aguirre, Municipio Montalbán, Estado Carabobo, Venezuela
- **Correo principal:** `hoffmantaomy@gmail.com`
- **Correo corporativo web (reenvío a Gmail):** `om@taomyastroholistico.com`
- **Teléfono / WhatsApp oficial de contacto y ventas:** `+58 412 4499956` (formato local: `04124499956`)
- **Cuenta de GitHub:** `hoffmantaomy-png` (repositorio privado `https://github.com/hoffmantaomy-png/taomy-web`)
- **Redes sociales activas:**
  - Instagram Marca Personal / Astrología: `@taomyastroholistico`
  - Instagram Tienda Holística: `@hoffmannholisticstore`

---

## 2. ESPECIFICACIONES TÉCNICAS Y ENTORNO DE HARDWARE

- **Equipo:** Portátil Dell Inspiron 3501
- **Sistema Operativo:** Windows 10 Home 64-bit
- **Procesador (CPU):** Intel Core i5-1035G1 (4 núcleos / 8 hilos de procesamiento)
- **Memoria RAM:** 16 GB DDR4 (2 x 8 GB) — *Ajuste crítico realizado en `msconfig`:* se desmarcaron los límites previos de arranque para habilitar los 8 procesadores lógicos y los 15.8 GB útiles del sistema.
- **Gráficos (GPU):** Gráficos integrados Intel UHD Graphics (sin tarjeta dedicada NVIDIA).
- **Almacenamiento:** Dos unidades SSD de ~238 GB cada una (Disco C: y Disco D:).
- **Resolución de pantalla:** 1920 × 1080 (Full HD).
- **Batería:** Reportada al 0% (conectada al cargador sin cargar, pendiente de revisión física).
- **Directrices técnicas operativas:**
  - Edición y renderizado de video siempre a 1080p, nunca 4K.
  - No compilar ni ejecutar modelos locales pesados de IA en memoria; utilizar APIs externas y scripts optimizados.
  - Servidor web local de desarrollo: ejecutado con Python `python -m http.server 8080` apuntando a la carpeta de cada proyecto.

---

## 3. HISTORIAL DE AGENTES, SKILLS Y MIGRACIÓN (CLAUDE CODE → ANTIGRAVITY)

### 3.1 Filosofía de Trabajo
- **Un solo agente en una sola conversación:** La prioridad máxima es mantener una memoria continua y centralizada sin fragmentar el contexto entre múltiples agentes.
- **Memoria como activo principal:** Todo cambio relevante en decisiones, código, leyes o precios se respalda en la memoria y en repositorios git.

### 3.2 Migración de Claude Code a Antigravity
- Se creó y habilitó el plugin unificado `claude-migrated` en:  
  `C:\Users\usuario\.gemini\config\plugins\claude-migrated\`
- **Contenido del plugin migrado:**
  - **64 Skills funcionales** (incluyendo marketing `mk-*`, SEO completo de Daniel Agrici, Antislop para diseño limpio sin clichés de IA, Thermos para revisión de código, creación de carruseles, HeyGen y utilidades multimedia).
  - **9 Subagentes especializados** (SEO técnico, semántico, de rendimiento, GEO para buscadores de IA y auditores de código).
  - **3 Reglas maestras** (`claude-business.md`, `claude-project.md`, `claude-tech.md`).
- **Entornos virtuales dedicados de Python:**
  - `C:\Users\usuario\.claude\tools\claude-seo\scripts` (venv en `claude-seo-venv` para auditorías SEO sin hooks invasivos).
  - `C:\Users\usuario\.claude\tools\earshot-venv` (herramienta de medición y análisis acústico `Earshot 0.4.1`).

---

## 4. PROYECTO 1: TAOMY ASTROHOLÍSTICO (WEB DE SERVICIOS)

### 4.1 Datos Generales y Producción
- **Sitio publicado:** `https://taomyastroholistico.com` (también responde en `www.taomyastroholistico.com` y `taomy-astroholistico.pages.dev`).
- **Proveedor:** Cloudflare Pages (Proyecto `taomy-astroholistico`, dominio comprado en Cloudflare Registrar con autorenovación hasta noviembre 2027).
- **Correo de dominio:** `om@taomyastroholistico.com` con Cloudflare Email Routing dirigido a `hoffmantaomy@gmail.com`.
- **Ruta local del código:** `C:\Users\usuario\Documents\Web con Claude\astrologia-web\`
- **Copia lista para desplegar:** `C:\Users\usuario\Documents\Web con Claude\astrologia-web-PUBLICAR\`

### 4.2 Propuesta de Valor y Servicios
- **Marca:** Taomy Astroholístico (Fusión de astrología evolutiva + enfoque psicológico/sistémico + hábitos biológicos + marca personal/IA).
- **Precios fijados en USD:**
  - **Carta Natal Integral:** 120 USD (~3 horas de sesión + informe completo).
  - **Revolución Solar + Tránsitos:** 80 USD (~1 h 30 min).
  - **Sinastría de Pareja/Relaciones:** 100 USD (~2 horas).
  - **Mentoría Holística 1 a 1:** Por postulación/aplicación personalizada (sin tarifa pública).
- **Promoción de bienvenida (30% OFF):**
  - Sistema honesto con cupón `TAOMY-XXXXXX` válido por 10 días desde el registro.
  - Implementado mediante Cloudflare Pages Worker (`_worker.js`) con almacenamiento en Cloudflare KV (`taomy-promo`).
  - Para obtener el descuento, el cliente registra su nombre y su número de WhatsApp.
  - Página de verificación privada para el administrador: `validar.html` (con meta noindex).

### 4.3 Capa Legal Venezolana (v1.2)
- **Marco normativo:** Constitución de la República Bolivariana de Venezuela (Arts. 28 y 60 sobre hábeas data y privacidad), Sentencia TSJ Sala Constitucional 759 (21-mayo-2025). NO rigen leyes colombianas (Ley 1581 o 1480).
- **Documentos legales:** `legal/terminos.html`, `legal/privacidad.html`, `legal/cookies.html`, `legal/reembolsos.html`.
- **Constancia digital:** El formulario calcula y envía en el mensaje de WhatsApp las huellas criptográficas SHA-256 de los términos y política aceptados junto con la marca de tiempo UTC.
- **Política de reembolsos:** Pago por adelantado reserva el cupo; sin reembolso por inasistencia o cancelación unilateral; crédito de 60 días si el cliente reprograma con al menos 48 horas de anticipación.
- **Privacidad y diseño técnico:** 100% estático, cero cookies de rastreo publicitario, cero librerías de Google Fonts (utiliza fuentes locales / seguras para evitar fuga de IPs).

### 4.4 Respaldo Git
- Repositorio privado en GitHub: `https://github.com/hoffmantaomy-png/taomy-web`
- Script de respaldo rápido en un clic: `Documentos\Web con Claude\subir-respaldo.bat`.

---

## 5. PROYECTO 2: HOFFMANN HOLISTIC STORE (E-COMMERCE)

### 5.1 Objetivo del Proyecto
Tienda virtual de productos físicos de bienestar, espiritualidad, nutrición y estilo holístico dirigida prioritariamente al mercado venezolano.

### 5.2 Ubicación de Archivos
- **Código fuente de trabajo:** `C:\Users\usuario\Documents\Hoffmann Holistic Store\tienda-web\`
- **Paquete de despliegue generado (Zip):** `C:\Users\usuario\Documents\Hoffmann Holistic Store\tienda-web-PUBLICAR.zip`
- **Manual de marca y borradores:** `C:\Users\usuario\Documents\Hoffmann Holistic Store\MANUAL-DE-MARCA-borrador.md`
- **Servidor local activo:** `http://localhost:8080` (ejecutado desde la raíz del proyecto).

### 5.3 Arquitectura y Componentes
- `index.html`: Estructura semántica completa (Header fijo, Hero con tag de marca, Carrusel de categorías, Catálogo dinámico con filtros, Sección Nosotros, Contacto directo y Footer con links legales y de Instagram).
- `styles.css`: Sistema de diseño moderno, limpio y responsive basado en variables CSS personalizadas.
- `script.js`: Motor integral del lado del cliente (catálogo de productos, carrito persistente en `localStorage`, modal dinámico de pagos, renderizador de categorías, validación y envío a WhatsApp).
- `_worker.js`: Cloudflare Worker en modo avanzado con endpoints REST:
  - `GET /api/productos` / `POST /api/admin/productos` (gestión del catálogo).
  - `GET /api/config` / `POST /api/admin/config` (configuración del teléfono WhatsApp y clave).
  - Autenticación administrativa con Bearer token y almacenamiento seguro en Cloudflare KV (`HHS_PRODUCTOS`, `HHS_CONFIG`).
- `_headers`: Cabeceras de seguridad estrictas (Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
- `robots.txt`, `sitemap.xml`, `llms.txt`: Optimización para indexación y lectura por modelos de lenguaje.
- `legal/`: Documentos legales adaptados a comercio electrónico físico en Venezuela:
  - `terminos.html` (Términos de servicio para venta de bienes físicos).
  - `privacidad.html` (Protección de datos conforme a la CRBV).
  - `cookies.html` (Aviso transparente de almacenamiento local estricto).
  - `reembolsos.html` (Plazo de 5 días hábiles para devoluciones por defecto; productos de uso personal o perecederos no sujetos a retracto una vez abiertos).

### 5.4 Panel de Administración para Asistente
- **Ubicación:** `C:\Users\usuario\Documents\Hoffmann Holistic Store\tienda-web\admin\index.html`
- **Script del panel:** `admin/admin.js`
- **Guía de uso para el personal:** `admin/LEEME-asistente.md`
- **Capacidad offline / online:** Si el backend de Cloudflare no está conectado, el panel funciona automáticamente mediante `localStorage` (`hhs_catalogo_offline`). Cuando se despliegue en producción con Cloudflare Worker, se sincronizará directo con la nube.
- Permite: Crear nuevos productos, editar precios, subir fotos, cambiar estados (activo/inactivo), filtrar por categoría y configurar el número de WhatsApp.

### 5.5 Identidad Visual y Paleta de Color
- **Colores corporativos oficiales:**
  - Verde Bosque Oscuro: `#2A351F` (fondo contrastado, encabezados principales)
  - Verde Oliva Natural: `#5F6732` (botones primarios, acentos y hover)
  - Blanco Crema Suave: `#F7F4EA` (fondo principal de la tienda, descansado a la vista)
  - Arena / Dorado Claro: `#D9C58A` (bordes finos, selectores, tags)
  - Tierra Cálido: `#8A5A2B` (detalles y acentos complementarios)
- **Tipografía:**
  - Títulos: **Montserrat** (pesos 600 y 700)
  - Cuerpo de texto: **Lato** (pesos 400 y 600)
  - Cargadas mediante Bunny Fonts (red europea respetuosa de la privacidad, sin tracking de Google).
- **Logotipos del proyecto:**
  - Versión clara: `assets/img/logo.png`
  - Versión oscura: `assets/img/logo-oscuro.jpg`
  - Variantes adicionales en: `assets/logos-ultimate/`

### 5.6 Categorías de Productos con Iconos Vectoriales
Se reemplazaron todos los emojis genéricos por **iconos SVG lineales monocromáticos**, limpios y elegantes:
1. `cristales` — **Cristales** (Icono de prisma geométrico tallado).
2. `sahumerios` — **Sahumerios** (Icono de varilla de incienso con humo suave).
3. `alimentos` — **Alimentación e infusiones** (Icono de taza humeante de infusión botánica).
4. `ropa` — **Ropa consciente** (Icono estilizado de prenda textil orgánica).
5. `aceites` — **Aceites y esencias** (Icono de frasco boticario con gotero/esencia).
6. `meditacion` — **Meditación** (Icono botánico de hoja equilibrada).
7. `otros` — **Otros** (Icono de emblema holístico protector).
*Tarjetas de producto sin imagen:* Muestran un marco elegante con ilustración vectorial de fondo y la leyenda sutil "Foto próximamente" para no romper la estética antes de la carga de fotos oficiales.

### 5.7 Métodos de Pago Integrados en el Carrito (Modal Interactivo)
Al pulsar el botón **"Comprar"** en el carrito, se abre un selector visual con las 5 opciones oficiales del negocio:

| Método | Emoji / Distintivo | Beneficiario / Cuenta | Correo / Identificador |
|---|---|---|---|
| **Zelle** | 💱 | Clara I González | `unfoldthegift@gmail.com` |
| **Binance Pay** | 🟡 | Taomy Hoffmann | `Hoffmantaomy@gmail.com` |
| **Zinli** | 💜 | Taomy Hoffmann | `Hoffmantaomy@gmail.com` |
| **PayPal** | 🔵 | Taomy Hoffmann | `Hoffmantaomy@gmail.com` |
| **Pago Móvil** | 📱 | Banco Provincial | Tel: `04124499956` / C.I.: `23.438.242` |

**Mecanismo de Checkout:**
El cliente selecciona su método preferido y pulsa **"Confirmar y abrir WhatsApp"**. El sistema compone automáticamente un mensaje detallado con:
1. Saludo formal al negocio.
2. Lista de productos solicitados con sus cantidades y subtotales.
3. Total general a pagar.
4. Método de pago elegido con los datos de cobro exactos para que el cliente realice la transferencia de inmediato.
5. Abre la conversación directamente con el número oficial `+58 412 4499956`.

---

## 6. PROYECTO 3: SISTEMA OPERATIVO HACIENDA LA CONCEPCIÓN (`sistema-hacienda`)

> **Recuperado y sincronizado desde GitHub:** Rama `claude/github-memory-access-38grp1` sincronizada y fusionada el 15-nov-2026.  
> **Ubicación local:** `C:\Users\usuario\Documents\Web con Claude\sistema-hacienda\`

### 6.1 Naturaleza del Proyecto
Sistema administrativo y operativo integral para una hacienda y clínica-hotel-spa de bienestar en Venezuela con 27 habitaciones, donde coexisten y operan dos entidades jurídicas:
1. **Hotel / Spa:** Régimen comercial estándar (aplica IVA).
2. **Clínica de Bienestar:** Servicios de salud y terapias integrativas (exento de IVA).

### 6.2 Características Operativas Clave
- **Infraestructura local independiente:** Diseñado para ejecutarse en un servidor local dentro de la hacienda, operando de forma continua **sin depender de conexión a internet**.
- **Gestión por cama y habitación:** Control dinámico de reservas en 27 habitaciones configurables.
- **Presupuesto vivo bimoneda:** Precios de referencia en euros y dólares (a la par 1:1), cobros en bolívares (tasa oficial BCV) o divisas en efectivo/transferencia. Lo abonado por el cliente queda congelado el día de la transacción.
- **División fiscal automática:** Separación de consumos y cobros entre la empresa del hotel (con IVA) y la clínica (exenta) para cumplimiento riguroso con el SENIAT.
- **Agenda de servicios:** Asignación de turnos para terapeutas, médicos, masajes y consultas.
- **App del Huésped:** Aplicación ligera accesible desde el teléfono del visitante conectado a la red local WiFi de la hacienda para consultar su itinerario, saldo y servicios adicionales.
- **Fases futuras:** Facturación fiscal automatizada e historia clínica médica digital.

### 6.3 Documentación de Arquitectura Disponible (`sistema-hacienda/docs/`)
- `00-guia-para-taomy.md`: Explicación en lenguaje no técnico de instalación, fases y costos.
- `01-vision-y-alcance.md`: Objetivos, actores, qué entra y qué no.
- `02-arquitectura.md`: Servidor local (Raspberry Pi/Mini PC), base de datos SQLite/Postgres local, Docker.
- `03-modelo-de-datos.md`: Estructura de tablas (huéspedes, habitaciones, consumos, pagos, empresas).
- `04-reglas-de-negocio.md`: Estados de reserva, check-in/out, pagos parciales y congelación de saldos.
- `05-roles-y-permisos.md`: Recepción, administración, terapeutas, médicos, gerencia.
- `06-fiscal-venezuela.md`: Normativa SENIAT, libros de venta, máquinas fiscales y exenciones.
- `07-app-del-huesped.md`: PWA móvil local para huéspedes.
- `08-plan-de-fases.md`: Hoja de ruta de implementación paso a paso.
- `09-preguntas-abiertas.md`: Cuestionario operativo y técnico pendiente para el equipo de sistemas.

---

## 7. ESTRATEGIA AUDIOVISUAL Y MULTIMEDIA

### 6.1 Preferencias de Edición de Video (Reels / TikTok / Shorts)
- Formato vertical 9:16 en resolución 1080 × 1920, duración preferida entre 30 segundos y 3 minutos.
- **Tratamiento de color del iPhone:** El iPhone graba video nativo en HDR (HLG), el cual lucía gris o lavado sin conversión; se requiere tone mapping `HDR → SDR` para preservar colores vibrantes.
- **Estilo:** Alternancia de tomas naturales con planos de ligera corrección tonal cinematográfica; evitar transiciones duras o desenfoques pesados (`hblur`) que degradan la nitidez.
- **Subtítulos y audio:** Subtítulos limpios, directos, con palabras clave destacadas; mezcla de audio final normalizada a -14 LUFS para redes sociales.

### 6.2 HeyGen y Avatar Digital
- Cuenta creada con avatar oficial basado en la imagen de Taomy: `"taomy alberto hoffman restrepo"` con **7 looks disponibles** (el principal con gorra y cuadro de fondo; también incluye look de constelaciones y biblioteca).
- Proyectos trabajados:
  - *Reel Carta Natal IA* (Descargado a 720p).
  - *Astrología y Éxito*.
  - *Biblia y Astrología* (Video renderizado de 1:59 min).
- Directriz: No activar subtítulos pegados (*burned-in captions*) de HeyGen para mantener la libertad de editar la tipografía y animación en código o editor final.

---

## 8. REGLAS FUNDAMENTALES Y RESTRICCIONES DE ÉTICA / NEGOCIO

1. **Sin falsas promesas:** Prohibido inventar testimonios, promesas de curación física o mental, o garantías de enriquecimiento o destino asegurado. Los servicios y productos son herramientas de autoconocimiento y bienestar integral complementario.
2. **Seguridad bancaria:** Los datos de cuentas bancarias y métodos de cobro no deben publicarse en texto plano indexable en páginas abiertas; se canalizan de forma privada y controlada a través de la confirmación de pedidos vía WhatsApp.
3. **Respeto a la propiedad y derechos:** Utilizar únicamente imágenes propias, recursos libres de derechos (CC0 / Openverse / Bunny Fonts) y código limpio sin dependencias invasivas.
4. **Cumplimiento legal local:** Todo documento legal debe estar adaptado al territorio de residencia y operación del titular (Venezuela).

---
*Fin del documento maestro. Este archivo resume la totalidad de las directrices técnicas, comerciales y de configuración del usuario.*
