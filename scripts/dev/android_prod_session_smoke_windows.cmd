@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0android_prod_session_smoke_windows.ps1" %*
