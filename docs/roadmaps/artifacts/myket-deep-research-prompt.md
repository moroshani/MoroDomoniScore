# ChatGPT Deep Research Prompt — Full Myket Android Coverage

You are a senior Android release/compliance strategist and technical researcher.

Your task: produce the most exhaustive, practical, and source-grounded research dossier on **Myket** for Android app teams shipping production apps in Iran.

## Mission
Create a complete, actionable knowledge base that covers **everything needed** to design, build, test, publish, operate, and scale an Android app on Myket — with deep focus on real-world delivery, compliance, monetization, and release reliability.

## Output Quality Bar
- Maximum depth and breadth; assume this will become an internal playbook and release gate.
- Prioritize official/primary sources first (Myket developer docs, policy pages, console docs, APIs, SDK docs, legal pages, technical announcements).
- Include publication/last-updated dates when available.
- Flag uncertainty clearly and propose verification steps.
- Distinguish **confirmed fact** vs **inference**.
- Provide direct URLs for every claim cluster.

## Required Deliverables
Produce the response in the following structure:

1. **Executive Brief (1-2 pages)**
   - What Myket requires for Android teams to succeed.
   - Top 20 high-risk failure points and mitigations.
   - Practical rollout strategy for a first production launch.

2. **Source Map**
   - Categorized source inventory with links:
     - Official docs
     - Policy/compliance pages
     - API references
     - SDK repositories/artifacts
     - Support/FAQ/knowledge center
     - Changelog/news/release notes
   - For each source: reliability score (High/Med/Low), scope, and freshness.

3. **End-to-End Myket Submission & Release Flow**
   - Full lifecycle from account setup to post-release operations.
   - Required assets, metadata, forms, declarations, and approval steps.
   - Time-to-review expectations and operational buffers.
   - Rejection/resubmission pathways.

4. **Policy & Compliance Deep Dive**
   - Content policies, legal/privacy requirements, age/content classification, sensitive categories.
   - Data handling expectations and privacy policy alignment.
   - Permission policy mapping (what triggers review scrutiny).
   - Enforcement patterns: warnings, suspensions, delisting scenarios.
   - Build a “Do/Don’t” matrix.

5. **Technical Delivery Requirements (Android)**
   - Packaging support (APK/AAB/multi-APK/splits) and constraints.
   - Versioning/versionCode policies and upgrade behavior.
   - Signing expectations (key continuity, rotation constraints if any).
   - ABI/device compatibility guidance.
   - Target/min SDK expectations and practical compatibility policy.
   - Network/CDN/download reliability considerations in Iran.

6. **Myket APIs & Automation (Server-to-Server)**
   - Catalog all relevant APIs (release bundles, IAP verification/consume, product management, etc.).
   - Auth model (token management, rotation/security, least privilege).
   - Full request/response behavior and error code semantics.
   - Idempotency, retry, pagination, rate-limit assumptions and recommended client patterns.
   - CI/CD integration blueprint for automated release pipeline.

7. **In-App Billing / Revenue Operations**
   - Product types, setup flow, pricing/currency nuances, taxes/fees if documented.
   - Purchase lifecycle states and backend verification best practices.
   - Fraud/abuse prevention controls.
   - Refund/cancel/consume logic and reconciliation strategy.
   - Revenue analytics and payout operational checklist.

8. **Store Listing Optimization (ASO for Myket)**
   - Listing field requirements and localization best practices (Persian-first).
   - Icon/screenshot/video guidance and conversion levers.
   - Keyword/discoverability strategy specific to Myket behavior if known.
   - Ratings/reviews strategy and policy-safe engagement flows.

9. **Security & Abuse-Resistance**
   - Secure integration checklist for Myket APIs and billing verification.
   - Client hardening recommendations for rooted/tampered environments.
   - Secrets handling and incident response runbook.
   - Threat model focused on account takeover, token leakage, fake purchase tokens, replay attacks.

10. **Operations, Monitoring, and SRE View**
    - Release health KPIs and alert thresholds.
    - Rollout strategies (staged rollout, rollback, hotfix lane).
    - Deployment runbook template tailored to Myket release dependencies.
    - Post-release audit checklist (download integrity, metadata parity, crash trend watch).

11. **Comparative Analysis**
    - Myket vs Google Play vs Cafe Bazaar (only where relevant and factual):
      - Submission flow
      - Policy strictness patterns
      - Billing differences
      - Operational implications
    - Identify where one-store assumptions break on Myket.

12. **Known Edge Cases & Failure Modes**
    - Collect all known pitfalls from docs + community + issue trackers (when credible).
    - For each: symptom, root cause, prevention, recovery.

13. **Practical Artifacts**
    - A complete **Go-Live Checklist** (preflight, build, compliance, metadata, rollout, monitoring).
    - A **Release Gate Template** with pass/fail criteria.
    - A **Myket Incident Playbook**.
    - A **90-day roadmap** for continuous optimization.

14. **Open Questions / Unknowns**
    - Explicit list of unresolved items requiring manual panel verification or Myket support confirmation.

## Research Scope Requirements
- Cover both technical and business/compliance perspectives.
- Include mobile engineering, DevOps, product, growth, legal/privacy, support operations.
- Include Persian-language official materials where relevant; provide English summaries.
- Do not stop at top-level docs; follow cross-links deeply.

## Method Constraints
- Use only publicly accessible, attributable sources unless explicitly marked as inaccessible.
- If a page is JS-rendered/gated, note that limitation and propose exact manual verification steps.
- When multiple sources disagree, show conflict and confidence level.

## Output Formatting Requirements
- Use clear headings and numbered sections matching deliverables.
- Include concise tables where useful (requirements matrix, API matrix, risk matrix).
- Every non-trivial claim must have source citations inline.
- End with:
  - **"Immediate Actions for Our Team (Next 7 Days)"**
  - **"Blocking Unknowns"**
  - **"Source Appendix (full URLs)"**

## Team Context to Optimize For
Assume we are preparing an Android app release pipeline with:
- CI/CD and server-to-server automation goals
- Strict need for reproducible builds in Iran network conditions
- Strong requirement for compliance-safe, low-rejection releases
- Need for direct-download fallback metadata consistency with store release notes

Now execute this deep research end-to-end and provide the full dossier.
