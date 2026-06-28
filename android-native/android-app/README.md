# Android App Scaffold

Status: foundation baseline is now wired.

Included:
- Gradle project skeleton,
- Jetpack Compose app entry,
- Room entities/DAO/database for quick-game continuity,
- Retrofit API contracts aligned with stable backend auth/profile scope,
- secure token persistence with encrypted shared preferences,
- DataStore preferences for theme/sound/haptics,
- repository layer for auth and quick-game restore,
- bootstrap ViewModel and app-state UI wiring.

Current feature behavior:
- Bootstraps saved auth token and verifies `/api/users/me`.
- Restores latest active quick game session from Room.
- Reads local preferences for theme/sound/haptics.

Next implementation step:
- add full auth screens and profile/settings UI,
- add quick-game gameplay UI parity with stable web,
- add full network error localization and retry UX,
- add Gradle wrapper from Android Studio or local Gradle install.

## Import Notes

If `gradlew` is missing in this folder:
1. Open this project in Android Studio.
2. Run `gradle wrapper` from the `android-app` root.
3. Commit generated wrapper files:
   - `gradlew`
   - `gradlew.bat`
   - `gradle/wrapper/gradle-wrapper.properties`
   - `gradle/wrapper/gradle-wrapper.jar`


## Local Build Bootstrap
- This module expects the checked-in Gradle wrapper (`gradlew.bat` on Windows, `./gradlew` on Linux/WSL).
- Current active development host is Windows-native VS Code/Codex.
- Windows Android SDK lives at `%LOCALAPPDATA%\Android\Sdk`.
- Machine-local `local.properties` should point to that SDK and must stay untracked.
- Use `scripts/dev/windows_android_env.cmd` from the repository root before Android CLI work.

## Build Status
- `gradlew.bat -v` works on Windows with JDK 17.
- SDK 34, build-tools 34.0.0, platform-tools, emulator, and Android 34 Google APIs x86_64 system image are installed.
- AVD `Dominoyar_API_34` is available for preview.
- Use `scripts/dev/android_preview_windows.cmd` to build, install, and launch the app on an attached device or emulator.

## Myket Mirror
- Repository mirror: `https://maven.myket.ir/`, with `google()` and `mavenCentral()` fallbacks for artifacts the mirror does not carry.
- Wrapper mirror: `https://maven.myket.ir/gradle/distributions/gradle-8.10.2-bin.zip`
- Current mirror-backed artifacts verified in this project:
  - `com.android.tools.build:gradle:8.5.2`
  - `org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.24`
  - `com.google.devtools.ksp:symbol-processing-gradle-plugin:1.9.24-1.0.20`
  - `androidx.core:core-ktx:1.13.1`
- Keep Myket mirror as default bootstrap source for Android builds in Iran/restricted networks.
