/**
 * constants.js - Constantes y configuración global del sistema INEM SportForUs.
 */

export const API_URL = 'api.php';

export const PAGINATION = {
  INV_ITEMS_PER_PAGE: 10
};

export const ESTADOS = {
  DISPONIBLE: 'Disponible',
  PRESTAMO: 'Préstamo',
  DANADO: 'Dañado',
  DEVUELTO: 'Devuelto'
};

export const SELECTORS = {
  TB_MOV: '#tbMov',
  TB_INV: '#tbInv',
  INV_INFO: '#invInfo',
  INV_PAG: '#invPag',
  KPI_TOTAL: '#kpiTotal',
  KPI_DISPONIBLES: '#kpiDisponibles',
  KPI_PRESTAMO: '#kpiPrestamo',
  KPI_DANADOS: '#kpiDanados',
  LOADING_DB: '#loading-db'
};
