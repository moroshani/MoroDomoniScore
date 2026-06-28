# Android Notifications Strategy

Last updated: 2026-05-05
Status: active

## Goal
Use notifications only where they deliver clear user value and remain policy-safe.

## Principles
- Notifications are opt-in where possible.
- No spam, no dark patterns.
- Align with store policy and user expectations.

## Candidate Use Cases
1. Optional reminder to continue unfinished quick game.
2. Security notifications for important account events.
3. Optional release/update highlights (low frequency).

## Technical Baseline
- Runtime permission handling for modern Android notification model.
- Channels/categories for user control.
- Deep-link routing from notification to relevant screen.
- Respect quiet hours and user preference toggles.

## Store-Safety Requirements
- Notification content must be accurate and non-deceptive.
- Users can disable categories individually.
- No excessive frequency or irrelevant pushes.

## Exit Criteria
- Notification system is useful, controllable, and compliant.
