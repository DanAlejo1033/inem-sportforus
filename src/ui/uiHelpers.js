/**
 * uiHelpers.js - Renderizado de badges y utilidades de búsqueda/filtrado
 */

import { ESTADOS } from '../config/constants.js';

export function badge(estado) {
  const mapClass = {
    [ESTADOS.PRESTAMO]: 'badge-prestamo',
    [ESTADOS.DISPONIBLE]: 'badge-disponible',
    [ESTADOS.DANADO]: 'badge-danado',
    [ESTADOS.DEVUELTO]: 'badge-devuelto'
  };
  const cssClass = mapClass[estado] || 'badge-devuelto';
  return `<span class="badge-cyber ${cssClass}">${estado}</span>`;
}

export function matchQuery(codigo, restText, query) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (/^\d+$/.test(q)) {
    const soloNums = (codigo || '').replace(/\D/g, '');
    return soloNums.includes(q);
  }
  return ((codigo || '') + restText).toLowerCase().includes(q);
}
