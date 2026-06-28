# Distribution And Promotion Hub

Last updated: 2026-06-02
Status: active product/distribution requirement

## Goal
Create an online distribution hub page that promotes all official access channels:
- Myket Android listing
- Optional Cafe Bazaar Android listing (when dual-store lane is active)
- Stable web app
- PWA install path
- Direct download channel (controlled)

## Why This Is Required
Users need one canonical place to install/open the product on any device.

## Required Sections
1. Android installs (Myket + optional Bazaar + controlled direct-download buttons).
2. Web app launch button.
3. PWA install help (platform-aware guidance).
4. Direct download (APK/AAB test channel) with risk disclaimer.
5. Release notes and version status.
6. Direct Android build integrity metadata (version + SHA-256) for controlled download path.

## Non-Negotiable Rules
- Only official links.
- No broken or placeholder store links in production.
- Device-aware CTA logic (Android vs iOS vs desktop).
- Persian-first copy and RTL layout.
- Direct-download warning copy must clearly state controlled/test usage and integrity-check requirement.
- If Bazaar button is shown, it must be controlled via explicit release configuration (not hardcoded always-on).

## Analytics & Trust
- Track channel CTRs (Myket/Bazaar/Web/PWA/Direct).
- Track install-help opens and drop-off points.
- Publish last-updated timestamp for trust.
- Keep Android release metadata aligned with the actual build lane (Myket mirror backed CI/local builds).
- Keep store metadata parity across active channels (version + release notes alignment for Myket/Bazaar when dual-store lane is enabled).

## Exit Criteria
- Hub is live and linked from settings/profile/footer.
- Store links are verified and monitored.
- User can always find a valid install/open path.
- If direct Android download is enabled, release metadata is visible and matches published artifact.
