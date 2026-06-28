# Experiment Governance

Last updated: 2026-04-10

## Purpose
Prevent demo web from becoming another uncontrolled permanent backlog.

## Rules
- every experiment needs an owner,
- every experiment needs a stop condition,
- every experiment needs a success condition,
- abandoned experiments must be removed or archived,
- demo-only code must not silently leak into stable products.

## Experiment Categories
- UX experiments
- gameplay-adjacent experiments
- reliability experiments
- Android-parity preparation experiments
- self-hosted asset and delivery experiments

## Required Metadata
- hypothesis,
- user impact,
- success metric,
- rollback trigger,
- promotion target,
- expiry date.

## Exit States
- promoted to stable web/PWA,
- promoted to Android,
- retained in demo,
- archived and removed.
