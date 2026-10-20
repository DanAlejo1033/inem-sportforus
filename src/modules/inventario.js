/**
 * inventario.js - Gestión, renderizado, paginación y operaciones del inventario de balones
 */

import { ApiService } from '../services/apiService.js';
import { PAGINATION, ESTADOS } from '../config/constants.js';
import { badge, matchQuery } from '../ui/uiHelpers.js';
import { msg } from '../ui/toast.js';
import { isProfesor } from './auth.js';

let allInv = [];
let invCurrentPage = 1;

export function getAllInv() {
  return allInv;
}

export function nextCodigoInem() {
  let max = 0;
  allInv.forEach(b => {
    const m = /^INEM-(\d+)$/i.exec((b.codigo || '').trim());
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  const next = String(max + 1).padStart(3, '0');
  return `INEM-${next}`;
}

export async function loadInv() {
  const r = await ApiService.getInventario();
  allInv = r.ok ? r.data : [];
  renderInv(1);
  fillSelects();
}

export function renderInv(page = 1) {
  invCurrentPage = page;
  const qEl    = document.querySelector('#qInv');
  const estEl  = document.querySelector('#sInvEst');
  const tipoEl = document.querySelector('#sInvTipo');
  const tb     = document.querySelector('#tbInv');
  const infoEl = document.querySelector('#invInfo');
  const pagEl  = document.querySelector('#invPag');

  if (!tb) return;

  const q    = (qEl?.value || '').toLowerCase();
  const est  = estEl?.value || '';
  const tipo = tipoEl?.value || '';

  const filteredRows = allInv
    .filter(b => !est || b.estado === est)
    .filter(b => !tipo || b.tipo === tipo)
    .filter(b => matchQuery(b.codigo, (b.tipo + (b.obs || '')), q));

  if (!filteredRows.length) {
    tb.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="bi bi-database-slash"></i><p>Sin registros</p></div></td></tr>`;
    if (infoEl) infoEl.textContent = 'Mostrando 0 registros';
    if (pagEl) pagEl.innerHTML = '';
    return;
  }

  const totalItems = filteredRows.length;
  const totalPages = Math.ceil(totalItems / PAGINATION.INV_ITEMS_PER_PAGE);

  if (invCurrentPage > totalPages) invCurrentPage = totalPages;
  if (invCurrentPage < 1) invCurrentPage = 1;

  const startIndex = (invCurrentPage - 1) * PAGINATION.INV_ITEMS_PER_PAGE;
  const endIndex   = Math.min(startIndex + PAGINATION.INV_ITEMS_PER_PAGE, totalItems);
  const pageRows   = filteredRows.slice(startIndex, endIndex);

  tb.innerHTML = pageRows.map((b, i) => `
    <tr>
      <td style="color:var(--text-muted);font-size:.75rem">${startIndex + i + 1}</td>
      <td><span class="mono">${b.codigo}</span></td>
      <td>${b.tipo}</td>
      <td>${badge(b.estado)}</td>
      <td style="color:var(--text-muted);font-size:.78rem">${b.obs || '—'}</td>
      <td style="color:var(--text-muted);font-size:.75rem">${new Date(b.creado_en).toLocaleDateString('es-CO')}</td>
      <td>
        ${b.estado === ESTADOS.DANADO && isProfesor()
          ? `<button class="btn-cyber danger" style="padding:.22rem .55rem;font-size:.72rem" onclick="window.delBal('${b.id}','${b.codigo}','${b.estado}')" title="Eliminar balón definitivamente"><i class="bi bi-trash"></i></button>`
          : ''}
      </td>
    </tr>`).join('');

  if (infoEl) {
    infoEl.textContent = `Mostrando ${startIndex + 1}–${endIndex} de ${totalItems} balones`;
  }

  if (pagEl) {
    let pagHTML = '';
    pagHTML += `<button class="btn-cyber ${invCurrentPage === 1 ? 'disabled' : ''}" style="padding:.2rem .5rem" onclick="window.renderInv(${invCurrentPage - 1})"><i class="bi bi-chevron-left"></i></button>`;

    for (let p = 1; p <= totalPages; p++) {
      pagHTML += `<button class="btn-cyber ${p === invCurrentPage ? 'primary' : ''}" style="padding:.2rem .6rem" onclick="window.renderInv(${p})">${p}</button>`;
    }

    pagHTML += `<button class="btn-cyber ${invCurrentPage === totalPages ? 'disabled' : ''}" style="padding:.2rem .5rem" onclick="window.renderInv(${invCurrentPage + 1})"><i class="bi bi-chevron-right"></i></button>`;

    pagEl.innerHTML = pagHTML;
  }
}

export function fillSelects() {
  const pSel = document.querySelector('#pBal');
  if (pSel) {
    pSel.innerHTML = '';
    const disp = allInv.filter(b => b.estado === ESTADOS.DISPONIBLE);
    if (!disp.length) {
      pSel.innerHTML = '<option value="">Sin balones disponibles</option>';
    } else {
      disp.forEach(b => {
        const o = document.createElement('option');
        o.value = b.codigo;
        o.textContent = `${b.codigo} · ${b.tipo}`;
        pSel.appendChild(o);
      });
    }
  }

  const nSel = document.querySelector('#nBal');
  if (nSel) {
    nSel.innerHTML = '';
    // Excluye balones Dañados o en Préstamo
    const nd = allInv.filter(b => b.estado !== ESTADOS.DANADO && b.estado !== ESTADOS.PRESTAMO);
    if (!nd.length) {
      nSel.innerHTML = '<option value="">Sin balones elegibles</option>';
    } else {
      nd.forEach(b => {
        const o = document.createElement('option');
        o.value = b.codigo;
        o.textContent = `${b.codigo} · ${b.tipo} (${b.estado})`;
        nSel.appendChild(o);
      });
    }
  }
}

export async function delBal(id, codigo, estado, onReload) {
  if (!isProfesor()) {
    msg('Acción restringida: Solo los profesores pueden dar de baja balones del inventario.', 'err');
    return;
  }
  if (estado !== ESTADOS.DANADO) { 
    msg('Solo se pueden eliminar balones que estén marcados como Dañados.', 'err'); 
    return; 
  }
  if (!confirm(`¿Eliminar el balón ${codigo} del inventario? Esta acción no se puede deshacer.`)) return;
  const r = await ApiService.eliminarBalon(id);
  if (!r.ok) {
    msg(r.error, 'err');
    return;
  }
  if (typeof onReload === 'function') {
    await onReload();
  } else {
    await loadInv();
  }
  msg(`Balón ${codigo} eliminado`);
}
