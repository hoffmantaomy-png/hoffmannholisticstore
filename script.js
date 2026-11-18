/* ============================================================
   HOFFMANN HOLISTIC STORE — script.js
   Motor completo: catálogo, carrito (localStorage), admin API
   Sin cookies de terceros, sin analytics externos.
   ============================================================ */

'use strict';

/* ── Configuración central ── */
const CONFIG = {
  whatsapp:     '584124499956', // WhatsApp oficial de la tienda
  nombre:       'Hoffmann Holistic Store',
  moneda:       'USD',        // 'USD' | 'VES'
  envioGratis:  50,           // monto mínimo para envío gratuito (en moneda)
  costoEnvio:   3,            // costo de envío base
  apiBase:      '/api',       // Worker endpoint
};

/* ── Categorías con iconos SVG vectoriales monocromáticos ── */
const CATEGORIAS = [
  { 
    id: 'cristales',   
    nombre: 'Cristales',          
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M2 9h20"/><path d="m10 3-2 6 4 12 4-12-2-6"/></svg>' 
  },
  { 
    id: 'sahumerios',  
    nombre: 'Sahumerios',          
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V10"/><path d="M8 8c0-2.2 1.8-4 4-4s4 1.8 4 4c0 1.5-.8 2.8-2 3.5"/><path d="M10 5c.5-1.5 2-2.5 3.5-2 1.2.4 2 1.5 2 2.7"/><path d="M19 22H5"/></svg>' 
  },
  { 
    id: 'alimentos',   
    nombre: 'Alimentación e infusiones', 
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>' 
  },
  { 
    id: 'ropa',        
    nombre: 'Ropa consciente',     
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a3 3 0 0 0-3 3c0 .8.3 1.5.8 2L2 15l2 3h16l2-3-7.8-7a3 3 0 0 0 .8-2 3 3 0 0 0-3-3z"/><path d="M5 21h14"/></svg>' 
  },
  { 
    id: 'aceites',     
    nombre: 'Aceites y esencias',  
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="9" width="10" height="12" rx="2"/><path d="M9 9V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/><path d="M10 5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"/><circle cx="12" cy="15" r="1.5"/></svg>' 
  },
  { 
    id: 'meditacion',  
    nombre: 'Meditación',          
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-4.5 0-9-3-9-8 0-4 4-8 9-11 5 3 9 7 9 11 0 5-4.5 8-9 8z"/><path d="M12 21c-2.5 0-5-2-5-5.5 0-3 2.5-6 5-8.5 2.5 2.5 5 5.5 5 8.5 0 3.5-2.5 5.5-5 5.5z"/><path d="M3 13c3 1.5 6 1.5 9 0 3 1.5 6 1.5 9 0"/></svg>' 
  },
  { 
    id: 'otros',       
    nombre: 'Otros',               
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="12" r="3"/></svg>' 
  },
];

/* ── Estado global ── */
let carrito       = [];
let productos     = [];
let filtroActual  = null;

/* ══════════════════════════════════════════════════════════════
   CARRITO (localStorage)
══════════════════════════════════════════════════════════════ */

function cargarCarrito() {
  try { carrito = JSON.parse(localStorage.getItem('hhs_carrito') || '[]'); }
  catch { carrito = []; }
  actualizarContador();
}

function guardarCarrito() {
  localStorage.setItem('hhs_carrito', JSON.stringify(carrito));
  actualizarContador();
}

function actualizarContador() {
  const total = carrito.reduce((s, i) => s + i.cantidad, 0);
  const el = document.getElementById('contadorCarrito');
  if (el) { el.textContent = total; el.style.display = total > 0 ? 'flex' : 'none'; }
}

function agregarAlCarrito(id) {
  const p = productos.find(x => x.id === id);
  if (!p) return;
  const ex = carrito.find(x => x.id === id);
  if (ex) { ex.cantidad++; }
  else { carrito.push({ id: p.id, nombre: p.nombre, precio: p.precio, emoji: p.emoji || '🌿', cantidad: 1 }); }
  guardarCarrito();
  renderizarCarrito();
  abrirCarrito();
  mostrarToast(`"${p.nombre}" agregado al carrito`);
}

function cambiarCantidad(id, delta) {
  const item = carrito.find(x => x.id === id);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) carrito = carrito.filter(x => x.id !== id);
  guardarCarrito();
  renderizarCarrito();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(x => x.id !== id);
  guardarCarrito();
  renderizarCarrito();
}

function calcularTotal() {
  const sub = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const envio = sub >= CONFIG.envioGratis || sub === 0 ? 0 : CONFIG.costoEnvio;
  return { subtotal: sub, envio, total: sub + envio };
}

function renderizarCarrito() {
  const cont = document.getElementById('carritoItems');
  const pie  = document.getElementById('cartoPie');
  if (!cont) return;

  if (carrito.length === 0) {
    cont.innerHTML = `
      <div class="carrito-vacio">
        <div style="width:48px; height:48px; margin:0 auto 14px; color:var(--oliva);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <p style="font-weight:700; color:var(--verde-hoja); margin-bottom:4px;">Tu carrito está vacío</p>
        <p style="font-size:0.85rem;">Explora nuestras colecciones y añade tus favoritos.</p>
      </div>`;
    if (pie) pie.style.display = 'none';
    return;
  }

  if (pie) pie.style.display = 'block';
  const { subtotal, envio, total } = calcularTotal();

  cont.innerHTML = carrito.map(item => `
    <div class="carrito-item">
      <div class="carrito-item-img">
        ${item.imagen 
          ? `<img src="${escHTML(item.imagen)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">`
          : `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3-3a2 2 0 0 0-3 0l-5 5"/></svg>`
        }
      </div>
      <div class="carrito-item-info">
        <div class="carrito-item-nombre">${escHTML(item.nombre)}</div>
        <div class="carrito-item-precio">${formatearPrecio(item.precio)}</div>
        <div class="carrito-item-controles">
          <button class="btn-cantidad" onclick="cambiarCantidad('${item.id}',-1)" aria-label="Reducir cantidad">−</button>
          <span class="carrito-item-cant">${item.cantidad}</span>
          <button class="btn-cantidad" onclick="cambiarCantidad('${item.id}',1)" aria-label="Aumentar cantidad">+</button>
          <button class="btn-eliminar-item" onclick="eliminarDelCarrito('${item.id}')" aria-label="Eliminar producto">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  const totalEl = document.getElementById('carritoTotal');
  if (totalEl) {
    totalEl.innerHTML = `
      <span style="font-size:0.9rem;font-weight:400;color:var(--gris-verde)">
        Subtotal: ${formatearPrecio(subtotal)}<br>
        Envío: ${envio === 0 ? '<strong style="color:var(--oliva)">Gratis</strong>' : formatearPrecio(envio)}
      </span>
      <strong>${formatearPrecio(total)}</strong>`;
  }
}

function abrirCarrito() {
  document.getElementById('carritoPanel')?.classList.add('abierto');
  document.getElementById('carritoOverlay')?.classList.add('abierto');
  document.body.style.overflow = 'hidden';
}

function cerrarCarrito() {
  document.getElementById('carritoPanel')?.classList.remove('abierto');
  document.getElementById('carritoOverlay')?.classList.remove('abierto');
  document.body.style.overflow = '';
}

/* ── Métodos de pago ── */
const PAGOS = [
  { id: 'zelle',     label: 'Zelle',       emoji: '💱', detalle: 'Nombre: Clara I González\nEmail: unfoldthegift@gmail.com' },
  { id: 'binance',   label: 'Binance Pay', emoji: '🟡', detalle: 'Email: Hoffmantaomy@gmail.com' },
  { id: 'zinli',     label: 'Zinli',       emoji: '💜', detalle: 'Email: Hoffmantaomy@gmail.com' },
  { id: 'paypal',    label: 'PayPal',      emoji: '🔵', detalle: 'Email: Hoffmantaomy@gmail.com' },
  { id: 'pagomovil', label: 'Pago Móvil',  emoji: '📱', detalle: 'Banco: Provincial\nTeléfono: 04124499956\nC.I.: 23.438.242' },
];

let pagoSeleccionado = null;

function iniciarCompra() {
  if (carrito.length === 0) return;
  pagoSeleccionado = null;
  // Reset selección visual
  document.querySelectorAll('.pago-opcion').forEach(el => el.classList.remove('seleccionado'));
  document.getElementById('btnConfirmarPago').disabled = true;
  document.getElementById('modalPago').classList.add('abierto');
  document.body.style.overflow = 'hidden';
}

function cerrarModalPago() {
  document.getElementById('modalPago').classList.remove('abierto');
  document.body.style.overflow = '';
}

function seleccionarPago(id) {
  pagoSeleccionado = id;
  document.querySelectorAll('.pago-opcion').forEach(el => {
    el.classList.toggle('seleccionado', el.dataset.pago === id);
  });
  document.getElementById('btnConfirmarPago').disabled = false;
}

function confirmarPago() {
  if (!pagoSeleccionado) return;
  const metodo = PAGOS.find(p => p.id === pagoSeleccionado);
  if (!metodo) return;

  const { total } = calcularTotal();
  const lineas = carrito.map(i => `• ${i.nombre} x${i.cantidad} — ${formatearPrecio(i.precio * i.cantidad)}`).join('\n');
  const msg = `Hola, quiero hacer un pedido en Hoffmann Holistic Store:\n\n${lineas}\n\nTotal: ${formatearPrecio(total)}\n\nMétodo de pago elegido: ${metodo.emoji} ${metodo.label}\n${metodo.detalle}\n\nPor favor confírmame el pedido.`;

  cerrarModalPago();

  if (CONFIG.whatsapp) {
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  } else {
    alert('Copia este mensaje y envíalo por WhatsApp:\n\n' + msg);
  }
}

function inyectarModalPago() {
  if (document.getElementById('modalPago')) return;
  const modal = document.createElement('div');
  modal.id = 'modalPago';
  modal.className = 'modal-pago-overlay';
  modal.innerHTML = `
    <div class="modal-pago-caja" role="dialog" aria-modal="true" aria-label="Seleccionar método de pago">
      <div class="modal-pago-cabecera">
        <h2>Elige cómo pagar</h2>
        <button class="modal-pago-cerrar" onclick="cerrarModalPago()" aria-label="Cerrar">✕</button>
      </div>
      <p class="modal-pago-sub">Selecciona el método que prefieras. Los detalles llegarán en el mensaje de WhatsApp.</p>
      <div class="modal-pago-opciones">
        ${PAGOS.map(p => `
          <button class="pago-opcion" data-pago="${p.id}" onclick="seleccionarPago('${p.id}')">
            <span class="pago-emoji">${p.emoji}</span>
            <span class="pago-label">${p.label}</span>
          </button>`).join('')}
      </div>
      <button id="btnConfirmarPago" class="btn-confirmar-pago" disabled onclick="confirmarPago()">
        Confirmar y abrir WhatsApp
      </button>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) cerrarModalPago(); });
  document.body.appendChild(modal);
}

/* ══════════════════════════════════════════════════════════════
   CATÁLOGO DE PRODUCTOS
══════════════════════════════════════════════════════════════ */

async function cargarProductos() {
  try {
    const r = await fetch(`${CONFIG.apiBase}/productos`);
    if (r.ok) {
      const data = await r.json();
      productos = data.productos || [];
    } else {
      throw new Error('API offline');
    }
  } catch {
    // Si no hay worker o estamos en local, sincronizar con lo que el asistente haya creado en el admin
    const offline = localStorage.getItem('hhs_catalogo_offline');
    if (offline) {
      try { productos = JSON.parse(offline); } catch { productos = productosDemo(); }
    } else {
      productos = productosDemo();
      localStorage.setItem('hhs_catalogo_offline', JSON.stringify(productos));
    }
  }
  renderizarProductos(filtroActual);
}

function productosDemo() {
  return [
    { id: 'p1', nombre: 'Amatista natural', categoria: 'cristales', precio: 12, descripcion: 'Cristal de cuarzo amatista para equilibrio y claridad mental.', imagen: '', activo: true },
    { id: 'p2', nombre: 'Cuarzo rosado', categoria: 'cristales', precio: 10, descripcion: 'Cristal de amor y armonía emocional.', imagen: '', activo: true },
    { id: 'p3', nombre: 'Incienso de sándalo', categoria: 'sahumerios', precio: 5, descripcion: 'Paquete de 20 varillas de incienso natural de sándalo.', imagen: '', activo: true },
    { id: 'p4', nombre: 'Sahumerio de palo santo', categoria: 'sahumerios', precio: 8, descripcion: 'Palitos de palo santo 100% natural de Venezuela.', imagen: '', activo: true },
    { id: 'p5', nombre: 'Infusión digestiva herbal', categoria: 'alimentos', precio: 7, descripcion: 'Mezcla artesanal de manzanilla, menta y anís estrellado.', imagen: '', activo: true },
    { id: 'p6', nombre: 'Camiseta Mindful', categoria: 'ropa', precio: 18, descripcion: 'Camiseta 100% algodón con estampado holístico.', imagen: '', activo: true },
    { id: 'p7', nombre: 'Aceite de lavanda', categoria: 'aceites', precio: 9, descripcion: 'Aceite esencial puro de lavanda para aromaterapia.', imagen: '', activo: true },
  ];
}

function renderizarProductos(categoriaId = null) {
  filtroActual = categoriaId;
  const grid = document.getElementById('productosGrid');
  const titulo = document.getElementById('tituloCatalogo');
  const btnTodos = document.getElementById('btnVerTodos');
  if (!grid) return;

  const lista = categoriaId
    ? productos.filter(p => p.activo !== false && p.categoria === categoriaId)
    : productos.filter(p => p.activo !== false);

  if (titulo) {
    const cat = CATEGORIAS.find(c => c.id === categoriaId);
    titulo.textContent = cat ? cat.nombre : 'Todos los productos';
  }
  if (btnTodos) btnTodos.style.display = categoriaId ? 'inline-block' : 'none';

  if (lista.length === 0) {
    grid.innerHTML = `
      <div class="sin-productos">
        <div style="width:48px; height:48px; margin:0 auto 16px; color:var(--oliva);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21c-4.5 0-9-3-9-8 0-4 4-8 9-11 5 3 9 7 9 11 0 5-4.5 8-9 8z"/><path d="M12 21c-2.5 0-5-2-5-5.5 0-3 2.5-6 5-8.5 2.5 2.5 5 5.5 5 8.5 0 3.5-2.5 5.5-5 5.5z"/></svg>
        </div>
        <h3>Colección en preparación</h3>
        <p>Estamos incorporando nuevos artículos seleccionados a esta categoría.</p>
      </div>`;
    return;
  }

  grid.innerHTML = lista.map(p => `
    <article class="producto-tarjeta" role="listitem">
      <div class="producto-imagen">
        ${p.imagen 
          ? `<img src="${escHTML(p.imagen)}" alt="${escHTML(p.nombre)}" loading="lazy">` 
          : `<div class="producto-imagen-placeholder">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                 <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                 <circle cx="9" cy="9" r="2"/>
                 <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
               </svg>
               <span class="placeholder-texto">Foto próximamente</span>
             </div>`
        }
      </div>
      <div class="producto-cuerpo">
        <div class="producto-categoria">${escHTML(nombreCategoria(p.categoria))}</div>
        <div class="producto-nombre">${escHTML(p.nombre)}</div>
        <p class="producto-descripcion">${escHTML(p.descripcion || '')}</p>
        <div class="producto-precio">${formatearPrecio(p.precio)}</div>
      </div>
      <div class="producto-pie">
        <button class="btn-agregar" onclick="agregarAlCarrito('${p.id}')" aria-label="Agregar ${escHTML(p.nombre)} al carrito">
          <i class="bi bi-bag-plus"></i> Agregar
        </button>
      </div>
    </article>
  `).join('');
}

function verTodosProductos() {
  renderizarProductos(null);
  document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
}

function filtrarCategoria(id) {
  renderizarProductos(id);
  document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
}

/* ══════════════════════════════════════════════════════════════
   CATEGORÍAS
══════════════════════════════════════════════════════════════ */

function renderizarCategorias() {
  const grid = document.getElementById('categoriasGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(c => `
    <a href="#productos" class="categoria-tarjeta" onclick="filtrarCategoria('${c.id}')" role="listitem" aria-label="Ver productos de ${c.nombre}">
      <div class="categoria-icono">${c.icono}</div>
      <h3>${c.nombre}</h3>
    </a>
  `).join('');
}

/* ══════════════════════════════════════════════════════════════
   MENÚ HAMBURGUESA
══════════════════════════════════════════════════════════════ */

function cerrarMenu() {
  document.getElementById('menuMovil')?.classList.remove('abierto');
  document.getElementById('btnMenu')?.setAttribute('aria-expanded', 'false');
}

/* ══════════════════════════════════════════════════════════════
   COOKIES / AVISO
══════════════════════════════════════════════════════════════ */

function aceptarCookies() {
  localStorage.setItem('hhs_cookies', '1');
  document.getElementById('avisoCookies').style.display = 'none';
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */

function escHTML(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatearPrecio(precio) {
  return CONFIG.moneda === 'USD'
    ? `$${Number(precio).toFixed(2)}`
    : `Bs. ${Number(precio).toLocaleString('es-VE', { minimumFractionDigits: 2 })}`;
}

function nombreCategoria(id) {
  return CATEGORIAS.find(c => c.id === id)?.nombre ?? id;
}

function mostrarToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--verde-hoja);color:#fff;padding:10px 22px;border-radius:50px;font-size:0.85rem;z-index:400;box-shadow:0 4px 16px rgba(0,0,0,0.2);transition:opacity 0.4s';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 2200);
}

/* ══════════════════════════════════════════════════════════════
   BOTÓN DE WHATSAPP (cargado desde worker)
══════════════════════════════════════════════════════════════ */

async function cargarWhatsApp() {
  let wa = '';
  try {
    const r = await fetch(`${CONFIG.apiBase}/config`);
    if (r.ok) {
      const d = await r.json();
      if (d.whatsapp) wa = d.whatsapp;
    }
  } catch {}

  if (!wa) {
    const cfgOffline = localStorage.getItem('hhs_config_offline');
    if (cfgOffline) {
      try {
        const c = JSON.parse(cfgOffline);
        if (c.whatsapp) wa = c.whatsapp;
      } catch {}
    }
  }

  if (!wa) {
    wa = CONFIG.whatsapp;
  }

  if (wa) {
    CONFIG.whatsapp = wa;
    const btn = document.getElementById('btnContactoWa');
    if (btn) btn.href = `https://wa.me/${wa}?text=${encodeURIComponent('Hola, me gustaría saber más sobre sus productos.')}`;
  }
}

/* ══════════════════════════════════════════════════════════════
   INICIO
══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Año en pie
  const anio = document.getElementById('anioActual');
  if (anio) anio.textContent = new Date().getFullYear();

  // Carrito
  cargarCarrito();
  renderizarCarrito();

  // Carrito botones
  document.getElementById('btnAbrirCarrito')?.addEventListener('click', abrirCarrito);
  document.getElementById('btnCerrarCarrito')?.addEventListener('click', cerrarCarrito);
  document.getElementById('carritoOverlay')?.addEventListener('click', cerrarCarrito);

  // Menú hamburguesa
  document.getElementById('btnMenu')?.addEventListener('click', function () {
    const menu = document.getElementById('menuMovil');
    const abierto = menu?.classList.toggle('abierto');
    this.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });

  // Categorías y productos
  renderizarCategorias();
  cargarProductos();
  cargarWhatsApp();

  // Aviso cookies
  if (!localStorage.getItem('hhs_cookies')) {
    setTimeout(() => { document.getElementById('avisoCookies').style.display = 'flex'; }, 1500);
  }

  // Modal de pago
  inyectarModalPago();

  // Escape cierra carrito y modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      cerrarCarrito();
      cerrarModalPago();
    }
  });
});
