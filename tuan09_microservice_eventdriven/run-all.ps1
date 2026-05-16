# run-all.ps1
# PowerShell script to install deps, build and run all services via docker-compose,
# wait for core ports, then open frontend and RabbitMQ UI.

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

Write-Host "Running full setup from: $scriptDir"

$dirs = @(
  "services\api-gateway",
  "services\user-service",
  "services\food-service",
  "services\order-service",
  "services\payment-service",
  "services\notification-service",
  "services\frontend"
)

# Run npm install in each service (if package.json exists)
foreach ($d in $dirs) {
  $full = Join-Path $scriptDir $d
  if (Test-Path (Join-Path $full 'package.json')) {
    Write-Host "Installing npm deps in $d..."
    Push-Location $full
    # Use npm ci if package-lock.json exists else npm install
    if (Test-Path (Join-Path $full 'package-lock.json')) {
      npm ci --no-audit --no-fund | Write-Host
    } else {
      npm install --no-audit --no-fund | Write-Host
    }
    Pop-Location
  } else {
    Write-Host "No package.json in $d, skipping npm install"
  }
}

# Choose docker compose command
function Get-DockerComposeCmd {
  try {
    & docker version > $null 2>&1
    return "docker compose"
  } catch {
    if (Get-Command docker-compose -ErrorAction SilentlyContinue) { return "docker-compose" }
    throw "Docker not found. Please install Docker Desktop and ensure 'docker' or 'docker-compose' is on PATH."
  }
}

$dockerCmd = Get-DockerComposeCmd
Write-Host "Using: $dockerCmd"

# Bring up the stack
Write-Host "Building and starting containers..."
& $dockerCmd up --build -d

# Wait for important ports: RabbitMQ management 15672, API Gateway 8080, Frontend 3000
$checks = @(
  @{host='localhost'; port=15672; name='RabbitMQ UI'},
  @{host='localhost'; port=8080; name='API Gateway'},
  @{host='localhost'; port=3000; name='Frontend'}
)

function Test-Port($host, $port) {
  try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $async = $tcp.BeginConnect($host, $port, $null, $null)
    $wait = $async.AsyncWaitHandle.WaitOne(2000)
    if (-not $wait) { $tcp.Close(); return $false }
    $tcp.EndConnect($async)
    $tcp.Close()
    return $true
  } catch { return $false }
}

foreach ($c in $checks) {
  $ok = $false
  $tries = 0
  while (-not $ok -and $tries -lt 30) {
    if (Test-Port $c.host $c.port) { $ok = $true; break }
    Start-Sleep -Seconds 2
    $tries++
  }
  if ($ok) { Write-Host "$($c.name) is up on $($c.host):$($c.port)" }
  else { Write-Warning "$($c.name) did not become available on $($c.host):$($c.port) after timeout" }
}

# Open browser for frontend and RabbitMQ
Write-Host "Opening browser to frontend and RabbitMQ UI..."
Start-Process "http://localhost:3000"
Start-Process "http://localhost:15672"

Write-Host "You can follow logs with: $dockerCmd logs -f api-gateway order-service payment-service notification-service"
Write-Host "Done."
