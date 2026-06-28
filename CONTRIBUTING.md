# Contributing to Dominoyar

Thank you for your interest in contributing to Dominoyar!

## Development Setup

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Create `.env.local` from `.env.example` with your values
5. Run the API server: `npm run api:server`
6. Run the dev server: `npm run dev`

## Android Development

The Android app lives in `android-native/android-app/`:

```powershell
cd android-native\android-app
.\gradlew.bat assembleDebug
```

For screenshot verification, use:

```powershell
.\scripts\dev\android_preview_matrix_windows.cmd
```

## Code Standards

- Follow existing code style
- All commits must pass `npm run ops:scope:check`
- Keep changes scoped to `stable-web-pwa` or `native-android` tracks
- Do not add archived features (history, stats, alliance, chat)

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Reference relevant parity contracts if changing product behavior
4. PR must pass CI checks and manual review

## License

By contributing, you agree that your contributions will be licensed under the MIT License.