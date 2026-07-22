$ErrorActionPreference = "SilentlyContinue"
$deadline = (Get-Date).AddMinutes(8)
function Ready([string]$url) { try { $r=Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 4; return $r.StatusCode -ge 200 -and $r.StatusCode -lt 500 } catch { return $false } }
while ((Get-Date) -lt $deadline) {
  $web=Ready "http://localhost:3000"
  $ml=Ready "http://127.0.0.1:8000/api/v1/health"
  Write-Host "Next.js: $(if($web){'ready'}else{'starting'}) | ML: $(if($ml){'ready'}else{'starting'})"
  if ($web -and $ml) { Start-Process "http://localhost:3000"; exit 0 }
  Start-Sleep -Seconds 4
}
exit 1
