> Historical-only note: This document is archived or deferred. It is not part of the active implementation path unless explicitly reactivated. The current source of truth is the stable web/PWA + Android + demo-web roadmap set.

# Mini-Roadmap: UX/UI Alliance Surface

Last updated: 2026-02-24

## Problem
Alliance capabilities must be understandable to non-technical family users, while still supporting power users and admins.

## Current Implementation Snapshot
Status: `Implemented baseline`, `Partial advanced polish`

Evidence:
- Alliance create/join/switch and scope selection are live:
  - `pages/AlliancePage.tsx`
  - `context/AllianceContext.tsx`
- Members, invites, claims, households, lobbies, and chat surfaces are live:
  - `pages/AlliancePage.tsx`
  - `server/api/routes/alliances.js`
  - `server/realtimeCore.js`
- Avatar propagation for members/chat is live:
  - `pages/AlliancePage.tsx`
  - `server/api/routes/alliances.js`
  - `server/realtimeCore.js`

## UX Principles
- Keep Persian RTL clarity first; avoid security jargon in user-visible strings.
- Separate account identity from player identity in plain language.
- Prevent destructive surprises with preview/confirm patterns.
- Keep responsive behavior equal across web and installed modes.

## Required Surfaces
- Alliance onboarding:
  - Create alliance / Join by invite.
  - Switch alliance context.
- Alliance roster:
  - Add member user.
  - Add non-user player.
  - Claim player.
  - Merge duplicate players.
- Shared stats/history:
  - Alliance filter and visibility state.
  - Clear indicator of active alliance scope.

## Source-Backed Constraints
- Navigation and action grouping should follow accessible menu/button patterns.
  Source: W3C APG menu button
  https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
- Responsive and touch ergonomics must remain stable at smallest breakpoints.
  Source: MDN responsive design, WCAG 2.2
  https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design
  https://www.w3.org/WAI/WCAG22/quickref/

## Delivery Plan
### P0
- Add alliance switcher and active-scope indicator in header/menu.
- Add alliance roster page with role-aware actions.
- Add claim/merge flows with dry-run summaries.

### P1
- Add alliance activity feed (membership + player identity events).
- Add diagnostics panel for sync and permission issues.

### P2
- Add guided onboarding wizard for first-time family setup.
- Add advanced shortcuts for high-frequency scorekeepers.

## Implementation Packet (Screen Contracts)
- Header/drawer:
  - active scope badge (`alliance/world/local`),
  - quick scope switcher.
- Alliance center:
  - members, roster, invites, claims, merge queue.
- Match setup:
  - choose scope first, then mode (2/3/4) and roster.
- Chat shell:
  - tabs for direct/alliance/match, unread counters, moderation affordances.

## Verification
- User can create or join alliance and complete first shared game flow without support.
- Every sensitive action has explicit confirmation and clear outcome message.
- Mobile and desktop flows maintain full feature parity.

## KPIs
- Alliance onboarding completion rate.
- Claim/merge completion rate.
- UX support tickets for alliance confusion.

## Implementation-Ready Finalization (2026-02-24)
- Execution wave: Waves 2-5 (foundational to UX)
- Dependencies locked: Wave 1 security baseline, additive migrations, feature-flag infra
- Required feature flags: alliance_identity_v1, scope_world_alliance_v1, chat_surface_v1, sync_observability_v1
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
- Exit artifact required: Alliance/world rollout dossier with migration parity and non-regression proofs


## Scope
This roadmap item defines execution boundaries and delivery policy for alliance shared identity.

## Verification Contract References
- C1, C9, C10 (plus topic-specific contracts listed in execution wave mapping).

## Risk and Rollback Summary
- Primary risks: execution drift, unverified assumptions, and governance gaps.
- Rollback: revert documentation/tooling changes and rerun Wave 0 gates until green.
