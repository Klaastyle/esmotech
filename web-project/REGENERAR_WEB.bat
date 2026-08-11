@echo off
chcp 65001 > nul
echo ========================================================
echo        ESMOTECH - SISTEMA D'IMPORTACIÓ EXCEL NATIU (.XLSX)
echo ========================================================
echo.
echo 1. Exportant full d'Excel CATALOG_MASTER_ESMOTECH.xlsx...
cd /d "%~dp0"
python scratch/xlsx_to_csv.py
echo.
echo 2. Processant jerarquia Pare / Fill i escanejant carpetes d'imatges...
node build.js
echo.
echo ========================================================
echo ✅ RECONSTRUCCIÓ COMPLETADA AMB ÈXIT!
echo Pàgines generades a la carpeta /dist
echo ========================================================
echo.
pause
