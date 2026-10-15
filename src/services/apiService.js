/**
 * apiService.js - Capa de comunicación HTTP con la API REST (api.php)
 */

import { API_URL } from '../config/constants.js';

export async function apiFetch(action, method = 'GET', body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) {
    opts.body = JSON.stringify(body);
  }
  const response = await fetch(`${API_URL}?action=${action}`, opts);
  return response.json();
}

export const ApiService = {
  getKPIs: () => apiFetch('kpis'),
  getMovimientos: () => apiFetch('movimientos'),
  getInventario: () => apiFetch('inventario'),
  getDisponibles: () => apiFetch('disponibles'),
  getNoDanados: () => apiFetch('no_danados'),
  crearBalon: (data) => apiFetch('nuevo_balon', 'POST', data),
  registrarPrestamo: (data) => apiFetch('prestamo', 'POST', data),
  registrarDevolucion: (data) => apiFetch('devolucion', 'POST', data),
  marcarDanado: (data) => apiFetch('danado', 'POST', data),
  eliminarBalon: (id) => apiFetch(`del_balon&id=${encodeURIComponent(id)}`, 'DELETE'),
  eliminarMovimiento: (id) => apiFetch(`del_mov&id=${encodeURIComponent(id)}`, 'DELETE')
};
