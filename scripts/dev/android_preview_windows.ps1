$ErrorActionPreference = 'Stop'

& "$PSScriptRoot\windows_android_env.ps1" | Write-Output

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$androidRoot = Join-Path $repoRoot 'android-native\android-app'
$avdName = if ($env:DOMINO_ANDROID_AVD) { $env:DOMINO_ANDROID_AVD } else { 'Dominoyar_API_34' }

$devices = adb devices | Select-String -Pattern "`tdevice$"
if (-not $devices) {
  if ((emulator -list-avds) -notcontains $avdName) {
    throw "AVD '$avdName' is missing. Create it with avdmanager or Android Studio Device Manager."
  }

  Start-Process -FilePath (Get-Command emulator).Source -ArgumentList @('-avd', $avdName, '-netdelay', 'none', '-netspeed', 'full') -WindowStyle Normal
  adb wait-for-device

  $booted = $false
  for ($attempt = 0; $attempt -lt 90; $attempt++) {
    $state = (adb shell getprop sys.boot_completed 2>$null).Trim()
    if ($state -eq '1') {
      $booted = $true
      break
    }
    Start-Sleep -Seconds 2
  }
  if (-not $booted) {
    throw "AVD '$avdName' did not finish booting in time."
  }
}

Push-Location $androidRoot
try {
  .\gradlew.bat installDebug
  adb shell monkey -p com.morodomino.android 1 | Write-Output
} finally {
  Pop-Location
}
