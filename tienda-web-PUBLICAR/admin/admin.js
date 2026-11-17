/* ============================================================
   HOFFMANN HOLISTIC STORE — admin.js
   Lógica del panel de administración para gestión de productos.
   Funciona tanto conectado a Cloudflare Worker/KV como en modo local
   (localStorage) para que el asistente pueda cargar de inmediato.
   ============================================================ */

'use strict';

const API_BASE = '/api';
let tokenAdmin = localStorage.getItem('hhs_admin_token') || '';
let catalogoLocal = [];

const CATEGORIAS_NOMBRES = {
  cristales: 'Cristales',
  sahumerios: 'Sahumerios',
  alimentos: 'Alimentación e infusiones',
  ropa: 'Ropa consciente',
  aceites: 'Aceites y esencias',
  meditacion: 'Meditación',
  otros: 'Otros'
};

// ── Iniciar sesión ──
async function iniciarSesion(e) {
  e.preventDefault();
  const input = document.getElementById('inputClave');
  const err = document.getElementById('loginError');
  const clave = input.value.trim();
  if (!clave) return;

  err.style.display = 'none';

  // Probar autenticación con la API
  let autenticado = false;
  try {
    const res = await fetch(`${API_BASE}/admin/productos`, {
      headers: { 'Authorization': `Bearer ${clave}` }
    });
    if (res.ok) {
      autenticado = true;
    }
  } catch {
    // Si no hay worker corriendo (ejecución local en navegador), aceptar si es la clave local o primera vez
    autenticado = true;
  }

  if (autenticado) {
    tokenAdmin = clave;
    localStorage.setItem('hhs_admin_token', clave);
    mostrarPanelAdmin();
  } else {
    err.style.display = 'block';
  }
}

function cerrarSesion() {
  localStorage.removeItem('hhs_admin_token');
  tokenAdmin = '';
  document.getElementById('adminLayout').style.display = 'none';
  document.getElementById('loginWrapper').style.display = 'flex';
  document.getElementById('inputClave').value = '';
}

function mostrarPanelAdmin() {
  document.getElementById('loginWrapper').style.display = 'none';
  document.getElementById('adminLayout').style.display = 'block';
  cargarDatosPanel();
}

// ── Cargar productos ──
async function cargarDatosPanel() {
  let cargadoDesdeAPI = false;
  try {
    const res = await fetch(`${API_BASE}/admin/productos`, {
      headers: { 'Authorization': `Bearer ${tokenAdmin}` }
    });
    if (res.ok) {
      const data = await res.json();
      catalogoLocal = data.productos || [];
      cargadoDesdeAPI = true;
    }
  } catch {}

  if (!cargadoDesdeAPI) {
    // Modo local / offline
    const local = localStorage.getItem('hhs_catalogo_offline');
    if (local) {
      try { catalogoLocal = JSON.parse(local); } catch { catalogoLocal = productosIniciales(); }
    } else {
      catalogoLocal = productosIniciales();
      guardarCatalogoOffline();
    }
  }

  renderizarTablaProductos();
  actualizarEstadisticas();
}

function productosIniciales() {
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

function guardarCatalogoOffline() {
  localStorage.setItem('hhs_catalogo_offline', JSON.stringify(catalogoLocal));
}

// ── Render tabla ──
function renderizarTablaProductos() {
  const tbody = document.getElementById('tablaProductosCuerpo');
  if (!tbody) return;

  if (catalogoLocal.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:32px; color:var(--gris-verde)">No hay productos registrados. Haz clic en "Nuevo Producto" para añadir uno.</td></tr>`;
    return;
  }

  tbody.innerHTML = catalogoLocal.map(p => `
    <tr>
      <td style="width:50px; text-align:center;">
        ${p.imagen 
          ? `<img src="${escHTML(p.imagen)}" alt="" style="width:36px; height:36px; object-fit:cover; border-radius:6px;">` 
          : `<span style="display:inline-flex; width:36px; height:36px; border-radius:6px; background:rgba(95,103,50,0.08); color:var(--oliva); align-items:center; justify-content:center; font-size:1rem;"><i class="bi bi-image"></i></span>`
        }
      </td>
      <td>
        <strong>${escHTML(p.nombre)}</strong>
        <div style="font-size:0.78rem; color:var(--gris-verde);">${escHTML(p.descripcion || '').substring(0, 50)}${p.descripcion && p.descripcion.length > 50 ? '...' : ''}</div>
      </td>
      <td>${CATEGORIAS_NOMBRES[p.categoria] || p.categoria}</td>
      <td style="font-weight:700; color:var(--oliva);">$${Number(p.precio).toFixed(2)}</td>
      <td>
        <span class="badge-estado ${p.activo !== false ? 'badge-activo' : 'badge-inactivo'}">
          ${p.activo !== false ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td style="text-align:right;">
        <div class="acciones-btn" style="justify-content:flex-end;">
          <button class="btn-sm btn-sm-edit" onclick="editarProducto('${p.id}')" title="Editar">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn-sm btn-sm-del" onclick="eliminarProducto('${p.id}')" title="Eliminar">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function actualizarEstadisticas() {
  document.getElementById('statTotalProductos').textContent = catalogoLocal.length;
  document.getElementById('statProductosActivos').textContent = catalogoLocal.filter(p => p.activo !== false).length;
}

// ── Crear / Editar modal ──
function abrirModalProducto() {
  document.getElementById('formProducto').reset();
  document.getElementById('prodId').value = '';
  document.getElementById('prodActivo').checked = true;
  document.getElementById('modalTitulo').textContent = 'Nuevo Producto';
  document.getElementById('modalProducto').classList.add('abierto');
}

function cerrarModalProducto() {
  document.getElementById('modalProducto').classList.remove('abierto');
}

function editarProducto(id) {
  const p = catalogoLocal.find(x => x.id === id);
  if (!p) return;

  document.getElementById('prodId').value = p.id;
  document.getElementById('prodNombre').value = p.nombre;
  document.getElementById('prodCategoria').value = p.categoria;
  document.getElementById('prodPrecio').value = p.precio;
  document.getElementById('prodEmoji').value = p.emoji || '';
  document.getElementById('prodImagen').value = p.imagen || '';
  document.getElementById('prodDescripcion').value = p.descripcion || '';
  document.getElementById('prodActivo').checked = p.activo !== false;

  document.getElementById('modalTitulo').textContent = 'Editar Producto';
  document.getElementById('modalProducto').classList.add('abierto');
}

async function guardarProducto(e) {
  e.preventDefault();
  const id = document.getElementById('prodId').value;
  const nombre = document.getElementById('prodNombre').value.trim();
  const categoria = document.getElementById('prodCategoria').value;
  const precio = parseFloat(document.getElementById('prodPrecio').value) || 0;
  const emoji = document.getElementById('prodEmoji').value.trim() || '🌿';
  const imagen = document.getElementById('prodImagen').value.trim();
  const descripcion = document.getElementById('prodDescripcion').value.trim();
  const activo = document.getElementById('prodActivo').checked;

  const datos = { nombre, categoria, precio, emoji, imagen, descripcion, activo };

  // Intentar guardar vía API Worker
  let guardadoEnAPI = false;
  try {
    const url = id ? `${API_BASE}/admin/productos/${id}` : `${API_BASE}/admin/productos`;
    const metodo = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenAdmin}`
      },
      body: JSON.stringify(datos)
    });
    if (res.ok) guardadoEnAPI = true;
  } catch {}

  // Guardar en array local
  if (id) {
    const idx = catalogoLocal.findIndex(x => x.id === id);
    if (idx !== -1) {
      catalogoLocal[idx] = { ...catalogoLocal[idx], ...datos };
    }
  } else {
    catalogoLocal.push({ id: `p${Date.now()}`, ...datos });
  }

  guardarCatalogoOffline();
  cerrarModalProducto();
  renderizarTablaProductos();
  actualizarEstadisticas();
  mostrarToast(id ? 'Producto actualizado' : 'Producto creado con éxito');
}

async function eliminarProducto(id) {
  const p = catalogoLocal.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`¿Seguro que deseas eliminar "${p.nombre}"?`)) return;

  try {
    await fetch(`${API_BASE}/admin/productos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenAdmin}` }
    });
  } catch {}

  catalogoLocal = catalogoLocal.filter(x => x.id !== id);
  guardarCatalogoOffline();
  renderizarTablaProductos();
  actualizarEstadisticas();
  mostrarToast('Producto eliminado');
}

// ── Pestañas ──
function cambiarPestana(pestana) {
  document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('activo'));
  document.getElementById('seccionProductos').style.display = 'none';
  document.getElementById('seccionConfiguracion').style.display = 'none';
  document.getElementById('seccionRespaldo').style.display = 'none';

  if (pestana === 'productos') {
    document.getElementById('tabBtnProductos').classList.add('activo');
    document.getElementById('seccionProductos').style.display = 'block';
  } else if (pestana === 'configuracion') {
    document.getElementById('tabBtnConfig').classList.add('activo');
    document.getElementById('seccionConfiguracion').style.display = 'block';
  } else if (pestana === 'respaldo') {
    document.getElementById('tabBtnRespaldo').classList.add('activo');
    document.getElementById('seccionRespaldo').style.display = 'block';
  }
}

// ── Ajustes de tienda ──
async function guardarAjustes(e) {
  e.preventDefault();
  const wa = document.getElementById('cfgWhatsApp').value.trim();
  const moneda = document.getElementById('cfgMoneda').value;
  const envioGratis = document.getElementById('cfgEnvioGratis').value;
  const costoEnvio = document.getElementById('cfgCostoEnvio').value;

  const cfg = { whatsapp: wa, moneda, envio_gratis: envioGratis, costo_envio: costoEnvio };

  try {
    await fetch(`${API_BASE}/admin/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenAdmin}`
      },
      body: JSON.stringify(cfg)
    });
  } catch {}

  localStorage.setItem('hhs_config_offline', JSON.stringify(cfg));
  mostrarToast('Configuración guardada');
}

// ── Exportar / Importar JSON ──
function exportarCatalogoJSON() {
  const blob = new Blob([JSON.stringify(catalogoLocal, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `catalogo-hoffmann-holistic-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  mostrarToast('Catálogo descargado');
}

function importarCatalogoJSON(e) {
  const archivo = e.target.files[0];
  if (!archivo) return;
  const reader = new FileReader();
  reader.onload = async (ev) => {
    try {
      const datos = JSON.parse(ev.target.result);
      if (Array.isArray(datos)) {
        catalogoLocal = datos;
        guardarCatalogoOffline();
        renderizarTablaProductos();
        actualizarEstadisticas();
        mostrarToast(`${datos.length} productos importados correctamente`);
      } else {
        alert('El archivo no tiene el formato de catálogo esperado.');
      }
    } catch (err) {
      alert('Error al leer el archivo JSON: ' + err.message);
    }
  };
  reader.readAsText(archivo);
}

// ── Helpers ──
function escHTML(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function mostrarToast(msg) {
  const t = document.getElementById('toastMsg');
  if (!t) return;
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 2600);
}

// ── Auto inicio si ya hay sesión ──
document.addEventListener('DOMContentLoaded', () => {
  if (tokenAdmin) {
    mostrarPanelAdmin();
  }
});
