@echo off
title Subir INEM SportForUs a GitHub
echo ========================================================
echo       SUBIENDO INEM SPORTFORUS A GITHUB
echo ========================================================
echo.
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo No hay ningun repositorio de GitHub vinculado todavia.
    echo.
    echo 1. Entra a tu cuenta en: https://github.com/new
    echo 2. Dale un nombre (ejemplo: balones o inem-sportforus) y crealo vacio.
    echo 3. Copia y pega aqui la URL de ese repositorio:
    echo.
    set /p REPO_URL="Pega la URL de GitHub (ej: https://github.com/DanAlejo1033/balones.git): "
    if not defined REPO_URL (
        echo No se ingreso ninguna URL. Operacion cancelada.
        pause
        exit /b
    )
    git remote add origin %REPO_URL%
)

echo.
echo Conectando y subiendo rama main a GitHub...
git branch -M main
git push -u origin main
echo.
if %errorlevel% equ 0 (
    echo ========================================================
    echo  LISTO! Tu proyecto ha sido subido con exito a GitHub.
    echo ========================================================
) else (
    echo Hubo un problema al subir. Revisa la ventana de autenticacion o la URL del repositorio.
)
echo.
pause
