# Promotion Policy

Last updated: 2026-04-10

## Purpose
Define how features move from demo web to stable web/PWA and Android.

## Promotion Gate
A feature may move out of demo only when all are true:
1. scope is documented,
2. UX is stable,
3. implementation is complete enough for release,
4. regression checks pass,
5. local verification passes,
6. VPS verification passes when relevant,
7. no forbidden external asset or service dependency remains,
8. explicit signoff is given.

## Promotion Targets
### To Stable Web/PWA
Feature must be safe for real users and non-Android users.

### To Android
Feature must either:
- already be promoted to stable web/PWA, or
- be explicitly approved as Android-only native capability.

## Non-Promotion Rule
Interesting research alone is not enough.
A feature stays in demo until it is operationally boring, predictable, and supportable.
