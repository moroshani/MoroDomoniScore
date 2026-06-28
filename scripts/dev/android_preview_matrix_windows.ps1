param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
)

$ErrorActionPreference = "Stop"

$sdkRoot = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { Join-Path $env:LOCALAPPDATA "Android\Sdk" }
$adb = Join-Path $sdkRoot "platform-tools\adb.exe"
if (-not (Test-Path $adb)) {
  throw "adb not found at $adb"
}

& (Join-Path $ProjectRoot "scripts\dev\android_preview_windows.cmd")

$resultDir = Join-Path $ProjectRoot "test-results"
New-Item -ItemType Directory -Force -Path $resultDir | Out-Null

$screens = @(
  @{ name = "auth"; screen = "auth"; theme = "light" },
  @{ name = "auth-register"; screen = "register"; theme = "light" },
  @{ name = "shell-light"; screen = "shell"; theme = "light" },
  @{ name = "shell-dark"; screen = "shell"; theme = "dark" },
  @{ name = "game-setup"; screen = "game"; theme = "light" },
  @{ name = "game-scoring"; screen = "scoring"; theme = "light" },
  @{ name = "game-scoring-tie"; screen = "scoring-tie"; theme = "light" },
  @{ name = "profile"; screen = "profile"; theme = "light" },
  @{ name = "settings"; screen = "settings"; theme = "light" },
  @{ name = "settings-dark"; screen = "settings"; theme = "dark" }
)

function Capture-AndroidPreview {
  param(
    [string]$Name,
    [string]$Screen,
    [string]$Theme
  )

  & $adb shell am start -n com.morodomino.android/.DebugPreviewActivity --es screen $Screen --es theme $Theme | Out-Null
  Start-Sleep -Seconds 2
  $remote = "/sdcard/android-preview-$Name.png"
  $local = Join-Path $resultDir "android-preview-$Name.png"
  & $adb shell screencap -p $remote | Out-Null
  & $adb pull $remote $local | Out-Null
  Get-Item $local | Select-Object FullName, Length, LastWriteTime
}

foreach ($item in $screens) {
  Capture-AndroidPreview -Name $item.name -Screen $item.screen -Theme $item.theme
}

$compactScreens = @(
  @{ name = "compact-auth"; screen = "auth"; theme = "light" },
  @{ name = "compact-auth-register"; screen = "register"; theme = "light" },
  @{ name = "compact-shell"; screen = "shell"; theme = "light" },
  @{ name = "compact-game-scoring"; screen = "scoring"; theme = "light" },
  @{ name = "compact-game-scoring-tie"; screen = "scoring-tie"; theme = "light" },
  @{ name = "compact-profile"; screen = "profile"; theme = "light" },
  @{ name = "compact-settings-dark"; screen = "settings"; theme = "dark" }
)

try {
  & $adb shell wm size 720x1280 | Out-Null
  & $adb shell wm density 320 | Out-Null
  Start-Sleep -Seconds 1
  foreach ($item in $compactScreens) {
    Capture-AndroidPreview -Name $item.name -Screen $item.screen -Theme $item.theme
  }
}
finally {
  & $adb shell wm size reset | Out-Null
  & $adb shell wm density reset | Out-Null
}

& $adb shell dumpsys window | Select-String -Pattern "mCurrentFocus|mFocusedApp"
& $adb logcat -d -t 300 | Select-String -Pattern "AndroidRuntime|FATAL EXCEPTION|com.morodomino.android"
