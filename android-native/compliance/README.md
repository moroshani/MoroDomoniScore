# Android Compliance Automation

This folder tracks Myket and broad Android readiness checks.

## Mirror Policy
- Preferred Android build mirror: `https://maven.myket.ir/`
- Mirror scope in this project:
  - Gradle wrapper distribution
  - plugin resolution
  - dependency resolution
- Build/release checks should be executed with the same mirror policy used in CI/local release prep.

## Files
- `myket_release_checklist.md`: manual Myket store-panel gate checklist.
- `bazaar_release_checklist.md`: optional dual-store Bazaar panel gate checklist.
- `device_compatibility_matrix.md`: required API/device/RTL/network matrix.
- `verify_android_release_readiness.sh`: local static checks for Android release hygiene.
- `verify_dual_store_release_readiness.sh`: optional dual-store metadata/checklist gate.

## Usage
From repo root:

```bash
bash android-native/compliance/verify_android_release_readiness.sh
```

Optional dual-store gate:

```bash
bash android-native/compliance/verify_dual_store_release_readiness.sh .env.local
```

This does not replace final manual verification in:
- https://developer.myket.ir/
