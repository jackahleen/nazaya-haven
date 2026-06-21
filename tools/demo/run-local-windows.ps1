#!/usr/bin/env pwsh
# Local runner for Nazaya Haven on Windows.
# Usage: ./tools/demo/run-local-windows.ps1 [-Mode static|dev]
param(
  [ValidateSet("static", "dev")]
  [string]$Mode = "static"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $root

if (-not (Test-Path "node_modules")) {
  Write-Host "Installing dependencies..." -ForegroundColor Cyan
  npm install
}

if ($Mode -eq "dev") {
  Write-Host "Starting dev runtime with live /api/* support on http://127.0.0.1:3000" -ForegroundColor Green
  npm run dev
} else {
  Write-Host "Building static export..." -ForegroundColor Cyan
  npm run build
  Write-Host "Serving static preview on http://127.0.0.1:3000 with demo-mode API fallbacks" -ForegroundColor Green
  npm run serve:static
}
