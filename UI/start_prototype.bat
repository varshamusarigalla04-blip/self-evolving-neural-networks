@echo off
title Self-Evolving Neural Networks Prototype
echo ======================================================================
echo Launching Self-Evolving Neural Networks Web Prototype...
echo ======================================================================

where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    python run_demo.py
) else (
    echo Python not detected in PATH. Opening index.html directly in browser...
    start index.html
)
pause
