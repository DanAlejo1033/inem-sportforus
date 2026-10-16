@echo off
title Subir INEM SportForUs a GitHub
echo ========================================================
echo       SUBIENDO INEM SPORTFORUS A GITHUB
echo ========================================================
echo.
echo Conectando con https://github.com/DanAlejo1033/inem-sportforus.git...
echo.
git add .
git diff --cached --quiet
if %errorlevel% neq 0 (
    set /p COMMIT_MSG="Describe los cambios realizados (Enter para mensaje automatico): "
    if not defined COMMIT_MSG set COMMIT_MSG=Actualizacion de archivos y mejoras
    git commit -m "%COMMIT_MSG%"
)
git push -u origin main
echo.
if %errorlevel% equ 0 (
    echo ========================================================
    echo  LISTO! Tu proyecto ha sido subido con exito a GitHub.
    echo ========================================================
) else (
    echo Hubo un problema al subir. Revisa la ventana de autenticacion.
)
echo.
pause
