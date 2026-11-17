# Hoffmann Holistic Store — Directrices del Proyecto (CLAUDE.md)

Tienda online de productos holísticos, cristales, sahumerios y bienestar natural en Venezuela.

## Rutas del Proyecto
- **Código fuente:** `C:\Users\usuario\Documents\Hoffmann Holistic Store\tienda-web\`
- **Panel administrativo:** `tienda-web\admin\index.html` (control de productos y catálogo)
- **Despliegue Cloudflare:** `tienda-web-PUBLICAR.zip` (Cloudflare Pages con `_worker.js` y `_headers`)
- **Assets de marca:** `assets/` y `tienda-web/assets/`

## Stack y Arquitectura
- **Frontend:** HTML5 semántico, CSS3 moderno (paleta natural verde bosque `#2A351F`, oliva `#5F6732`, crema `#F7F4EA`, arena `#D9C58A`), JavaScript vanilla con almacenamiento reactivo (`localStorage`).
- **Fuentes:** Bunny Fonts (Montserrat + Lato), sin Google Fonts para privacidad de datos.
- **Backend / API:** Cloudflare Pages Worker (`_worker.js`) con KV (`HHS_PRODUCTOS`, `HHS_CONFIG`). Funciona también 100% offline mediante caché local.
- **Ventas y Carrito:** Pedidos automatizados vía WhatsApp (+58 412 4499956) con cálculo de envío nacional y divisas/bolívares.
- **Marco Legal:** Conforme a la legislación venezolana (CRBV arts. 28 y 60, hábeas data).

## Reglas de Trabajo
1. Respetar la identidad visual y no introducir librerías invasivas ni rastreadores de terceros.
2. Mantener la compatibilidad dual (online en Cloudflare / offline en localStorage para el panel de administración).
3. Todas las actualizaciones deben sincronizarse entre `tienda-web/` y el paquete `tienda-web-PUBLICAR.zip`.
