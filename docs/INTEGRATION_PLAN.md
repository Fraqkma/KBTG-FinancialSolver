# Integration plan and specification freeze — PM-1.1

Freeze date: 2026-09-29. Scope: PM specification, contracts, handoffs and gap analysis only. Runtime remains Phase 1. **Data and Frontend+Backend are ready to start in parallel: YES**, against this contract, with the sequencing and acceptance gates below. This is implementation readiness, not release readiness.

PM-1.1 applies `taskPM_1_1_AMENDMENT.md` to the existing PM-1 freeze. Changes are limited to the protected-outflow emergency denominator and stronger Serious semantics, with resulting examples and acceptance expectations. Object/endpoint shapes stay compatible with PM-1; target contract/policy version becomes PM-1.1. No Phase 2 implementation is part of this amendment.

## 1. Repository assessment and evidence

Inspected root `AGENTS.md`, current `task.md`, `taskPM_MASTER.md`, original `HEAD:task.md`, both implementation task files, every pre-existing document, source routes/components/services/schemas/repository/fixtures, tests and configuration. `docs/CODEX-NAVIGATION-GUIDE.md` and repo `.agents/` are absent. The absence of a navigation guide does not prevent the handoff; actual paths below are the evidence.

| Surface | Observed Phase 1 behavior / evidence |
| --- | --- |
| UI | `apps/web/src/app/App.tsx`: eight routes, one bulk Promise.all load; both Flow Sync routes render the same component |
| Banking pages | `pages/BankingPages.tsx`: accounts/activity/goals/finance; some no-op buttons, fixed date, first-goal assumption, hardcoded +4.8% trend |
| Review | `pages/FlowSyncPage.tsx`: renders recommendations/reasons and acceptance; Adjust only displays a future-feature message |
| Client | `services/api.ts`, `types.ts`: typed reads and plan-ID-only confirm; no preview/edit/history methods |
| HTTP | `apps/api/app/main.py`: all eight original routes exist; preview accepts entire FinancialState from caller; confirm regenerates default plan, records ID in process-local set |
| Financial domain | `finance.py`: imports fixture globals directly; state aggregates one month; emergency contribution capped at income/4 then `GOALS[0]`; insufficient-income checks do not model actual cash/asset use |
| Repository | `repository.py`: deep-copy read adapter for three lists, not yet an abstraction used by the state builder |
| Schemas | `schemas.py`: integer THB, string categories/priority, no version/confirmation/history/recurrence model |
| Fixture | `mock_data.py`: salary 32,000; essentials 12,600; flexible 6,400; plan capacity 13,000; emergency 18,500/60,000; laptop 9,200/30,000; total account balance 52,480 |
| Tests | 3 finance + 3 API pytest tests, 3 React tests and 1 Playwright journey (desktop then 375px); fixture copies and process-global acceptance state |
| Tooling | React/TypeScript/Vite, React Router, plain CSS, FastAPI, Ruff/pytest/Vitest/Playwright; no database/migrations, Docker setup or CI pipeline in this checkout |

Current code yields emergency 8,000 and laptop 5,000 from the 13,000 remainder. Food categories all count as discretionary; emergency savings also appear as a second goal. Account balances are static fixtures rather than a reconciled ledger. None of these Phase 1 shortcuts is final policy. This pass does not claim fresh execution of the existing application tests.

## 2. Frozen PM decisions

| Decision | Source of truth |
| --- | --- |
| Optional decision layer with four connected pillars; synthetic/offline only | [Product specification](PRODUCT_SPEC.md) |
| Monthly Bangkok periods, exact two-decimal THB, net-income demo | [Financial rules](FINANCIAL_RULES.md) §§1–3 |
| Separate actual cash, unpaid commitments, savings stocks and planned contributions | Financial rules §2 |
| Eight categories, explicit inflow kind/provenance; uncertain inflow excluded | [Classification](TRANSACTION_CLASSIFICATION.md) |
| Monthly-equivalent subscription metric separate from actual full charges | [Subscription Manager](SUBSCRIPTION_MANAGER.md) |
| Three complete history months; negative months retained; documented fallbacks | Financial rules §5 |
| Emergency recommendation 3× Average Protected Monthly Outflow (essentials + required obligations + Essential subscriptions), editable target, six-month gap recovery | Financial rules §4 |
| Needs/history allocation, lexicographic goal priority, General Savings without named goal | Financial rules §6 |
| Serious priority from the first period after required protection/recovery; prior commitment adds continuity; lower-priority reductions first; overridable with one normal confirmation | Financial rules §§6–7 |
| Exact-version confirmation, observed progress, immutable history, explicit replacement | Financial rules §7; [API](API_CONTRACT.md) |
| Material event prompts with quiet metric refresh; manual recalculation | Financial rules §8 |
| Actual/expected/planned factual metrics, comparable trends; no score | [Performance](FINANCIAL_PERFORMANCE.md) |
| Baseline 30,000 income / 15,000 normal cost; A/B and optional C reconciled | [Demo](DEMO_SCENARIO.md) |

Numerical defaults and edge cases that the master delegated to this pass are labelled PM-1.1 prototype policy, captured in plan snapshots and centrally configurable. They are frozen for implementation, not production financial guidance. Do not replace them independently with fixed percentages, opaque goal weights or a new demo story.

## 3. Phase 1 gap analysis

KEEP preserves a useful component; MODIFY evolves it; REPLACE removes an incompatible behavior behind its existing boundary; DEFER is outside this implementation scope. One surface may have both preserved presentation and replaced semantics.

| Component | Disposition | Required next change / owner |
| --- | --- | --- |
| Banking shell, red/neutral styling, mobile navigation | KEEP | Frontend+Backend retains layout; update dynamic data and truthful action states |
| Local Vite proxy/FastAPI modular monolith | KEEP | No infrastructure redesign |
| Mock allocation rule | REPLACE | Frontend+Backend implements Financial rules §6, multiple goals, General Savings, history and emergency recovery |
| Financial State | MODIFY | Frontend+Backend replaces fixture imports with snapshot input; distinguish cash/stocks/upcoming/unknown/history |
| Goals | MODIFY | Data persists exclusive funding and definitions; Frontend+Backend adds optional date, importance, mode, edits, no-goal behavior; remove emergency-as-goal duplication |
| Flow Sync page | MODIFY | Opt-in, sources/coverage, required costs, general saving, history and recalculation states |
| Plan page | MODIFY | Separate review state from overview; editable contributions, server preview, before/after consequences |
| Confirmation behavior | REPLACE | Exact reviewed version with atomic persistence, replay protection, stale/conflict rejection and history |
| Mock repository | REPLACE adapter; KEEP seam | Data implements persistence/reconciled seed; Frontend+Backend uses injectable snapshot/service boundary |
| API schemas/client | MODIFY (breaking coordinated contract) | Decimal strings, enums, envelopes, versions and standard errors; same route concepts |
| Transaction categories | REPLACE semantics | Typed template, income kinds, suggestions/remembered rules, refund/transfer/emergency links |
| Subscriptions | MODIFY from recurring flags | Data schedules/occurrences; Frontend+Backend manager, matching, reservations and trends |
| Tests | KEEP tools and useful assertions; MODIFY fixtures | Canonical A/B/C, financial invariants, lifecycle/concurrency, empty/failure cases; no stale Phase 1 numeric assertions |
| Documentation | MODIFY | PM-1.1 authority with current-vs-target labels; real commands retained; implementation status updated per handoff |
| Add money/New account/provider cancel, real payment/auth | DEFER | Hide/disable unsupported controls; no fake success |
| Custom taxonomy administration, nonmonthly UI, advanced policy UI, external services | DEFER | Preserve simple extension points only |

Specific risks to close during implementation: available cash currently conflated with income remainder; preview permits inconsistent client state; confirm cannot preserve adjustments or survive restart; no exact paid/upcoming matching; UI error in any bulk request takes down all pages; first-goal access crashes an empty dataset; hardcoded trend has no evidence. These are recorded implementation gaps, not silently fixed in this PM pass.

## 4. Data handoff

Read [Financial rules](FINANCIAL_RULES.md), [Demo](DEMO_SCENARIO.md) and [API](API_CONTRACT.md) before designing storage. Preferred SQLAlchemy/Alembic, SQLite locally, PostgreSQL-compatible constraints. Physical tables, relationship implementation and exact DTO filenames belong to Data; no warehouse or double-entry banking platform is required.

| Product data | Persist | Derive / cache policy |
| --- | --- | --- |
| Demo user and accounts | Stable IDs, currency, purpose, opening balance/as-of, synthetic display/mask; posted transactions | Current balance from opening + signed activity, or persisted checked balance maintained atomically; never two unverified truths |
| Transactions | ID/account, signed exact amount/time, description, counterparty key, pair/event/refund/income-reversal/occurrence links | Direction checked against sign; summaries derived |
| Classifications | Current explicit choice, provenance/resolution, emergency confirmation, tax treatment, audit of corrections | Suggestions derived and may be stored as labelled evidence; do not promote guesses to facts |
| Remembered choices | Scoped source/direction/series rule and user consent/enabled flag | Match deterministically; no generic text-only auto-income rule |
| Recurring transactions/obligations | Confirmed schedule/type/amount/anchor/effective revisions; occurrence IDs, due amounts, payment match, paid/waived status | Future occurrences may be generated deterministically; persist identity/status needed to prevent duplicate reservation |
| Subscriptions | Record, billing interval/anchor, amount, effective label history, active/end facts, source links/history | Monthly equivalent/next date derived; full charge occurrences; only Essential-labelled costs enter emergency denominator |
| Financial preferences | Enabled flag, global mode, selected emergency target (nullable), cash buffer | Effective defaults derived from versioned policy; no unused risk-profile/age fields required |
| Emergency Fund | Exclusive account/bucket designation and linked funding/use records; historical essentials/required obligations/Essential subscription evidence | Balance, protected-outflow mean, target recommendation, coverage and recovery derived; never a Goal |
| General Savings | Exclusive funding designation; no mandatory name/date/target | Balance from funding, not duplicated in goals |
| Goals | Name/description, target/date, importance, mode override, active/paused/completed state, funding assignments | Current amount, progress, effective order/contribution and dates derived |
| Constraints | Global/per-goal preferences and policy version/config used at calculation | Effective modes/priority computed by domain; no independent arbitrary ranking table |
| Plans/items | Family ID/period, monotonic version, immutable snapshot, exact allocations/splits, reasons/consequences, assumptions, creation time | Live staleness/feasibility and display status derived from source revision/confirmation links |
| Confirmations/history | Exact version reference, idempotency key+request fingerprint/result, time, prior confirmation, one active per period | Superseded status derived; no deletion or rewrite of content |
| Progress | Posted contribution assignment/unique source transaction pair, destination, period, recurring/irregular funding attribution | Net realized/outstanding amounts derived; confirm cannot synthesize progress |
| Historical metrics | Retain original transactions, schedule revisions, classification/effective subscription-label history and dated balance/funding snapshots sufficient for cutoff reconstruction | Metrics/capacity and three protected-outflow components recomputed; no analytics cache required for small demo |
| Policy/input snapshots | Immutable policy values/version, source inputs or immutable copies resolving referenced snapshot IDs | Never depend only on mutable current records to reproduce a plan |

Period summaries may later be cached with source revision, period, cutoff and policy version. Caches are disposable; no cached result is authoritative for confirmation. MVP has no performance justification for additional caching infrastructure.

Data's PM-1.1 seed must retain monthly 12,000 essentials, 1,500 required obligations and zero Essential subscription cost for June–August; both 600-total services remain Keep. Preserve component amounts, source IDs/periods, effective labels, completeness/fallback evidence and policy so the 13,500 average and 40,500 recommendation are reproducible. Do not store the 24,000 one-off shock as recurring protected outflow or rewrite historical labels on an edit. Account/transaction amounts stay as specified; only generated target/plan expectations change. Existing proposal/confirmation snapshots retain their original policy and reason facts.

### Shared repository seam

Use typed domain records independent of SQL sessions/ORM instances. Field semantics are the API definitions, with exact decimal money internally. `InputSnapshot` comprises:

```text
user_id, period, as_of, state_version
accounts + opening/as_of balance evidence
transactions for current period and history window (including transfer/refund links)
classification choices and active remembered rules
recurring commitment/subscription records, occurrences and effective label/cost history
preferences + policy_version + full policy values
goal definitions + exclusive funding assignments
current-period and immediately previous-period confirmed references + immutable plans + realized contribution links
historical cutoff/source completeness metadata
```

The snapshot must be consistent across all reads. State builder and engine take it as an argument; no import of fixture globals. Stable logical operations (internal names can follow project style without changing meaning):

```text
read_snapshot(user_id, period, as_of) -> InputSnapshot
read_accounts / read_transactions / read_goals / read_subscriptions -> typed records + revision
update_preferences / classify_transaction / save_goal /
  save_subscription / update_recurring_commitment(command, expected_revision)
  -> updated record + new revision, or conflict (atomic)
save_proposal(immutable_plan, input_snapshot, expected_revision) -> PlanVersion
read_plan(plan_id, version) -> exact immutable PlanVersion or not-found
read_current_commitment(user_id, period) -> Commitment or null
read_plan_history(user_id, optional_period) -> ordered immutable versions
confirm_plan(plan_id, version, expected_revision, expected_confirmation_id,
             idempotency_key, request_fingerprint, confirmed_at)
  -> ConfirmationResult or typed conflict (atomic)
```

Frontend+Backend performs financial validation. Data provides a transaction/unit-of-work allowing that validation to use the same checked revision and cash snapshot that is committed. An optimistic revision compare-and-swap at save is acceptable: if any relevant source changed after validation, abort with conflict. Data guarantees uniqueness, reference integrity, no duplicate contribution/occurrence match, all-or-nothing writes and replay behavior. Never accept “validated earlier” without a concurrency check.

No separate endpoint or operation writes money merely because a plan is confirmed. Seed/application of the medical scenario is an explicit local fixture operation. Closing/reopening a DB session or restarting the API must preserve inputs, exact plans and confirmation history.

### Data can begin now

Design `docs/DATA_MODEL.md` and an ER diagram; implement migrations, persistence adapter, revision tracking, immutable snapshots, deterministic June–September seed and local A/B/C branches. Add repository tests for conservation, financial precision, repeat seeding, matching uniqueness, invalid references, rollback, exact reload and duplicate/concurrent confirmation. Wire the adapter only at the integration gate. Keep frontend/backend services outside Data's ownership.

## 5. Frontend+Backend handoff

### Required services and ownership

| Service/responsibility | Required output |
| --- | --- |
| Classification | Typed suggestion/remembered choice, material uncertainty handling, income/refund/transfer validation |
| Recurrence/subscription projection | Paid/unpaid occurrences, full cash reservation, monthly equivalent and next date |
| Financial State builder | Snapshot-driven actual/expected state, cash capacity, emergency coverage/history, warnings |
| Allocation engine | Rules §6, first-period Serious priority, continuity when available, higher protection/recovery first, recurring/one-off split and General Savings following global mode |
| Validator | Boundary and invariant errors, no double count, no hidden obligation omission |
| Explanation/consequence builder | Structured reason registry, comparisons, conditional completion/coverage |
| Plan service | Generate/recalculate/preview exact versions, transaction-safe confirmation via repository, history/progress |
| Performance | Actual/planned separation, matched coverage and factual trends |
| HTTP/client | API_CONTRACT models, error mapping, typed client; no finance logic in React |

Use fixture-backed implementations of `InputSnapshot` and repository contracts until Data adapter is ready. Preserve the existing route shell and CSS; separate feature loading/errors so failure to generate a plan does not hide ordinary account/activity views.

Frontend+Backend must apply Serious before Normal requests even with `existing_commitments=[]`. Within Serious goals order by importance, deadline, gap, existing commitment, stable ID; protect a Serious General Savings request after Serious goals and before Normal goals as specified in rules §6. Explain any infeasible Serious request using requested/funded/shortfall facts and conditional timing or projected saving/coverage effects. Manual reductions show old/new amounts and remain cash-valid overrides, saved through one normal explicit confirmation. No repeated Serious-only dialogs or silently replaced commitments. Keep `Mode=normal|serious`, per-goal override and existing preview shapes; the expanded reason facts supply the explanation.

### Screen acceptance

Home uses real fixture dates and metrics, optional Flow Sync entry and no fake banking actions. Accounts label actual simulated balances. Activity adds correction/remember/unknown/emergency states. Goals supports no named goal, General Savings, create/edit/pause, optional importance/mode and conditional dates. Money overview adds factual performance and subscription links. Flow Sync overview shows source state/required costs; Plan owns review/edit/preview/versioned confirm/history. Settings controls opt-in and defaults. Subscription Manager can be a new focused route; no unrelated redesign.

All loading, empty, no-income, limited-history, material uncertainty, shortfall, invalid adjustment, stale preview, network failure and failed-confirmation states follow [User journey](USER_JOURNEY.md). Backend remains authoritative; frontend arithmetic is formatting/progress presentation only. Any displayed future amount is labelled projected and cannot become actual progress on Confirm.

### Required automated acceptance scenarios

| Gate | Essential assertions |
| --- | --- |
| A normal month | 13,500 protected outflow, 40,500 target, 1.3333 actual coverage; 3,750 emergency + 5,000 laptop + 1,000 moving + 4,250 General Savings + 1,000 unallocated = 15,000; confirm/reload/restart leaves cash/progress unchanged |
| B shock | Protect unpaid 1,900 + buffer 2,000; 6,750 emergency + 2,250 laptop = 9,000; Normal moving/General Savings/unallocated zero; laptop May 2027; A retained until explicit replacement |
| C stretch | Unknown +10,000 excluded until resolved; confirmed net income gives emergency 13,750 (3,750 recurring + 10,000 one-off), laptop 5,000, moving 1,000, General Savings 4,250, unallocated 1,000; projected emergency 31,750 / coverage 2.3519, actual unchanged |
| Adjust invalid/valid | Over-cap/negative rejected, prior version safe; laptop 2,000 preview has unallocated 4,000 and exact adjusted values after confirm/restart |
| Modes and goals | Demo §8: no prior confirmation, first-period Serious moving 1,000 precedes Normal laptop 1,250 after emergency 6,750; continuity is additional; infeasible variant funds Serious only 500 after higher protection; manual 1,000→500 gives August 2027 and unallocated 500 with one Confirm; no-goal/undated/paused/completed cases explicit |
| General Savings mode | Follows global mode with no new override; first-period Serious default request 4,250 in A; §8 continuity request 1,000 precedes Normal laptop; editable without target/date/description or invented completion date |
| Emergency denominator | Obligations included; Keep/Consider Cancelling excluded; Essential-labelled subscription history variant gives 13,700 average / 41,100 target; preserve source evidence, fallbacks, zero denominator and lower-target warning without blocking |
| Classification/subscriptions | Recall user rule, correct it, unique payment matching, annual full-charge reservation, unknown date, label does not cancel, no tax duplication |
| Financial edge cases | No income with cash, zero capacity, genuine shortfall, incomplete history, negative history, refund, zero denominators and destination caps |
| Lifecycle conflicts | Changed source while preview open, duplicate key replay, key/body mismatch, competing confirms, storage failure rollback |
| UI/E2E | Small meaningful flows: A; B; invalid then valid edit; optional C. Keyboard errors, honest no-op controls, desktop and 375px layout, no console errors |

Retain useful existing invariants/error/navigation assertions; migrate fixture copies to shared expected-contract data. The current API test does not prove balance invariance despite its name; assert account snapshots before/after. Isolate the process-global confirmation state until it is replaced so tests do not depend on order.

## 6. Parallel ownership and merge sequence

| Surface | Owner | Coordination rule |
| --- | --- | --- |
| Product rules, API meaning and canonical scenario | PM docs | Neither implementation workstream changes meaning independently |
| `apps/api/app/schemas.py` and domain-facing snapshot DTO/protocol module | Frontend+Backend | Publish typed skeleton from PM-1.1 first; Data consumes these types and proposes changes for review |
| `apps/api/app/repository.py`, new persistence/migrations/seed files | Data | Preserve protocol; Frontend+Backend uses a separate fixture adapter to avoid overlapping edits |
| `finance.py`, `main.py`, new domain/services, web source/client | Frontend+Backend | Integrate repository through dependency injection; no DB queries in UI/domain |
| Data tests / domain/API/UI/E2E tests | Respective owners | Shared canonical fixture expectations; no duplicate contradictory story |
| Requirements/env/setup | Data proposes persistence dependencies; Frontend+Backend integrates entrypoint | Coordinate one change; preserve local placeholders and ignore rules |
| Architecture/status/README | Integrating workstream | Merge factual deltas after each gate; maintain current-vs-target distinction |

1. **Contract foundation:** land PM-1.1 documents and small typed contract/protocol skeleton as the first implementation slice. No DB choice changes the wire schema. Workstreams can already begin schema design/migrations and UI/service scaffolding against these docs in parallel.
2. **Parallel build:** Data implements local persistence and canonical seed; Frontend+Backend builds services/UI against the same snapshot fixtures. Keep existing runnable path until a coherent replacement is ready.
3. **Persistence integration:** apply migrations and seed intentionally, inject Data adapter, remove fixture-global reads and process-local acceptance. Validate schema/serialization and exact snapshot reload before replacing the demo path.
4. **Coordinated contract switch:** backend, typed client, fixture expectations and UI move to PM-1.1 together. Replace the old 32,000 values and fixed trend/date labels in runtime/tests. No mixed amount units or accepted/confirmed semantics.
5. **Acceptance:** A/B, lifecycle/edge cases, shared invariant suite and responsive journey pass; C only if stretch scope is included. Audit dependencies when added; update implementation docs with actual commands/results.

These are future integration steps, not authorization in this PM task to commit, merge, push, deploy or run the implementation workstreams. No branch changes or implementation agents are started here.

## 7. Freeze gate: 20 answers without guessing

| # | Question | Answer / specification location |
| --- | --- | --- |
| 1 | What is Flow Sync? | Optional decision layer; Product specification, Capability |
| 2 | In/out of MVP? | Four pillars + review/commitment/performance; Product specification, Scope/Non-goals |
| 3 | What data? | Financial rules §1–2 and Data handoff table |
| 4 | How classify transactions/income? | Eight parents, explicit inflow kind, remembered evidence and conservative unknowns; Classification |
| 5 | Subscriptions? | Full due charge once, monthly equivalent metric separately; Subscription Manager |
| 6 | Financial State? | Derived typed snapshot, dictionary/formula in Financial rules §2 and API objects |
| 7 | Allocation priority? | Required cash → recovery → Serious goals/saving requests → Normal goals → residual General Savings → remaining; Financial rules §6 |
| 8 | Emergency Fund? | Three-times average protected outflow (essentials + required obligations + Essential subscriptions), editable target, six-month recovery; §4 |
| 9 | General Savings vs goals? | Unnamed/undated saving vs optional target definition; Product/Rules §6 |
| 10 | Goal priority? | Serious first even without confirmation; then importance, date, gap, existing commitment, ID; Rules §6 |
| 11 | Normal/Serious? | Adaptive default vs stronger contribution protection from first period, with additional commitment continuity; overridable, no lock or extra confirmation; Rules §6 |
| 12 | Overrides? | Amounts/modes/targets/classifications/preferences within actual cash; Journey, Adjust |
| 13 | Confirm? | Persist exact versioned commitment, no cash movement; Rules §7/API |
| 14 | Recalculate when? | Event table, thresholds and manual action; Rules §8 |
| 15 | Extra income? | Resolve type/tax, separate one-off use, respect current gaps; Rules §3/6, Demo C |
| 16 | Emergency? | Confirm event meaning, observe use, propose recovery, review replacement; Demo B/Journey |
| 17 | Performance? | Factual actual/planned metrics and comparable periods; Performance |
| 18 | Data implementation? | Persistence/precision/snapshots/seed/repositories; §4 here |
| 19 | Frontend+Backend implementation? | Services/screens/validation/lifecycle/tests; §5 here |
| 20 | Workstream interfaces? | Snapshot/atomic repository operations + API schema and ownership; §4/6 and API |

## 8. Risks and genuine open issues

No unresolved product decision prevents parallel start. PM-1.1 deliberately chooses the default history/recovery windows, money format, cash buffer, goal ordering, tax assumptions and lifecycle rather than leaving them to independent interpretations.

Implementation risks remain: atomic confirmation in SQLite, exact snapshot reconstruction, paired transfer/occurrence deduplication and simultaneous contract migration require tests. SQLite/PostgreSQL representation and transaction mechanism are Data engineering choices bounded by the acceptance contract. The real runtime still shows the Phase 1 story until the coordinated switch. Subscription usage/provider control, full tax support and nonmonthly planning are deferred rather than unresolved MVP questions.

Older workstream task examples (including `taskPM.md` references, salary 32,000 and subscription/debt category suggestions) must not override PM-1.1. Those user-owned task files were preserved in this pass. Missing navigation/optional skill template are tooling omissions, not product blockers.

## 9. Historical PM-1 verification record

The original PM-1 pass changed documentation only. Its recorded checks covered all nine required PM outputs, source-vs-target labels, 20 freeze answers and 20 explicit API operations: 14 documents, 66 relative links, three JSON examples, Markdown fences/tables and seven canonical numeric tables. Its numeric expectations are superseded by the PM-1.1 reconciliation; historical application test results are not new amendment evidence.

`git diff --check` found no whitespace errors. Repository secret-pattern and public-facing prohibited-brand scans found no matches; these are targeted scans, not a comprehensive security audit. README and four existing docs were updated, nine PM docs added, and the pre-existing task-file changes preserved. No application tests were run because no application/configuration/dependency files changed. Historical Phase 1 check results remain labelled historical in [Implementation status](IMPLEMENTATION_STATUS.md). No commit or push was performed.

## 10. PM-1.1 amendment verification and parallel start

The amendment remains documentation-only: README and 13 documents changed; pre-edit file hashes confirm that runtime, tests, configuration, dependencies and user-owned task files are unchanged. Existing uncommitted PM-1 work was amended in place, not reset. Reviewed the amendment diff separately from the pre-existing Git changes, including untracked PM documents.

Exact-decimal checks passed for all nine demo tables: normal/history totals, paid/unpaid costs, account conservation, 13,500 protected-outflow mean, 40,500 target, gaps/recovery, A/B/C allocations within cash, projected balances/coverage, unchanged planned/realized rates, A override and B's May 2027 completion. Separate Serious examples verify first-period priority without confirmation, infeasibility after higher-level protection, global General Savings mode and override consequences. A lower target remains allowed; Essential subscription history is included and Keep subscriptions remain excluded.

Local documentation validation passed 193 assertions over 14 documents, 69 relative links (including anchors), four JSON examples, 30 Markdown tables and unchanged API object schema blocks. Semantic review found no stale emergency target of 36,000 or Serious priority conditional on prior commitment; B's 36,000 Essential expense total is valid and explicitly distinguished. Target contract/policy labels are PM-1.1; PM-1 references denote amendment ancestry or historical checks only.

`git diff --check` passed. Targeted secret-pattern and prohibited-brand scans found no matches. No application tests were rerun because application behavior did not change. No Phase 2 implementation, commit or push was performed.

**Parallel start decision: YES.** Data can begin the existing storage/snapshot/seed handoff with protected-outflow component and label evidence. Frontend+Backend can begin the existing service/UI handoff with first-period Serious ordering, amended numeric expectations and structured consequences. Publish the shared typed snapshot/protocol foundation first and integrate through §6's gates; no additional product/API schema blocker was introduced. The running prototype still needs that separate implementation work.
