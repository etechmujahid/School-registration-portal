<#
  Deploys the built SPA (dist/) to IIS as its own site.
  Run from an ELEVATED PowerShell (Run as Administrator) in the project root:

      npm ci; npm run build
      powershell -ExecutionPolicy Bypass -File .\deploy\deploy-iis.ps1

  Defaults: http://school.techhorizon.tech (port 80, host-name binding, so it coexists with the
  other IIS sites on port 80). Re-running on an existing site only refreshes the files; bindings
  are left as they are. DNS: A record school.techhorizon.tech -> 154.38.169.165.

  Requires IIS + URL Rewrite module (both already installed on this server).
#>
param(
  [string]$SiteName = 'SchoolPortal',
  [int]$Port = 80,
  [string]$HostName = 'school.techhorizon.tech',
  [string]$TargetPath = 'C:\inetpub\school-portal'
)

$ErrorActionPreference = 'Stop'
$appcmd = "$env:windir\System32\inetsrv\appcmd.exe"
$dist = Join-Path $PSScriptRoot '..\dist'

if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  throw 'Run this script from an elevated (Administrator) PowerShell.'
}
if (-not (Test-Path (Join-Path $dist 'index.html'))) { throw "No build found at $dist. Run 'npm run build' first." }

# 1. Copy build output
New-Item -ItemType Directory -Force $TargetPath | Out-Null
robocopy $dist $TargetPath /MIR /NFL /NDL /NJH /NJS | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed ($LASTEXITCODE)" }
Write-Host "Copied build to $TargetPath"

# 2. App pool (static files only, no managed runtime)
if (-not (& $appcmd list apppool /name:$SiteName)) {
  & $appcmd add apppool /name:$SiteName /managedRuntimeVersion:"" | Out-Null
}

# 3. Site
$binding = "http/*:${Port}:$HostName"
if (& $appcmd list site /name:$SiteName) {
  & $appcmd set site /site.name:$SiteName "/[path='/'].[path='/'].physicalPath:$TargetPath" | Out-Null
  Write-Host "Updated existing site '$SiteName'"
} else {
  & $appcmd add site /name:$SiteName /bindings:$binding /physicalPath:$TargetPath | Out-Null
  & $appcmd set app "$SiteName/" /applicationPool:$SiteName | Out-Null
  Write-Host "Created site '$SiteName' on $binding"
}
& $appcmd start site /site.name:$SiteName | Out-Null

# 4. Grant IIS read access
icacls $TargetPath /grant "IIS_IUSRS:(OI)(CI)RX" /T /Q | Out-Null

# 5. Open the port in Windows Firewall (80/443 are already allowed on this server)
$rule = "IIS $SiteName TCP $Port"
if ($Port -notin 80, 443 -and -not (Get-NetFirewallRule -DisplayName $rule -ErrorAction SilentlyContinue)) {
  New-NetFirewallRule -DisplayName $rule -Direction Inbound -Protocol TCP -LocalPort $Port -Action Allow | Out-Null
  Write-Host "Opened firewall port $Port"
}

$url = if ($HostName) { "http://$HostName" } else { "http://$((Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' } | Select-Object -First 1).IPAddress)" }
if ($Port -ne 80) { $url += ":$Port" }
Write-Host "`nDone. Test: $url/  (and /dashboard to check SPA routing)"
