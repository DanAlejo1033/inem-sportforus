/**
 * kpis.js - Gestión y actualización visual de los indicadores clave de rendimiento (KPIs)
 */

import { ApiService } from '../services/apiService.js';
import { SELECTORS } from '../config/constants.js';
import { isProfesor } from './auth.js';

let lastKpiData = null;

export function refreshKpiDisplay() {
  if (!lastKpiData) return;

  const totalEl    = document.querySelector(SELECTORS.KPI_TOTAL);
  const dispEl     = document.querySelector(SELECTORS.KPI_DISPONIBLES);
  const prestEl    = document.querySelector(SELECTORS.KPI_PRESTAMO);
  const danEl      = document.querySelector(SELECTORS.KPI_DANADOS);
  const totalLabel = document.querySelector('#kpiTotalLabel');
  const totalSub   = document.querySelector('#kpiTotalSub');
  const totalHint  = document.querySelector('#kpiTotalHint');

  const isProf = isProfesor();
  const disponibles = parseInt(lastKpiData.disponibles || 0, 10);
  const prestamo    = parseInt(lastKpiData.prestamo || 0, 10);
  const danados     = parseInt(lastKpiData.danados || 0, 10);
  const totalGlobal = parseInt(lastKpiData.total || 0, 10);

  // Para el estudiante, el total representa los balones activos/habilitados (Disponibles + Préstamo)
  // coincidiendo exactamente con la cantidad de balones que él ve en la tabla de inventario
  const totalVisible = isProf ? totalGlobal : (disponibles + prestamo);

  if (totalEl) totalEl.textContent = totalVisible;
  if (dispEl)  dispEl.textContent  = disponibles;
  if (prestEl) prestEl.textContent = prestamo;
  if (danEl)   danEl.textContent   = danados;

  if (totalLabel) {
    totalLabel.textContent = isProf ? 'Total Balones' : 'Balones Activos';
  }
  if (totalSub) {
    totalSub.innerHTML = isProf
      ? '<i class="bi bi-collection"></i> Inventario registrado'
      : '<i class="bi bi-shield-check"></i> En servicio escolar';
  }
  if (totalHint) {
    totalHint.innerHTML = isProf
      ? '<i class="bi bi-arrow-right-circle"></i> Ver inventario completo'
      : '<i class="bi bi-arrow-right-circle"></i> Ver balones activos';
  }
}

export async function loadKPIs() {
  const r = await ApiService.getKPIs();
  if (!r.ok) return;
  lastKpiData = r.data;
  refreshKpiDisplay();
}

window.refreshKpiDisplay = refreshKpiDisplay;
