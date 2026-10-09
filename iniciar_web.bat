@echo off
echo ===================================================
echo Iniciant el servidor local per la web d'ESMOTECH...
echo ===================================================
echo.
echo S'obrira el navegador automaticament.
echo (Prem CTRL+C en aquesta finestra per apagar el servidor quan acabis)
echo.

:: Obre el navegador
start http://localhost:8080/

:: Inicia el servidor de python
python -m http.server 8080

pause
