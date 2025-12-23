@echo off
setlocal ENABLEDELAYEDEXPANSION

REM ============================================
REM  PBQE-C • SNAPSHOT DO SISTEMA
REM  Wrapper Bruxônico (2 cliques)
REM ============================================

REM Pasta do script
cd /d "%~dp0"

REM Data e hora (formato seguro para arquivo)
for /f "tokens=1-3 delims=/- " %%a in ("%date%") do (
  set DIA=%%a
  set MES=%%b
  set ANO=%%c
)

for /f "tokens=1-3 delims=:." %%a in ("%time%") do (
  set HORA=%%a
  set MIN=%%b
  set SEG=%%c
)

set TIMESTAMP=%ANO%-%MES%-%DIA%_%HORA%-%MIN%-%SEG%
set TIMESTAMP=%TIMESTAMP: =0%

REM Log
set LOG_DIR=logs
set LOG_FILE=%LOG_DIR%\snapshot.log

if not exist "%LOG_DIR%" (
  mkdir "%LOG_DIR%"
)

echo -------------------------------------------- >> "%LOG_FILE%"
echo [%TIMESTAMP%] INICIO SNAPSHOT >> "%LOG_FILE%"

REM Execução
node snapshot_sistema.js >> "%LOG_FILE%" 2>&1

if %ERRORLEVEL% NEQ 0 (
  echo [%TIMESTAMP%] ERRO NA EXECUCAO >> "%LOG_FILE%"
  echo.
  echo ❌ Erro ao gerar snapshot. Verifique o log.
  pause
  exit /b 1
)

echo [%TIMESTAMP%] SNAPSHOT GERADO COM SUCESSO >> "%LOG_FILE%"
echo -------------------------------------------- >> "%LOG_FILE%"

echo.
echo ✅ Snapshot gerado com sucesso!
echo 📝 Log atualizado em: %LOG_FILE%
pause
