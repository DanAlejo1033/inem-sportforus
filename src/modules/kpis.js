/**
 * kpis.js - Gestión y actualización visual de los indicadores clave de rendimiento (KPIs)
 */

import { ApiService } from '../services/apiService.js';
import { SELECTORS } from '../config/constants.js';

export async function loadKPIs() {
  const r = await ApiService.getKPIs();
  if (!r.ok) return;

  const totalEl = document.querySelector(SELECTORS.KPI_TOTAL);
  const dispEl  = document.querySelector(SELECTORS.KPI_DISPONIBLES);
  const prestEl = document.querySelector(SELECTORS.KPI_PRESTAMO);
  const danEl   = document.querySelector(SELECTORS.KPI_DANADOS);

  if (totalEl) totalEl.textContent = r.data.total || 0;
  if (dispEl)  dispEl.textContent  = r.data.disponibles || 0;
  if (prestEl) prestEl.textContent = r.data.prestamo || 0;
  if (danEl)   danEl.textContent   = r.data.danados || 0;
}
