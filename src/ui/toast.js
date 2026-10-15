/**
 * toast.js - Sistema de notificaciones flotantes (CyberToast) y control de modales
 */

let toastTimer = null;

export function msg(text, type = 'ok') {
  const icon = document.querySelector('#toastIcon');
  const toastMsg = document.querySelector('#toastMsg');
  const toastEl = document.querySelector('#cyberToast');

  if (!icon || !toastMsg || !toastEl) return;

  icon.className = type === 'err' 
    ? 'bi bi-x-circle-fill' 
    : type === 'w' 
      ? 'bi bi-exclamation-triangle-fill' 
      : 'bi bi-check-circle-fill';

  icon.style.color = type === 'err' 
    ? '#b05060' 
    : type === 'w' 
      ? '#c9942a' 
      : '#4a9a6a';

  toastMsg.textContent = text;
  toastEl.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 3200);
}

export function closeM(modalId) {
  const modalEl = document.getElementById(modalId);
  if (!modalEl) return;
  const instance = bootstrap.Modal.getInstance(modalEl);
  if (instance) {
    instance.hide();
  }
}
