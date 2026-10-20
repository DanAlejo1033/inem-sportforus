/**
 * movimientos.js - Gestión, renderizado y operaciones sobre el historial de movimientos y préstamos
 */

import { ApiService } from '../services/apiService.js';
import { badge, matchQuery } from '../ui/uiHelpers.js';
import { msg } from '../ui/toast.js';
import { isProfesor } from './auth.js';

let allMovs = [];

export async function loadMovs() {
  const r = await ApiService.getMovimientos();
  allMovs = r.ok ? r.data : [];
  renderMovs();
}

export function renderMovs() {
  const qEl   = document.querySelector('#qMov');
  const depEl = document.querySelector('#sDep');
  const estEl = document.querySelector('#sEst');
  const tb    = document.querySelector('#tbMov');

  if (!tb) return;

  const q   = (qEl?.value || '').toLowerCase();
  const dep = depEl?.value || '';
  const est = estEl?.value || '';

  const rows = allMovs
    .filter(m => !dep || m.tipo === dep)
    .filter(m => !est || m.estado === est)
    .filter(m => matchQuery(m.codigo, ((m.tipo || '') + (m.persona || '') + (m.documento || '') + (m.area || '') + (m.docente || '')), q));

  if (!rows.length) {
    tb.innerHTML = `<tr><td colspan="10"><div class="empty-state"><i class="bi bi-database-slash"></i><p>Sin registros</p></div></td></tr>`;
    return;
  }

  tb.innerHTML = rows.map((m, i) => `
    <tr>
      <td style="color:var(--text-muted);font-size:.75rem">${i + 1}</td>
      <td><span class="mono">${m.codigo}</span></td>
      <td>${m.tipo || '-'}</td>
      <td>${m.persona || '-'}</td>
      <td style="color:var(--text-muted);font-size:.78rem">${m.documento || '-'}</td>
      <td style="font-size:.78rem">${m.area || '-'}</td>
      <td style="font-size:.78rem">${m.docente || '-'}</td>
      <td style="color:var(--text-muted);font-size:.75rem">${new Date(m.fecha).toLocaleString('es-CO')}</td>
      <td>${badge(m.estado)}</td>
      <td>
        <div style="display:flex;gap:.4rem">
          ${m.estado === 'Préstamo' && isProfesor() ? `<button class="btn-cyber warning" style="padding:.22rem .55rem;font-size:.72rem" onclick="window.quickDev('${m.codigo}')" title="Devolver balón"><i class="bi bi-arrow-return-left"></i></button>` : ''}
          ${isProfesor() ? `<button class="btn-cyber danger" style="padding:.22rem .55rem;font-size:.72rem" onclick="window.delMov('${m.id}')" title="Eliminar registro"><i class="bi bi-trash"></i></button>` : ''}
        </div>
      </td>
    </tr>`).join('');
}

export function quickDev(codigo) {
  if (!isProfesor()) {
    msg('Acción restringida: Por seguridad institucional, las devoluciones solo pueden ser recibidas y verificadas por un Profesor.', 'err');
    return;
  }
  const dCodInput = document.querySelector('#dCod');
  if (dCodInput) dCodInput.value = codigo;
  const modalEl = document.querySelector('#mDev');
  if (modalEl) new bootstrap.Modal(modalEl).show();
}

export async function delMov(id) {
  if (!isProfesor()) {
    msg('Acción restringida: Solo los profesores pueden eliminar registros del historial.', 'err');
    return;
  }
  if (!confirm('¿Eliminar este registro?')) return;
  const r = await ApiService.eliminarMovimiento(id);
  if (!r.ok) {
    msg(r.error, 'err');
    return;
  }
  await loadMovs();
  msg('Registro eliminado');
}
