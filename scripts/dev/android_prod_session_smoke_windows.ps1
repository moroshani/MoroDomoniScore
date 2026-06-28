param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
)

$ErrorActionPreference = "Stop"

$sdkRoot = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { Join-Path $env:LOCALAPPDATA "Android\Sdk" }
$adb = Join-Path $sdkRoot "platform-tools\adb.exe"
if (-not (Test-Path $adb)) {
  throw "adb not found at $adb"
}

$packageName = "com.morodomino.android"
$resultDir = Join-Path $ProjectRoot "test-results"
New-Item -ItemType Directory -Force -Path $resultDir | Out-Null

$stamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$name = "AndroidSmoke$stamp"
$username = "androidsmoke$stamp"
$email = "$username@example.com"
$password = "AndroidSmoke12345"
$updatedName = "AndroidSmokeUpdated$stamp"
$updatedUsername = "androidsmokeu$stamp"
$updatedEmail = "androidsmokeu$stamp@example.com"
$updatedPassword = "AndroidSmoke67890"

function Invoke-Adb {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
  & $adb @Args
}

function Start-App {
  Invoke-Adb shell am start -n "$packageName/.MainActivity" | Out-Null
  Start-Sleep -Seconds 2
}

function Dump-Ui {
  param([string]$Name)
  $remote = "/sdcard/$Name.xml"
  $local = Join-Path $resultDir "$Name.xml"
  Invoke-Adb shell uiautomator dump $remote | Out-Null
  Invoke-Adb pull $remote $local | Out-Null
  Get-Content $local -Raw -Encoding UTF8
}

function Get-EditTextCenters {
  param([string]$Xml)
  $matches = [regex]::Matches($Xml, 'class="android\.widget\.EditText"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"')
  @($matches | ForEach-Object {
    [pscustomobject]@{
      X = [int](([int]$_.Groups[1].Value + [int]$_.Groups[3].Value) / 2)
      Y = [int](([int]$_.Groups[2].Value + [int]$_.Groups[4].Value) / 2)
    }
  })
}

function Get-ButtonCenters {
  param([string]$Xml)
  $matches = [regex]::Matches($Xml, 'class="android\.widget\.Button"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"')
  @($matches | ForEach-Object {
    [pscustomobject]@{
      X = [int](([int]$_.Groups[1].Value + [int]$_.Groups[3].Value) / 2)
      Y = [int](([int]$_.Groups[2].Value + [int]$_.Groups[4].Value) / 2)
    }
  })
}

function Tap-ButtonFromUi {
  param([string]$Xml, [int]$Index = 0, [int]$Seconds = 3)
  $buttons = @(Get-ButtonCenters -Xml $Xml)
  if ($buttons.Count -le $Index) {
    throw "Expected button index $Index but only found $($buttons.Count) buttons."
  }
  Tap-And-Wait -X $buttons[$Index].X -Y $buttons[$Index].Y -Seconds $Seconds
}

function Input-Text {
  param([int]$X, [int]$Y, [string]$Text, [switch]$Clear)
  Invoke-Adb shell input tap $X $Y | Out-Null
  Start-Sleep -Milliseconds 300
  if ($Clear) {
    Invoke-Adb shell input keyevent KEYCODE_MOVE_END | Out-Null
    for ($i = 0; $i -lt 64; $i++) {
      Invoke-Adb shell input keyevent KEYCODE_DEL | Out-Null
    }
  }
  $escaped = $Text.Replace(" ", "%s")
  Invoke-Adb shell input text $escaped | Out-Null
  Start-Sleep -Milliseconds 300
  Invoke-Adb shell input keyevent KEYCODE_BACK | Out-Null
  Start-Sleep -Milliseconds 300
}

function Tap-And-Wait {
  param([int]$X, [int]$Y, [int]$Seconds = 2)
  Invoke-Adb shell input tap $X $Y | Out-Null
  Start-Sleep -Seconds $Seconds
}

function Save-Screenshot {
  param([string]$Name)
  $remote = "/sdcard/$Name.png"
  $local = Join-Path $resultDir "$Name.png"
  Invoke-Adb shell screencap -p $remote | Out-Null
  Invoke-Adb pull $remote $local | Out-Null
  Get-Item $local | Select-Object FullName, Length, LastWriteTime
}

function Require-UiText {
  param([string]$Xml, [string]$Needle, [string]$Label)
  if (-not $Xml.Contains($Needle)) {
    throw "Missing expected UI text for $Label"
  }
}

Invoke-Adb shell pm clear $packageName | Out-Null
Start-App

Tap-And-Wait -X 300 -Y 455 -Seconds 1
$registerXml = Dump-Ui -Name "android-prod-smoke-register"
$registerFields = @(Get-EditTextCenters -Xml $registerXml)
if ($registerFields.Count -lt 4) {
  throw "Register form did not expose 4 editable fields."
}

Input-Text -X $registerFields[0].X -Y $registerFields[0].Y -Text $name
Input-Text -X $registerFields[1].X -Y $registerFields[1].Y -Text $username
Input-Text -X $registerFields[2].X -Y $registerFields[2].Y -Text $email
Input-Text -X $registerFields[3].X -Y $registerFields[3].Y -Text $password
$registerReadyXml = Dump-Ui -Name "android-prod-smoke-register-ready"
Tap-ButtonFromUi -Xml $registerReadyXml -Index 0 -Seconds 5

$shellXml = Dump-Ui -Name "android-prod-smoke-after-register"
Require-UiText -Xml $shellXml -Needle $name -Label "registered session"

Tap-And-Wait -X 540 -Y 1785 -Seconds 2
$profileXml = Dump-Ui -Name "android-prod-smoke-profile"
$profileFields = @(Get-EditTextCenters -Xml $profileXml)
if ($profileFields.Count -lt 3) {
  throw "Profile form did not expose at least 3 editable fields."
}

Input-Text -X $profileFields[0].X -Y $profileFields[0].Y -Text $updatedName -Clear
Input-Text -X $profileFields[1].X -Y $profileFields[1].Y -Text $updatedUsername -Clear
Input-Text -X $profileFields[2].X -Y $profileFields[2].Y -Text $updatedEmail -Clear
$profileReadyXml = Dump-Ui -Name "android-prod-smoke-profile-ready"
Tap-ButtonFromUi -Xml $profileReadyXml -Index 0 -Seconds 4

Invoke-Adb shell input swipe 540 1650 540 640 700 | Out-Null
Start-Sleep -Seconds 1
$passwordXml = Dump-Ui -Name "android-prod-smoke-password"
$passwordFields = @(Get-EditTextCenters -Xml $passwordXml)
if ($passwordFields.Count -lt 2) {
  throw "Password form did not expose 2 editable fields after scrolling."
}

Input-Text -X $passwordFields[0].X -Y $passwordFields[0].Y -Text $password -Clear
Input-Text -X $passwordFields[1].X -Y $passwordFields[1].Y -Text $updatedPassword -Clear
$passwordReadyXml = Dump-Ui -Name "android-prod-smoke-password-ready"
Tap-ButtonFromUi -Xml $passwordReadyXml -Index 0 -Seconds 4

Invoke-Adb shell pm clear $packageName | Out-Null
Start-App
$loginXml = Dump-Ui -Name "android-prod-smoke-login"
$loginFields = @(Get-EditTextCenters -Xml $loginXml)
if ($loginFields.Count -lt 2) {
  throw "Login form did not expose 2 editable fields."
}

Input-Text -X $loginFields[0].X -Y $loginFields[0].Y -Text $updatedEmail
Input-Text -X $loginFields[1].X -Y $loginFields[1].Y -Text $updatedPassword
$loginReadyXml = Dump-Ui -Name "android-prod-smoke-login-ready"
Tap-ButtonFromUi -Xml $loginReadyXml -Index 0 -Seconds 5

$afterLoginXml = Dump-Ui -Name "android-prod-smoke-after-login"
Require-UiText -Xml $afterLoginXml -Needle $updatedName -Label "updated login session"
Save-Screenshot -Name "android-prod-session-smoke"

"ANDROID_PROD_SESSION_SMOKE=PASS"
"ANDROID_SMOKE_USER=$updatedEmail"
