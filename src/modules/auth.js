/**
 * auth.js - Gestión de sesión, autenticación y delimitación de roles (Profesor / Estudiante)
 */

import { ApiService } from '../services/apiService.js';
import { msg } from '../ui/toast.js';

const STORAGE_KEY = 'sportforus_current_user';

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  applyRolePermissions();
}

export function isProfesor() {
  const user = getCurrentUser();
  return user && user.cargo === 'Profesor';
}

export function isEstudiante() {
  const user = getCurrentUser();
  return user && user.cargo === 'Estudiante';
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
  msg('Has cerrado sesión correctamente');
  applyRolePermissions();
}

/**
 * Aplica visibilidad y permisos en la interfaz según el cargo del usuario.
 */
export function applyRolePermissions() {
  const user = getCurrentUser();
  const authOverlay = document.getElementById('authOverlay');
  const userDisplayEl = document.getElementById('userDisplay');
  const userNameEl = document.getElementById('userName');
  const userRoleEl = document.getElementById('userRoleBadge');
  const btnLogout = document.getElementById('btnLogout');

  if (!user) {
    // Si no ha iniciado sesión, mostramos la pantalla inicial de autenticación
    if (authOverlay) authOverlay.classList.remove('d-none');
    if (userDisplayEl) userDisplayEl.classList.add('d-none');
    return;
  }

  // Usuario autenticado: ocultamos overlay
  if (authOverlay) authOverlay.classList.add('d-none');
  if (userDisplayEl) userDisplayEl.classList.remove('d-none');

  if (userNameEl) userNameEl.textContent = user.nombre || user.usuario;
  if (userRoleEl) {
    userRoleEl.textContent = user.cargo;
    userRoleEl.className = `badge-cyber ${user.cargo === 'Profesor' ? 'badge-profesor' : 'badge-estudiante'}`;
  }

  // ── DELIMITACIÓN DE FUNCIONES SEGÚN EL CARGO ───────────
  const isProf = user.cargo === 'Profesor';

  // 1. Botón "Nuevo Balón" (+ Balón): solo visible y operable para Profesores
  const btnNuevoBal = document.getElementById('btnNuevoBal');
  const sideNavNuevoBal = document.getElementById('sideNavNuevoBal');
  if (btnNuevoBal) btnNuevoBal.style.display = isProf ? 'inline-flex' : 'none';
  if (sideNavNuevoBal) sideNavNuevoBal.style.display = isProf ? 'flex' : 'none';

  // 2. Exportación de Respaldo SQL en el menú lateral: solo accesible para Profesores
  const sideNavExportSql = document.getElementById('sideNavExportSql');
  if (sideNavExportSql) sideNavExportSql.style.display = isProf ? 'flex' : 'none';

  // 3. Banner informativo de permisos para Estudiantes (Monitores)
  const roleNoticeEl = document.getElementById('roleNoticeBanner');
  if (roleNoticeEl) {
    if (!isProf) {
      roleNoticeEl.innerHTML = `
        <div class="alert-cyber info mb-3">
          <i class="bi bi-info-circle-fill me-2"></i>
          <strong>Modo Monitor (Estudiante):</strong> Tienes permisos para registrar <strong>Préstamos</strong>, <strong>Devoluciones</strong> y <strong>Reportar Daños</strong>. Las altas y bajas de inventario están reservadas a docentes.
        </div>`;
      roleNoticeEl.classList.remove('d-none');
    } else {
      roleNoticeEl.innerHTML = '';
      roleNoticeEl.classList.add('d-none');
    }
  }

  // Refresca las vistas para actualizar los botones de acción en las tablas
  if (window.renderInv) window.renderInv();
  if (window.renderMovs) window.renderMovs();
}

/**
 * Inicializa listeners del formulario de Login y Registro
 */
export function initAuth() {
  // Cambio de pestañas Login / Registro en la pantalla inicial
  const tabLoginBtn = document.getElementById('authTabLogin');
  const tabRegBtn   = document.getElementById('authTabRegister');
  const formLogin   = document.getElementById('formLogin');
  const formReg     = document.getElementById('formRegister');

  if (tabLoginBtn && tabRegBtn) {
    tabLoginBtn.addEventListener('click', () => {
      tabLoginBtn.classList.add('active');
      tabRegBtn.classList.remove('active');
      if (formLogin) formLogin.classList.remove('d-none');
      if (formReg) formReg.classList.add('d-none');
    });

    tabRegBtn.addEventListener('click', () => {
      tabRegBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      if (formReg) formReg.classList.remove('d-none');
      if (formLogin) formLogin.classList.add('d-none');
    });
  }

  // Procesar Login
  const btnSubmitLogin = document.getElementById('btnSubmitLogin');
  if (btnSubmitLogin) {
    btnSubmitLogin.addEventListener('click', async (e) => {
      e.preventDefault();
      const identificador = document.getElementById('loginUser')?.value.trim();
      const contrasena    = document.getElementById('loginPass')?.value.trim();

      if (!identificador || !contrasena) {
        msg('Por favor completa todos los campos de acceso.', 'err');
        return;
      }

      btnSubmitLogin.disabled = true;
      btnSubmitLogin.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Ingresando…';

      try {
        const r = await ApiService.login({ identificador, contrasena });
        if (!r.ok) {
          msg(r.error, 'err');
          return;
        }

        setCurrentUser(r.data);
        msg(`¡Bienvenido(a), ${r.data.nombre}! (${r.data.cargo})`, 'ok');
      } catch (err) {
        msg('Error de red al conectar con el servidor.', 'err');
      } finally {
        btnSubmitLogin.disabled = false;
        btnSubmitLogin.innerHTML = '<i class="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesión';
      }
    });
  }

  // Procesar Registro
  const btnSubmitReg = document.getElementById('btnSubmitRegister');
  if (btnSubmitReg) {
    btnSubmitReg.addEventListener('click', async (e) => {
      e.preventDefault();
      const usuario    = document.getElementById('regUser')?.value.trim();
      const correo     = document.getElementById('regEmail')?.value.trim();
      const nombre     = document.getElementById('regNombre')?.value.trim();
      const contrasena = document.getElementById('regPass')?.value.trim();
      const cargo      = document.getElementById('regCargo')?.value;

      if (!usuario || !correo || !nombre || !contrasena) {
        msg('Por favor diligencia todos los campos del registro.', 'err');
        return;
      }

      btnSubmitReg.disabled = true;
      btnSubmitReg.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Registrando…';

      try {
        const r = await ApiService.register({ usuario, correo, nombre, contrasena, cargo });
        if (!r.ok) {
          msg(r.error, 'err');
          return;
        }

        setCurrentUser(r.data);
        msg(`Registro exitoso. ¡Bienvenido, ${r.data.nombre}!`, 'ok');
      } catch (err) {
        msg('Error al procesar el registro.', 'err');
      } finally {
        btnSubmitReg.disabled = false;
        btnSubmitReg.innerHTML = '<i class="bi bi-person-check-fill me-1"></i> Completar Registro';
      }
    });
  }

  // Botón Cerrar Sesión
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  // Píldoras de credenciales de prueba rápida (Demo)
  const pillProf = document.getElementById('pillDemoProfesor');
  if (pillProf) {
    pillProf.addEventListener('click', () => {
      document.getElementById('loginUser').value = 'Daniel';
      document.getElementById('loginPass').value = 'Tests123';
      msg('Credenciales de Profesor (Daniel) cargadas', 'ok');
    });
  }

  const pillEst = document.getElementById('pillDemoEstudiante');
  if (pillEst) {
    pillEst.addEventListener('click', () => {
      document.getElementById('loginUser').value = 'Alejandro';
      document.getElementById('loginPass').value = 'Tests123';
      msg('Credenciales de Estudiante (Alejandro) cargadas', 'ok');
    });
  }

  // Aplicar permisos iniciales según el estado en almacenamiento
  applyRolePermissions();
}
