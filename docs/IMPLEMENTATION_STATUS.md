# Implementation status

As of the 2026-09-29 PM-1.1 amendment: **PM-1.1 specification frozen; runtime remains Phase 1.** [Integration plan](INTEGRATION_PLAN.md) is the handoff and gap-analysis authority. The Data and Frontend+Backend workstreams may begin in parallel against the amended contracts.

## Completed

- Vite + React + TypeScript frontend and FastAPI modular monolith.
- Banking overview, accounts, activity, goals, money overview, Flow Sync state/plan and settings routes.
- Central deterministic fictional mock data, typed API contracts and mock repository seam.
- Deterministic explainable allocation policy and financial validation.
- Simulated plan acceptance; no money movement.
- Local configuration template, ignore rules and project documentation.
- Python domain/API tests, React interaction/error tests and a Playwright user journey.
- PM-1.1 product specification, user journey, financial rules, transaction classification, Subscription Manager, factual performance metrics, canonical demo, API contract and integration plan.
- Concrete Data persistence/snapshot/repository handoff and Frontend+Backend screen/service/test handoff, with ownership, merge sequence and 20 specification-freeze answers.
- PM-1.1 protected-outflow emergency denominator (13,500 THB; recommended target 40,500), recalculated A/B/C examples, first-period Serious priority/override consequences and compatible API reason facts.

## In Progress

- No implementation workstream was started during the PM pass.

## Historical Phase 1 verification (not rerun by the PM pass)

- Frontend lint, 3 Vitest checks and production build pass.
- Backend Ruff and 6 pytest checks pass.
- Playwright desktop-to-mobile review flow passes on Microsoft Edge.
- `npm audit --audit-level=moderate` reports 0 vulnerabilities.
- Pytest emits a non-blocking Starlette/httpx deprecation warning; all checks pass.

## Historical PM-1 specification verification

- Reviewed the nine PM documents against the task, current code and all 20 freeze questions.
- Checked 66 relative links across 14 documents, three JSON examples and Markdown table/fence structure.
- Reconciled seven demo tables, historical account conservation, A/B/C allocation sums, cash quarantine, saving rates and conditional goal dates using exact decimal arithmetic.
- Reviewed the diff/status and passed `git diff --check`; targeted secret and public-facing prohibited-brand scans found no matches.
- Documentation-only change: no application tests rerun, no code/config/dependency changes, no commit or push. Existing user task-file changes remain intact.

## PM-1.1 amendment verification

- Exact-decimal specification checks passed: nine demo tables, unchanged historical/account conservation, A/B/C capacity and allocation sums, gaps/recovery, projected balances/coverage, rates, override totals and conditional dates.
- First-period Serious example, infeasible Serious shortfall, required protection/recovery precedence, General Savings global-mode behavior and one-confirm override consequences reconciled. Canonical B still has Normal goals.
- Checked 14 documents, 69 relative links including anchors, four JSON examples and 30 Markdown tables; 193 local assertions passed. PM-1 API object schema blocks are unchanged.
- Reviewed emergency/Essential-subscription and Serious semantics across documents; no stale 36,000 emergency target or prior-confirmation prerequisite remains. B's 36,000 Essential expense total is intentionally retained.
- `git diff --check` passed; targeted secret and prohibited-brand scans found no matches. Reviewed amendment differences against a pre-edit snapshot as well as Git status/diff, including previously untracked PM documents.
- File hashes confirm only README and 13 docs changed in this amendment. Pre-existing task-file edits are untouched; runtime, tests, configuration and dependencies are unchanged. Application tests were not rerun for this documentation-only task. No Phase 2 implementation, commit or push.

## Not Started

- PM-1.1 persistent storage, source revisions, immutable plan snapshots, exact confirmation/history and progress tracking.
- PM-1.1 classifications, recurring occurrences, Subscription Manager, General Savings, multiple goals/modes and needs/history allocation policy.
- PM-1.1 UI adjustments, API/schema migration, canonical 30,000/15,000 seed and A/B acceptance tests (C stretch).
- Production authentication, financial-institution integration and real transfers are explicitly deferred/non-goals, not pending MVP requirements.

## Known Issues

- Plan acceptance is held only in API process memory; API restart resets it.
- Frontend and API are independent local processes; both must be running.
- The demo policy uses one static profile and simplified constraints.
- The current API preview trusts a supplied state and confirm regenerates the default plan instead of persisting an edited version.
- Runtime uses the historical 32,000 fixture; PM-1.1's canonical demo is documented but not yet implemented. Seed, API, UI and tests must switch together.
- UI has no-op controls, a hardcoded +4.8% trend and a first-goal assumption; the integration plan records their required changes.

## Known Limitations

- This illustrates product context and data boundaries; it is not a financial recommendation service.
- Goal allocation uses a single active goal, with reserve priority ahead of it.
- Playwright browser execution may require installing Chromium on the development machine.

## Next Recommended Work

Begin the Data and Frontend+Backend tasks using the frozen [Integration plan](INTEGRATION_PLAN.md), [Financial rules](FINANCIAL_RULES.md), [API contract](API_CONTRACT.md) and [Demo scenario](DEMO_SCENARIO.md). Produce the shared typed snapshot/protocol foundation, then work in parallel and integrate at the documented gates. This PM task stops here; no Phase 2 implementation, commit or push was performed.
