@echo off
title INEM SportForUs - Control de Balones
echo ========================================================
echo       INEM SPORTFORUS: CONTROL DE BALONES
echo ========================================================
echo.
echo Verificando servidor local en el puerto 8000...
netstat -ano | findstr :8000 >nul
if %errorlevel% neq 0 (
    echo Iniciando servidor PHP local en http://localhost:8000...
    if exist "C:\xampp\php\php.exe" (
        start /b "" "C:\xampp\php\php.exe" -S localhost:8000
    ) else (
        start /b php -S localhost:8000
    )
    timeout /t 2 >nul
) else (
    echo El servidor ya esta en ejecucion en el puerto 8000.
)

echo Abriendo INEM SportForUs en tu navegador...
start http://localhost:8000
echo.
echo Sistema iniciado correctamente.
timeout /t 3 >nul
