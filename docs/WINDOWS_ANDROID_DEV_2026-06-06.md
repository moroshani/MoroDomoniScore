# Windows Android development - 2026-06-06

The current development host is Windows-native Codex in VS Code, not WSL. Use PowerShell and Windows paths for Android work.

## Installed toolchain

- Node/npm via Volta.
- Git for Windows.
- Microsoft JDK 17 at `C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot`.
- Android SDK at `%LOCALAPPDATA%\Android\Sdk`.
- Android SDK packages:
  - `cmdline-tools;latest`
  - `platform-tools`
  - `platforms;android-34`
  - `build-tools;34.0.0`
  - `emulator`
  - `system-images;android-34;google_apis;x86_64`
- Android Studio `2026.1.1.8`.
- AVD: `Dominoyar_API_34`.
- VS Code extensions:
  - `fwcd.kotlin`
  - `vscjava.vscode-java-pack`
  - `vscjava.vscode-gradle`

## Windows routine

From repo root:

```powershell
.\scripts\dev\windows_android_env.cmd
```

Build Android:

```powershell
cd .\android-native\android-app
.\gradlew.bat assembleDebug
```

Preview on emulator or attached device:

```powershell
.\scripts\dev\android_preview_windows.cmd
```

Open visual Android tooling:

```powershell
Start-Process "C:\Program Files\Android\Android Studio\bin\studio64.exe" -ArgumentList "C:\Projects\morodomino\MoroDomoniScore\android-native\android-app"
```

## Notes

- `android-native/android-app/local.properties` is machine-local and ignored by Git.
- The Gradle wrapper remains the project build entrypoint; do not require global Gradle.
- Keep `NODE_TLS_REJECT_UNAUTHORIZED` unset. The helper clears process-local `NODE_TLS_REJECT_UNAUTHORIZED=0` before Android work.
- The `.cmd` wrappers use process-only PowerShell execution-policy bypass; they do not change User or Machine execution policy.
- Android dependency and Gradle bootstrap still use the Myket mirror configured in `android-native/android-app/settings.gradle.kts` and `gradle-wrapper.properties`.
