/* ============================================================
   HOFFMANN HOLISTIC STORE — Cloudflare Worker
   _worker.js
   - API de productos (KV: HHS_PRODUCTOS)
   - API de configuración (KV: HHS_CONFIG)
   - Panel de administración protegido por contraseña
   ============================================================ */

// ── Cabeceras CORS base ──
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function error(msg, status = 400) {
  return json({ ok: false, error: msg }, status);
}

// ── Verificar contraseña de admin ──
async function verificarAdmin(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const clave = await env.HHS_CONFIG?.get('admin_password') ?? env.ADMIN_PASSWORD ?? '';
  if (!clave || token !== clave) return false;
  return true;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    // ══ /api/config — configuración pública (solo whatsapp) ══
    if (pathname === '/api/config' && request.method === 'GET') {
      const wa = await env.HHS_CONFIG?.get('whatsapp') ?? '';
      return json({ whatsapp: wa });
    }

    // ══ /api/productos — listado público ══
    if (pathname === '/api/productos' && request.method === 'GET') {
      const raw = await env.HHS_PRODUCTOS?.get('catalogo') ?? '[]';
      let productos = [];
      try { productos = JSON.parse(raw); } catch { productos = []; }
      const activos = productos.filter(p => p.activo !== false);
      return json({ ok: true, productos: activos });
    }

    // ══ /api/admin/* — requieren autenticación ══
    if (pathname.startsWith('/api/admin/')) {
      const autorizado = await verificarAdmin(request, env);
      if (!autorizado) return error('No autorizado', 401);

      // GET /api/admin/productos — todos (incluye inactivos)
      if (pathname === '/api/admin/productos' && request.method === 'GET') {
        const raw = await env.HHS_PRODUCTOS?.get('catalogo') ?? '[]';
        let productos = [];
        try { productos = JSON.parse(raw); } catch {}
        return json({ ok: true, productos });
      }

      // POST /api/admin/productos — crear producto
      if (pathname === '/api/admin/productos' && request.method === 'POST') {
        const body = await request.json().catch(() => null);
        if (!body?.nombre || body.precio == null) return error('nombre y precio son obligatorios');

        const raw = await env.HHS_PRODUCTOS?.get('catalogo') ?? '[]';
        let productos = [];
        try { productos = JSON.parse(raw); } catch {}

        const nuevo = {
          id:          `p${Date.now()}`,
          nombre:      String(body.nombre).trim(),
          categoria:   String(body.categoria || 'otros').trim(),
          precio:      Number(body.precio),
          descripcion: String(body.descripcion || '').trim(),
          emoji:       String(body.emoji || '🌿').trim(),
          imagen:      String(body.imagen || '').trim(),
          activo:      body.activo !== false,
          creadoEn:    new Date().toISOString(),
        };
        productos.push(nuevo);
        await env.HHS_PRODUCTOS?.put('catalogo', JSON.stringify(productos));
        return json({ ok: true, producto: nuevo }, 201);
      }

      // PUT /api/admin/productos/:id — editar producto
      const editMatch = pathname.match(/^\/api\/admin\/productos\/([^/]+)$/);
      if (editMatch && request.method === 'PUT') {
        const id = editMatch[1];
        const body = await request.json().catch(() => null);
        if (!body) return error('Cuerpo inválido');

        const raw = await env.HHS_PRODUCTOS?.get('catalogo') ?? '[]';
        let productos = [];
        try { productos = JSON.parse(raw); } catch {}

        const idx = productos.findIndex(p => p.id === id);
        if (idx === -1) return error('Producto no encontrado', 404);

        productos[idx] = {
          ...productos[idx],
          nombre:      body.nombre      !== undefined ? String(body.nombre).trim()      : productos[idx].nombre,
          categoria:   body.categoria   !== undefined ? String(body.categoria).trim()   : productos[idx].categoria,
          precio:      body.precio      !== undefined ? Number(body.precio)             : productos[idx].precio,
          descripcion: body.descripcion !== undefined ? String(body.descripcion).trim() : productos[idx].descripcion,
          emoji:       body.emoji       !== undefined ? String(body.emoji).trim()       : productos[idx].emoji,
          imagen:      body.imagen      !== undefined ? String(body.imagen).trim()      : productos[idx].imagen,
          activo:      body.activo      !== undefined ? Boolean(body.activo)            : productos[idx].activo,
          actualizadoEn: new Date().toISOString(),
        };
        await env.HHS_PRODUCTOS?.put('catalogo', JSON.stringify(productos));
        return json({ ok: true, producto: productos[idx] });
      }

      // DELETE /api/admin/productos/:id — eliminar
      const delMatch = pathname.match(/^\/api\/admin\/productos\/([^/]+)$/);
      if (delMatch && request.method === 'DELETE') {
        const id = delMatch[1];
        const raw = await env.HHS_PRODUCTOS?.get('catalogo') ?? '[]';
        let productos = [];
        try { productos = JSON.parse(raw); } catch {}
        const antes = productos.length;
        productos = productos.filter(p => p.id !== id);
        if (productos.length === antes) return error('Producto no encontrado', 404);
        await env.HHS_PRODUCTOS?.put('catalogo', JSON.stringify(productos));
        return json({ ok: true });
      }

      // PUT /api/admin/config — actualizar configuración
      if (pathname === '/api/admin/config' && request.method === 'PUT') {
        const body = await request.json().catch(() => null);
        if (!body) return error('Cuerpo inválido');
        const permitidos = ['whatsapp', 'nombre', 'moneda', 'envio_gratis', 'costo_envio'];
        for (const clave of permitidos) {
          if (body[clave] !== undefined) {
            await env.HHS_CONFIG?.put(clave, String(body[clave]));
          }
        }
        return json({ ok: true });
      }

      // POST /api/admin/cambiar-clave — cambiar contraseña admin
      if (pathname === '/api/admin/cambiar-clave' && request.method === 'POST') {
        const body = await request.json().catch(() => null);
        if (!body?.nueva || body.nueva.length < 8) return error('La clave debe tener al menos 8 caracteres');
        await env.HHS_CONFIG?.put('admin_password', body.nueva);
        return json({ ok: true, mensaje: 'Contraseña actualizada' });
      }

      return error('Ruta no encontrada', 404);
    }

    // No es una ruta de API — servir archivos estáticos de la web
    return env.ASSETS.fetch(request);
  },
};
