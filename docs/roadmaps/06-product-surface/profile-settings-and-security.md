# Mini-Roadmap: Profile, Settings, Security UX

Last updated: 2026-02-24

## Problem
Users should be able to manage identity, sessions, and app configuration without shell/admin intervention.

## Current Implementation Snapshot
Status: `Implemented strong baseline + avatar/session controls`, `Partial diagnostics depth`

Evidence:
- Profile edit/password change/session controls:
  - `pages/ProfilePage.tsx`
  - `server/api/routes/users.js`
- User avatar upload, resize, and persistence:
  - `pages/ProfilePage.tsx`
  - `server/api/routes/users.js`
- Login remember-me control:
  - `components/Auth.tsx`
- Settings update/install/server-health actions:
  - `pages/SettingsPage.tsx`
- Protected-account warning scoped to immortal user only:
  - `pages/ProfilePage.tsx`
  - `server/api/routes/users.js`

## Gap Matrix
- Implemented:
  - Labelled profile/settings fields.
  - Session listing and revoke controls.
  - Immortal protection visibility scoped correctly.
- Missing:
  - Account security insights (new device warning history).
  - Unified settings diagnostics panel.

## Source-Backed Considerations
- Session transparency and user control are core security usability requirements.
  Source: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
  Source: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- Sensitive actions should be explicit and reversible where possible.

## Delivery Plan
### P0
- Keep account and session management fully functional in UI.
- Preserve correct destructive-action safeguards.

### P1
- Add session alias/trust labeling.
- Add account security event summary panel.
- Add settings diagnostics for version/session/server state.
- Add alliance-membership and role/trust visibility in profile settings.

### P2
- Add optional advanced account safety controls (step-up on destructive actions).
- Add self-service security recommendations module.

## Verification
- User can edit profile, change password, and manage sessions entirely from UI.
- Current session revoke logs out immediately.
- Immortal warning and controls are correctly scoped.

## KPIs
- Account-support ticket rate.
- Session-control usage rate.
- Security-action completion success rate.

## Expansion Round 2 (2026-02-23)
- Add account security checklist panel (password age, session count, recent changes).
- Add per-session contextual actions (`rename`, `revoke`, `inspect details`).
- Add settings search/filter for large future settings surfaces.
- Add guided troubleshooting snippets for update/install/session issues.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Wave 4
- Dependencies locked: Wave 2 identity model and Wave 3 realtime contracts
- Required feature flags: profile_settings_v2, scoring_entry_ux_v2, history_scope_filters_v1
- Non-regression constraints (mandatory):
  - Login/register remains available in all phases.
  - Quick Night remains available and unchanged.
  - No gameplay-rule changes in this roadmap batch.
  - Zero-downtime rollout only (expand, backfill, cutover, cleanup).
  - Web and installed PWA parity is required.
- Delivery checklist:
  - API contracts are frozen before implementation starts.
  - Data migration/backfill plan includes rollback and parity checks.
  - Security controls and abuse-path checks are mapped to verification contracts.
  - Responsive behavior validated from 320px to 1920px before release gate pass.
  - Observability events/metrics are defined before rollout.
- Verification checklist:
  - Unit + integration + end-to-end coverage for this roadmap item.
  - Contract checks C1-C11 and release gates G0-G6 applied where relevant.
  - Local vs VPS behavior parity snapshot captured before closing.
- Exit artifact required: Product surface acceptance report (web + PWA, all supported sizes)


## Scope
This roadmap item defines execution boundaries and delivery policy for product surface.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
