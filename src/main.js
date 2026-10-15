/**
 * main.js - Orquestador y punto de entrada de la aplicación INEM SportForUs.
 * Coordina navegación de pestañas, carga de datos, modales y enlace de eventos del DOM.
 */

import { SELECTORS } from './config/constants.js';
import { ApiService } from './services/apiService.js';
import { msg, closeM } from './ui/toast.js';
import { loadKPIs } from './modules/kpis.js';
import { loadMovs, renderMovs, quickDev, delMov } from './modules/movimientos.js';
import { loadInv, renderInv, nextCodigoInem, delBal } from './modules/inventario.js';

/* ── Pestañas (Tabs) ── */
export function goTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

  const tabBtn = document.getElementById(`tab-${name}`);
  const tabPane = document.getElementById(`pane-${name}`);
  if (tabBtn) tabBtn.classList.add('active');
  if (tabPane) tabPane.classList.add('active');
}

export function filterInv(estado) {
  const sInvEst = document.querySelector('#sInvEst');
  if (sInvEst) sInvEst.value = estado;
  goTab('inventario');
  renderInv(1);
}

/* ── Carga General de Datos ── */
export async function loadAll() {
  await Promise.all([loadKPIs(), loadMovs(), loadInv()]);
}

/* ── Inicialización del Sistema ── */
export async function init() {
  try {
    await loadAll();
  } catch (err) {
    msg('Error al conectar con la base de datos', 'err');
    console.error('Error inicializando sistema:', err);
  } finally {
    const loader = document.querySelector(SELECTORS.LOADING_DB);
    if (loader) loader.classList.add('hidden');
  }
}

/* ── Registro de Event Listeners ── */
function setupEventListeners() {
  // Modal Nuevo Balón: generar código correlativo automático
  const mBal = document.getElementById('mBal');
  if (mBal) {
    mBal.addEventListener('show.bs.modal', () => {
      const bCod = document.querySelector('#bCod');
      if (bCod) bCod.value = nextCodigoInem();
    });
  }

  // Guardar Nuevo Balón
  const btnBal = document.querySelector('#btnBal');
  if (btnBal) {
    btnBal.addEventListener('click', async () => {
      const bCod = document.querySelector('#bCod');
      const bTipo = document.querySelector('#bTipo');
      const bEst = document.querySelector('#bEst');
      const bObs = document.querySelector('#bObs');

      const payload = {
        codigo: bCod?.value || '',
        tipo: bTipo?.value || '',
        estado: bEst?.value || 'Disponible',
        obs: bObs?.value || ''
      };

      const r = await ApiService.crearBalon(payload);
      if (!r.ok) {
        msg(r.error, 'err');
        return;
      }
      if (bCod) bCod.value = '';
      if (bObs) bObs.value = '';
      closeM('mBal');
      await loadAll();
      msg(`Balón ${r.data.codigo} registrado`);
    });
  }

  // Registrar Préstamo
  const btnPre = document.querySelector('#btnPre');
  if (btnPre) {
    btnPre.addEventListener('click', async () => {
      const payload = {
        codigo: document.querySelector('#pBal')?.value || '',
        persona: document.querySelector('#pPer')?.value || '',
        documento: document.querySelector('#pDoc')?.value || '',
        area: document.querySelector('#pArea')?.value || '',
        docente: document.querySelector('#pDoc2')?.value || '',
        fecha: document.querySelector('#pFec')?.value || ''
      };

      const r = await ApiService.registrarPrestamo(payload);
      if (!r.ok) {
        msg(r.error, 'err');
        return;
      }

      ['pPer', 'pDoc', 'pArea', 'pDoc2', 'pFec'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });

      closeM('mPre');
      await loadAll();
      msg('Préstamo registrado correctamente');
    });
  }

  // Registrar Devolución
  const btnDev = document.querySelector('#btnDev');
  if (btnDev) {
    btnDev.addEventListener('click', async () => {
      const dCod = document.querySelector('#dCod');
      const dObs = document.querySelector('#dObs');

      const payload = {
        codigo: dCod?.value || '',
        obs: dObs?.value || ''
      };

      const r = await ApiService.registrarDevolucion(payload);
      if (!r.ok) {
        msg(r.error, 'err');
        return;
      }

      if (dCod) dCod.value = '';
      if (dObs) dObs.value = '';

      closeM('mDev');
      await loadAll();
      msg('Devolución registrada correctamente');
    });
  }

  // Marcar Balón Dañado
  const btnDan = document.querySelector('#btnDan');
  if (btnDan) {
    btnDan.addEventListener('click', async () => {
      const nBal = document.querySelector('#nBal');
      const nObs = document.querySelector('#nObs');

      const payload = {
        codigo: nBal?.value || '',
        obs: nObs?.value || ''
      };

      const r = await ApiService.marcarDanado(payload);
      if (!r.ok) {
        msg(r.error, 'err');
        return;
      }

      if (nObs) nObs.value = '';
      closeM('mDan');
      await loadAll();
      msg('Balón marcado como dañado', 'w');
    });
  }

  // Filtros de Movimientos
  document.querySelector('#qMov')?.addEventListener('input', renderMovs);
  document.querySelector('#sDep')?.addEventListener('change', renderMovs);
  document.querySelector('#sEst')?.addEventListener('change', renderMovs);

  // Filtros de Inventario
  document.querySelector('#qInv')?.addEventListener('input', () => renderInv(1));
  document.querySelector('#sInvEst')?.addEventListener('change', () => renderInv(1));
  document.querySelector('#sInvTipo')?.addEventListener('change', () => renderInv(1));
}

/* ── Exponer helpers en window para preservar enlaces inline del HTML ── */
window.goTab = goTab;
window.filterInv = filterInv;
window.quickDev = quickDev;
window.delMov = delMov;
window.delBal = (id, codigo, estado) => delBal(id, codigo, estado, loadAll);
window.renderInv = renderInv;

// Arrancar sistema
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    init();
  });
} else {
  setupEventListeners();
  init();
}
