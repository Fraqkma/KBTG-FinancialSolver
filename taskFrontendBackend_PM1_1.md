# Frontend + Backend Workstream Task --- PM-1.1 Domain Engine, API, UI, and Quality

## Role

You are the **Frontend + Backend Engineer** for Adaptive Financial
Sorter (Flow Sync).

Your ownership is the PM-1.1 typed domain/API contract, Financial State
builder, deterministic allocation engine, explanation/validation
services, FastAPI lifecycle, React UX, typed client, and
domain/API/UI/E2E quality.

Data owns persistence/migrations/seed/repository internals.

Do not redefine PM product behavior.

Do not commit or push.

------------------------------------------------------------------------

## 1. Read first

Read completely before editing:

1.  `AGENTS.md`
2.  `task.md`
3.  `docs/PRODUCT_SPEC.md`
4.  `docs/USER_JOURNEY.md`
5.  `docs/FINANCIAL_RULES.md`
6.  `docs/TRANSACTION_CLASSIFICATION.md`
7.  `docs/SUBSCRIPTION_MANAGER.md`
8.  `docs/FINANCIAL_PERFORMANCE.md`
9.  `docs/DEMO_SCENARIO.md`
10. `docs/API_CONTRACT.md`
11. `docs/INTEGRATION_PLAN.md`
12. `docs/ARCHITECTURE.md`
13. `docs/IMPLEMENTATION_STATUS.md`

Then inspect the complete existing frontend/backend implementation and
tests.

PM-1.1 is authoritative.

Do not preserve Phase 1 financial behavior merely because code already
exists.

------------------------------------------------------------------------

## 2. Workstream boundary

You own:

-   `apps/api/app/schemas.py`
-   domain-facing typed snapshot/repository protocol
-   Financial State builder
-   classification service behavior
-   recurrence/subscription projection behavior
-   deterministic allocation engine
-   plan validator
-   structured reason/consequence builder
-   plan preview/recalculate/confirm/history services
-   FastAPI routes and error mapping
-   frontend types/client
-   Flow Sync UI
-   banking pages affected by PM-1.1
-   subscription UI
-   goal/preferences UI
-   domain/API/frontend/E2E tests

Data owns:

-   SQLAlchemy physical schema
-   Alembic
-   SQLite persistence
-   deterministic database seed implementation
-   repository persistence adapter
-   revision storage
-   atomic repository implementation
-   Data tests
-   `docs/DATA_MODEL.md`

Do not place SQLAlchemy queries in domain logic or React.

------------------------------------------------------------------------

## 3. First deliverable --- shared typed contract foundation

Before broad implementation, publish the small PM-1.1 typed foundation
that Data can consume.

Create/refactor a domain-facing protocol/module containing the stable
records required by `InputSnapshot` and repository operations.

The shared seam must be independent of SQLAlchemy ORM instances.

`InputSnapshot` semantics include:

``` text
user_id
period
as_of
state_version
accounts and balance evidence
current/history transactions and links
classification choices and remembered rules
recurring commitments/subscriptions/occurrences/effective history
financial preferences
policy version and values
goals and exclusive funding assignments
current/previous commitment references
immutable plans
realized contribution links
history/source completeness metadata
```

Define the repository protocol semantics from `INTEGRATION_PLAN.md`.

Keep the seam small enough that Data can implement it without importing
UI/service internals.

Do not invent a second competing contract.

------------------------------------------------------------------------

## 4. Preserve useful Phase 1 structure

Keep where useful:

-   React + TypeScript + Vite
-   FastAPI modular monolith
-   existing route shell
-   red/neutral original prototype styling
-   responsive navigation
-   current test toolchain
-   local Vite/FastAPI development flow

Replace/evolve incompatible Phase 1 behavior:

-   32,000 fixture assumptions
-   25%-of-income emergency rule
-   first-goal-only allocation
-   emergency duplicated as a Goal
-   client-supplied entire Financial State preview
-   process-local accepted-plan set
-   plan-ID-only confirmation
-   hardcoded +4.8% trend
-   fixed misleading dates
-   bulk page failure coupling
-   "Adjust coming later" behavior

Do not redesign the entire visual identity.

------------------------------------------------------------------------

## 5. Financial State builder

Build Financial State from `InputSnapshot`, never by importing fixture
globals.

Implement PM-1.1 semantics for:

-   recurring income
-   irregular income
-   gross/taxable optional information
-   explicit tax reserve
-   essential expenses
-   financial obligations
-   flexible spending
-   subscription commitments
-   subscription spending
-   upcoming commitments
-   available cash
-   minimum cash buffer
-   uncertain inflow quarantine
-   allocatable amount
-   cash shortfall
-   emergency balance
-   recommended emergency minimum
-   selected emergency target
-   emergency coverage
-   General Savings
-   goals/progress
-   existing commitments
-   historical disposable capacity
-   previous-period metrics
-   completeness/warnings

Paid expenses must not be subtracted from cash twice.

Transfers/refunds must not become income.

Confirmation must not alter actual balances.

------------------------------------------------------------------------

## 6. Emergency Fund --- PM-1.1

Implement:

``` text
Protected Monthly Outflow
=
Essential Expenses
+ Required Financial Obligations
+ Essential Subscriptions
```

Recommended minimum:

``` text
emergency_multiplier × Average Protected Monthly Outflow
```

Canonical:

``` text
13,500 × 3 = 40,500 THB
```

Only Essential-labelled subscriptions enter the denominator.

The canonical two subscriptions are `Keep`, so they remain excluded from
this calculation while still affecting normal costs/upcoming cash.

Use three complete history months and the documented fallback behavior.

One-off emergency expenses must not inflate recurring protected monthly
outflow.

Selected targets below recommendation are allowed with
warning/consequence.

No automatic money movement.

------------------------------------------------------------------------

## 7. Historical Disposable Capacity

Implement the exact PM-1.1 history policy.

Canonical:

``` text
June    12,000
July    16,000
August  14,000
Mean    14,000
```

Retain negative complete months.

Missing months are not zero.

Current month is separate.

No-history behavior must be explicit/provisional.

Historical capacity is a recurring planning guardrail, not guaranteed
future income.

------------------------------------------------------------------------

## 8. Allocation engine

Replace Phase 1 allocation logic with the deterministic procedure in
`FINANCIAL_RULES.md`.

Core conceptual order:

``` text
Required cash protection
→ Emergency recovery
→ Serious goals
→ Serious General Savings request
→ Normal goals
→ residual General Savings
→ unallocated
```

One-off irregular money follows the separate PM-1.1 path and must not
silently become recurring capacity.

Never allocate more than actual eligible cash.

Do not use opaque weighted goal scores.

Do not use a fixed percentage salary splitter.

------------------------------------------------------------------------

## 9. Serious constraint semantics

This is a critical acceptance requirement.

`Serious` has effect in the first planning period.

It does not require an existing commitment.

Serious means stronger recommendation constraint:

-   Serious destinations precede comparable Normal destinations after
    higher-level protection/recovery.
-   Existing confirmed commitment strengthens continuity.
-   Serious automatic request protects the larger applicable
    deadline/continuity request according to the frozen rules.
-   Lower-priority Normal goals and residual General Savings absorb
    reductions first.
-   If Serious is infeasible, fund only what is feasible and explain
    requested/funded/shortfall.
-   Serious never creates money or outranks required cash
    protection/Emergency recovery.
-   User can reduce Serious, including to zero.
-   Show old/new contribution and consequence.
-   Use one normal explicit confirmation.
-   Do not add repeated Serious-only confirmation dialogs.
-   No lock, fee, punishment, guilt, or debt semantics.

Goal ordering must match the frozen deterministic ordering.

General Savings follows global mode and has no extra destination
override in MVP.

------------------------------------------------------------------------

## 10. Classification

Implement the PM-1.1 transaction/inflow classification behavior.

Top-level template:

``` text
Income
Essential
Financial Obligation
Savings
Subscription
Flexible
Transfer
Other
```

Incoming direction alone never means Income.

Support distinctions such as:

``` text
recurring income
irregular income
transfer
refund
unknown inflow
```

Remember explicit choices only under safe scoped rules.

Material uncertainty must remain visible and must not be promoted to
fact.

Canonical +10,000 Scenario C inflow begins unresolved and unavailable
for planning until explicitly classified.

Avoid repeated questioning when a safe remembered rule exists.

------------------------------------------------------------------------

## 11. Subscription behavior

Implement the MVP Subscription Manager behavior:

-   active subscription list
-   billing interval
-   amount
-   monthly equivalent
-   next known charge
-   occurrence/payment status
-   labels such as Essential / Keep / Consider Cancelling
-   recurring commitment impact
-   spending trend where supported
-   upcoming full charge reservation

Label does not cancel a subscription.

Do not fake provider cancellation or usage integrations.

Unknown billing dates and annual/full-charge behavior must be honest.

------------------------------------------------------------------------

## 12. Plan lifecycle

Implement the PM-1.1 lifecycle:

``` text
Generate/Recalculate
→ immutable proposal version
→ Review
→ Preview adjustment
→ new immutable proposal version
→ Confirm exact reviewed version
→ tracked commitment
→ observed progress
→ future revised proposal if state changes
```

Confirmation:

-   references exact stored version
-   checks current revision/cash through repository transaction boundary
-   does not move money
-   does not create progress
-   does not rewrite old versions
-   supports idempotent retry
-   rejects stale state
-   preserves previous commitment on failure
-   explicitly supersedes only after successful replacement confirmation

Use Data repository protocol, not process-global state.

Until Data adapter is ready, use a fixture-backed repository
implementation behind the same protocol.

------------------------------------------------------------------------

## 13. Preview/edit behavior

Backend is authoritative.

Browser sends allowed adjustments, not a caller-authored Financial
State.

Support:

-   contribution edits
-   zero contribution
-   exact preservation of unspecified amounts
-   validation
-   recomputed unallocated amount
-   consequences/timelines
-   new proposal version
-   stale-state handling

Reject:

-   negative contribution
-   total over allocatable
-   unknown/duplicate destination
-   goal amount beyond remaining gap
-   invalid precision

General Savings has no target cap.

A user who wants Emergency saving above selected target must change the
selected target first according to the frozen contract.

------------------------------------------------------------------------

## 14. Structured explanations

Do not require external AI.

Return structured reason/consequence data sufficient for UI to explain:

-   why this amount
-   why this destination
-   what changed
-   what is protected
-   what is flexible
-   effect of user edit
-   Serious requested/funded/shortfall
-   conditional goal completion
-   emergency target/coverage/recovery
-   historical-capacity guardrail
-   unresolved classification
-   stale/recalculated plan

Keep reason codes deterministic and testable.

------------------------------------------------------------------------

## 15. Financial Performance

Remove arbitrary/hardcoded performance claims.

Use factual metrics from PM-1.1:

-   Income
-   Essential Expenses
-   Financial Obligations
-   Flexible Spending
-   Subscription Spending
-   Savings Rate
-   Emergency Coverage
-   Goal Progress
-   Available Cash
-   Historical Disposable Capacity
-   previous-period comparisons where coverage is valid

Clearly distinguish:

-   actual
-   expected/upcoming
-   planned/projected
-   realized

Confirmation cannot make planned saving become realized saving.

No arbitrary 0--100 financial score.

------------------------------------------------------------------------

## 16. Canonical scenarios

All runtime fixtures/expected-contract fixtures used by this workstream
must align with `DEMO_SCENARIO.md`.

### A --- normal

``` text
allocatable                 15,000
history recurring cap       14,000
Emergency                    3,750
Laptop                       5,000
Moving                       1,000
General Savings              4,250
Unallocated                  1,000
```

Emergency:

``` text
protected outflow           13,500
target                      40,500
actual balance              18,000
coverage                    1.3333 months
```

Confirm changes no actual balances/progress.

### B --- shock

After the 24,000 medical event:

``` text
allocatable                  9,000
Emergency                    6,750
Laptop                       2,250
Moving                           0
General Savings                  0
Unallocated                      0
```

Laptop conditional completion becomes May 2027.

Version 1 remains recorded until version 2 is explicitly confirmed.

### C --- stretch

+10,000 starts unresolved.

Before resolution it is quarantined.

After explicit irregular net-income resolution:

``` text
allocatable                 25,000
Emergency                   13,750
Laptop                       5,000
Moving                       1,000
General Savings              4,250
Unallocated                  1,000
```

Projected Emergency balance may become 31,750 only after actual
contribution; Confirm alone leaves actual 18,000.

Scenario C is stretch scope. Do not sacrifice A/B quality to complete C.

------------------------------------------------------------------------

## 17. Serious acceptance examples

Implement tests from Demo §8.

Critical first-period case:

``` text
post-shock allocatable       9,000
Emergency                    6,750
Moving Serious               1,000
Laptop Normal                1,250
```

No prior confirmation exists.

Serious moving must precede Normal laptop.

Manual Serious reduction:

``` text
Moving 1,000 → 500
Unallocated → 500
```

Show consequence and one normal Confirm.

Infeasible Serious case must fund higher-level protection first, then
only feasible Serious amount.

Global Serious General Savings behavior must match the frozen rules
without inventing a target/date/completion date.

------------------------------------------------------------------------

## 18. Frontend experience

Keep Flow Sync feeling like assistance rather than administration.

Follow:

``` text
Observe
→ Suggest
→ Explain
→ Allow Override
→ Remember Preference
```

Required surfaces:

### Home

-   truthful fixture date/metrics
-   optional Flow Sync entry
-   no fake successful banking actions

### Accounts

-   actual simulated balances
-   clear savings designations

### Activity

-   classification state
-   correction
-   remembered choice where appropriate
-   unknown inflow resolution
-   emergency confirmation/suggestion

### Goals

-   General Savings
-   named goals
-   create/edit/pause
-   optional date
-   importance
-   mode override
-   empty/no-goal state
-   conditional projected completion

### Money Overview

-   factual performance
-   actual vs planned
-   subscriptions
-   emergency coverage
-   history capacity

### Flow Sync Overview

-   source/completeness state
-   protected/upcoming costs
-   emergency state
-   goals/savings
-   historical capacity
-   recalculation state

### Plan

-   recommendation
-   structured reasons
-   protected vs flexible
-   editable amounts
-   preview
-   before/after consequences
-   version
-   confirm
-   stale/conflict/error states
-   history/progress

### Settings

-   Flow Sync enable/disable
-   global Normal/Serious
-   selected Emergency target
-   cash buffer
-   relevant defaults only

### Subscription Manager

A focused route is acceptable.

Do not perform unrelated visual redesign.

------------------------------------------------------------------------

## 19. Loading/error/edge states

Do not let a Flow Sync plan failure take down ordinary banking views.

Handle explicitly:

-   loading
-   empty data
-   no income but usable cash
-   zero capacity
-   cash shortfall
-   incomplete/limited history
-   negative history
-   material uncertain inflow
-   uncertain expense/emergency
-   no goals
-   undated goal
-   paused/completed goal
-   zero emergency denominator
-   lower emergency target warning
-   invalid adjustment
-   stale proposal
-   network error
-   confirmation conflict
-   confirmation storage failure

Frontend must not fabricate fallback sample results after backend
failure.

------------------------------------------------------------------------

## 20. API contract

Implement `docs/API_CONTRACT.md` as the wire authority.

Preserve:

-   two-decimal money strings
-   enums
-   versions/revisions
-   standard error envelopes
-   server-owned financial facts
-   preview adjustment semantics
-   exact-version confirmation
-   stale conflict behavior
-   history/progress semantics

Do not expose unnecessary internal ORM/storage fields.

Do not create extra endpoints simply because they are convenient if an
existing contract operation already covers the behavior.

------------------------------------------------------------------------

## 21. Required tests

### Backend/domain

Test at minimum:

-   exact money behavior
-   available cash/no double counting
-   transfer/refund/income distinctions
-   uncertain inflow quarantine
-   protected-outflow calculation
-   Essential vs Keep subscription denominator
-   emergency target/recovery
-   three-month historical capacity
-   no/limited/negative history
-   goal ordering
-   first-period Serious
-   Serious continuity
-   Serious infeasibility
-   Serious manual override
-   General Savings Normal/Serious behavior
-   no-goal state
-   undated/paused/completed goals
-   one-off irregular income path
-   A/B canonical outputs
-   C if implemented
-   invalid adjustment
-   structured reasons
-   stale version
-   exact preview preservation
-   confirmation no cash/progress mutation
-   idempotent/conflicting confirmation behavior through repository
    contract

### API

Test:

-   schema serialization
-   two-decimal money strings
-   standard errors
-   server-owned state
-   preview
-   confirm
-   history
-   recalculation
-   classification resolution
-   stale/conflict cases
-   account snapshots unchanged by Confirm

### Frontend

Use Vitest/RTL for meaningful component behavior:

-   factual rendering
-   empty/error/loading
-   edit/preview
-   Serious consequence
-   projected vs actual labels
-   no hardcoded trend/date claims

### Playwright

Keep E2E small and meaningful:

1.  Scenario A review → confirm
2.  Scenario B shock → revised plan → explicit replacement
3.  invalid edit → valid edit → confirm
4.  optional Scenario C if stretch implemented

Run desktop and 375px coverage.

No console errors.

Do not create a huge brittle E2E suite.

------------------------------------------------------------------------

## 22. Data integration gate

Develop first against fixture-backed implementations of the shared
repository/snapshot protocol.

When Data adapter is ready:

1.  inject it through dependency wiring;
2.  remove fixture-global reads;
3.  remove process-local acceptance;
4.  verify exact snapshot serialization;
5.  run A/B shared acceptance against persistence;
6.  verify restart persistence;
7.  verify stale/concurrent confirmation;
8.  switch backend/client/runtime fixture expectations to PM-1.1
    together.

Do not directly query the database from UI/domain services.

If Data has not finished, leave a clean fixture adapter and report
integration as pending rather than coupling to unfinished internals.

------------------------------------------------------------------------

## 23. Dependencies/security

Use synthetic data only.

Do not add:

-   real bank integration
-   real transfer
-   real provider cancellation
-   production authentication
-   ML/AI service
-   investment advice
-   credit scoring
-   fraud detection
-   microservices/queues/Redis/Kubernetes

Inspect dependencies before adding them.

No passwords, API keys or tokens in source.

Preserve fictional branding and visible prototype status.

------------------------------------------------------------------------

## 24. Documentation

Update factual implementation docs after work is complete:

-   `docs/ARCHITECTURE.md`
-   `docs/FLOW_SYNC.md`
-   `docs/IMPLEMENTATION_STATUS.md`
-   README where run/test commands changed

Do not rewrite PM-1.1 product rules.

Clearly distinguish:

-   implemented now
-   waiting for Data integration
-   deferred

------------------------------------------------------------------------

## 25. Before finishing

Run all relevant checks available in the repo:

-   backend tests
-   Ruff
-   frontend lint/typecheck
-   Vitest
-   production build
-   Playwright where runnable
-   dependency/security checks already supported by the repo

Also:

-   inspect `git diff`
-   run `git diff --check`
-   scan for secrets
-   scan for prohibited real-bank branding
-   verify no unrelated user work was overwritten

Do not commit or push.

------------------------------------------------------------------------

## 26. Final report

Return:

### Repository Assessment

What Phase 1 behavior was retained/replaced.

### Shared Contract Foundation

Typed snapshot/repository/API foundation published for Data.

### Financial State

Implemented semantics and edge states.

### Allocation Engine

PM-1.1 ordering and canonical outputs.

### Serious Constraint

First-period, continuity, infeasibility and override behavior.

### API / Lifecycle

Preview, versioning, confirmation, history and errors.

### Frontend

Screens and UX implemented.

### Tests

Commands and exact results.

### Data Integration

State one:

-   `FIXTURE ADAPTER READY — WAITING FOR DATA`
-   `DATA ADAPTER INTEGRATED`
-   `BLOCKED`

### Remaining Scope

Only genuine remaining work.

### Git Status

Confirm no commit/push.

Stop after this workstream implementation/handoff.
