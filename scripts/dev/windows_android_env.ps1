$ErrorActionPreference = 'Stop'

$sdkRoot = if ($env:ANDROID_SDK_ROOT) {
  $env:ANDROID_SDK_ROOT
} elseif ($env:ANDROID_HOME) {
  $env:ANDROID_HOME
} else {
  Join-Path $env:LOCALAPPDATA 'Android\Sdk'
}

$requiredPaths = @(
  (Join-Path $sdkRoot 'cmdline-tools\latest\bin\sdkmanager.bat'),
  (Join-Path $sdkRoot 'cmdline-tools\latest\bin\avdmanager.bat'),
  (Join-Path $sdkRoot 'platform-tools\adb.exe'),
  (Join-Path $sdkRoot 'emulator\emulator.exe')
)

foreach ($path in $requiredPaths) {
  if (-not (Test-Path $path)) {
    throw "Android SDK tool missing: $path"
  }
}

$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot

$toolPaths = @(
  (Join-Path $sdkRoot 'cmdline-tools\latest\bin'),
  (Join-Path $sdkRoot 'platform-tools'),
  (Join-Path $sdkRoot 'emulator')
)

$currentPath = @($env:Path -split ';' | Where-Object { $_ })
for ($index = $toolPaths.Count - 1; $index -ge 0; $index--) {
  $path = $toolPaths[$index]
  if ($currentPath -notcontains $path) {
    $env:Path = "$path;$env:Path"
  }
}

if ($env:NODE_TLS_REJECT_UNAUTHORIZED -eq '0') {
  Remove-Item Env:\NODE_TLS_REJECT_UNAUTHORIZED
  Write-Warning 'Removed process-local NODE_TLS_REJECT_UNAUTHORIZED=0 for this shell.'
}

Write-Output "ANDROID_HOME=$env:ANDROID_HOME"
Write-Output "ANDROID_SDK_ROOT=$env:ANDROID_SDK_ROOT"
Write-Output "ADB=$(Get-Command adb | Select-Object -ExpandProperty Source)"
Write-Output "EMULATOR=$(Get-Command emulator | Select-Object -ExpandProperty Source)"
Write-Output "AVDS=$((emulator -list-avds) -join ',')"
