# Data Workstream Task --- PM-1.1 Persistence, Snapshot, Seed, and Repository

## Role

You are the **Data / Persistence Engineer** for Adaptive Financial
Sorter (Flow Sync).

Your ownership is the persistence layer, deterministic financial data,
migrations, repository implementation, revision/concurrency guarantees,
and data-level tests.

Do not redefine product behavior or implement frontend/business
allocation logic owned by the Frontend+Backend workstream.

Do not commit or push.

------------------------------------------------------------------------

## 1. Read first

Read completely before editing:

1.  `AGENTS.md`
2.  `task.md`
3.  `docs/PRODUCT_SPEC.md`
4.  `docs/FINANCIAL_RULES.md`
5.  `docs/TRANSACTION_CLASSIFICATION.md`
6.  `docs/SUBSCRIPTION_MANAGER.md`
7.  `docs/FINANCIAL_PERFORMANCE.md`
8.  `docs/DEMO_SCENARIO.md`
9.  `docs/API_CONTRACT.md`
10. `docs/INTEGRATION_PLAN.md`
11. `docs/ARCHITECTURE.md`
12. `docs/IMPLEMENTATION_STATUS.md`

Also inspect the existing API repository, schemas, fixtures, tests,
requirements, and database/configuration state before making changes.

PM-1.1 documentation is authoritative. Phase 1 fixture values and
allocation assumptions are not.

Do not use the old 32,000 THB Phase 1 scenario as the new seed.

------------------------------------------------------------------------

## 2. Workstream boundary

You own:

-   SQLAlchemy persistence model
-   Alembic migrations
-   SQLite local persistence
-   PostgreSQL-compatible schema choices
-   deterministic canonical seed data
-   transaction/occurrence matching persistence
-   exclusive savings funding records
-   immutable proposal/snapshot persistence
-   confirmation history persistence
-   revision/concurrency support
-   repository adapter
-   repository/data integrity tests
-   `docs/DATA_MODEL.md`
-   ER/data relationship documentation

Frontend+Backend owns:

-   PM-1.1 API/domain schema skeleton
-   Financial State calculation
-   classification service behavior
-   allocation engine
-   recommendation/explanation logic
-   validation/business rules
-   FastAPI endpoint behavior
-   React UI/client
-   domain/API/E2E tests

Do not edit product rules to fit a convenient database design.

------------------------------------------------------------------------

## 3. Coordination rule

`apps/api/app/schemas.py` and the domain-facing snapshot/protocol
definitions are owned by Frontend+Backend.

Do not independently rewrite those contracts.

If the typed PM-1.1 protocol skeleton already exists, implement against
it.

If it does not exist yet:

-   continue with data model, migrations, deterministic seed, repository
    internals, and tests that do not require final adapter wiring;
-   define any temporary internal types only behind the Data
    implementation;
-   record the exact protocol dependency in the final report;
-   do not seize ownership of the shared schema file.

`apps/api/app/repository.py` and new persistence/migration/seed modules
are Data-owned for this workstream.

Do not wire the database into the production request path until the
integration gate.

------------------------------------------------------------------------

## 4. Persistence goals

Replace the Phase 1 deep-copy/mock persistence behavior with a real
local persistence foundation.

Use:

-   SQLAlchemy
-   Alembic
-   SQLite for local/demo execution
-   PostgreSQL-compatible types/constraints where practical

Avoid:

-   microservices
-   Redis
-   queues
-   warehouses
-   event streaming
-   double-entry banking platform overengineering
-   production authentication

The MVP is a local hackathon prototype, but persistence correctness must
be real enough to support restart, exact plan history, stale-state
detection, and deterministic tests.

------------------------------------------------------------------------

## 5. Money and time

Follow `FINANCIAL_RULES.md` exactly.

Money must never use binary floating point.

Persist exact money using an appropriate exact representation such as
`Numeric(..., 2)` / Decimal-compatible values.

The API representation is fixed two-decimal THB strings, but storage
design belongs to this workstream.

Reject or constrain invalid precision where appropriate.

Persist instants in UTC.

Planning periods use Asia/Bangkok semantics with explicit period
boundaries.

Due dates are local dates where specified.

Do not derive canonical fixture dates from wall-clock time.

------------------------------------------------------------------------

## 6. Required persisted concepts

Design a normalized but pragmatic model that can support the PM-1.1
contracts.

At minimum cover the semantics for:

### User and accounts

-   synthetic user
-   accounts/buckets
-   account purpose/designation
-   opening/reconciled balance evidence
-   currency
-   synthetic display/mask

### Transactions

-   stable ID
-   account
-   signed exact amount
-   timestamp
-   description
-   counterparty/source key
-   transfer pair link
-   refund link
-   income reversal link
-   recurring occurrence link
-   emergency event link where applicable

### Classification

-   top-level category
-   inflow kind
-   provenance
-   explicit user resolution
-   emergency confirmation
-   tax treatment where known
-   correction/audit history sufficient for reproducibility

### Remembered classification rules

-   source/series/direction scope
-   enabled/consent state
-   deterministic matching evidence
-   never a generic text-only rule that silently creates income

### Recurring commitments and occurrences

-   type
-   amount
-   billing/due anchor
-   effective revision/history
-   occurrence identity
-   due amount/date
-   paid/waived/unpaid state
-   transaction match
-   uniqueness needed to prevent double reservation

### Subscriptions

-   provider/service record
-   amount
-   billing interval/anchor
-   effective label history
-   active/end facts
-   source links
-   occurrence history

Important: Only subscriptions explicitly labelled `Essential` contribute
to Protected Monthly Outflow. `Keep` and `Consider Cancelling` do not.

### Financial preferences

-   Flow Sync enabled
-   global mode `normal|serious`
-   selected emergency target nullable
-   cash buffer
-   versioned policy/config reference

### Emergency Fund

-   exclusive account/bucket designation
-   funding/use evidence
-   no duplicate Goal record

### General Savings

-   exclusive savings designation
-   no mandatory target/date/description
-   not duplicated as a Goal

### Goals

-   name
-   optional description
-   target amount
-   optional target date
-   importance
-   mode override nullable
-   lifecycle state
-   exclusive funding assignments

### Plans / proposals

-   plan family/period
-   monotonic version
-   immutable content/snapshot reference
-   exact allocations
-   reasons/consequences/assumptions as required by contract
-   policy version
-   creation time

### Confirmations

-   exact plan/version
-   confirmation time
-   replaced confirmation
-   one active confirmation per user/period
-   idempotency key
-   request fingerprint/result needed for safe replay

### Progress

-   observed posted contribution
-   unique source transaction/pair
-   destination
-   period
-   recurring/irregular funding attribution

Confirmation must never synthesize progress or move money.

### Snapshot/reproducibility evidence

Retain enough immutable/effective-dated source evidence to reconstruct:

-   current period Financial State
-   prior complete history periods
-   protected-outflow components
-   subscription labels as they were at the relevant time
-   classifications as used by a plan
-   goal/preferences/policy values
-   current and prior commitment references

------------------------------------------------------------------------

## 7. PM-1.1 Emergency Fund data requirement

The protected monthly outflow is:

``` text
Essential Expenses
+ Required Financial Obligations
+ Essential Subscriptions
```

Canonical complete history month:

``` text
12,000 Essential
+ 1,500 Required Financial Obligation
+ 0 Essential Subscription
= 13,500 THB
```

Three-month average:

``` text
13,500 THB
```

Recommended minimum:

``` text
13,500 × 3 = 40,500 THB
```

The two canonical subscriptions total 600 THB and remain `Keep`, so they
do not enter this denominator.

Do not store the 24,000 THB medical shock as recurring protected monthly
outflow.

Preserve effective label/category evidence so a future edit cannot
rewrite historical calculations.

------------------------------------------------------------------------

## 8. Canonical deterministic seed

Implement the canonical synthetic seed from `docs/DEMO_SCENARIO.md`.

It must include the complete June--September evidence necessary for
PM-1.1.

Canonical current period:

``` text
September 2026
Net recurring salary: 30,000 THB
Normal period cost: 15,000 THB
Buffer: 2,000 THB
Global mode: Normal
Flow Sync enabled
```

Normal cost components:

``` text
Essential                    12,000
Financial Obligation          1,500
Subscriptions                   600
Flexible                        900
Total                         15,000
```

History:

``` text
June disposable capacity      12,000
July                          16,000
August                        14,000
Mean                          14,000
```

September baseline actual balances and goal funding must match
`DEMO_SCENARIO.md`.

Use stable IDs and deterministic timestamps from the canonical document.

Seed must be idempotent.

Ordinary API startup must not destructively reset user edits.

Re-seeding may be an explicit local developer operation, not a public
destructive endpoint.

------------------------------------------------------------------------

## 9. Scenario branches

Provide deterministic local/test support for:

### Scenario A --- normal

Base canonical state.

Expected downstream contract includes:

``` text
allocatable 15,000
protected monthly outflow 13,500
recommended emergency minimum 40,500
```

Data does not implement the allocation engine, but must provide exactly
the inputs needed to reproduce it.

### Scenario B --- financial shock

Branch from A after version-1 confirmation and before planned savings
are realized.

Record the 24,000 THB synthetic medical event exactly as the canonical
demo specifies.

Ensure:

-   emergency account decreases by 18,000
-   daily decreases by 6,000
-   total assets reconcile
-   event is not double-counted
-   one-off event does not alter recurring protected-outflow history

### Scenario C --- irregular income

Independent branch from A.

Add +10,000 THB inflow initially unresolved/unknown.

The stored evidence must support quarantine until classification and
then explicit resolution as irregular net-after-tax income.

Do not make it recurring salary history.

------------------------------------------------------------------------

## 10. Repository contract

Implement the repository seam described by `INTEGRATION_PLAN.md`.

Support the semantics of:

``` text
read_snapshot(user_id, period, as_of)
read_accounts(...)
read_transactions(...)
read_goals(...)
read_subscriptions(...)

update_preferences(...)
classify_transaction(...)
save_goal(...)
save_subscription(...)
update_recurring_commitment(...)

save_proposal(...)
read_plan(plan_id, version)
read_current_commitment(user_id, period)
read_plan_history(user_id, optional_period)

confirm_plan(...)
```

Internal names may follow project style, but meaning must not change.

Repository/domain records must not expose live ORM session objects to
domain logic.

`read_snapshot` must represent a consistent read.

------------------------------------------------------------------------

## 11. Revision and concurrency

Implement a pragmatic optimistic revision/concurrency mechanism.

Requirements:

-   financially relevant source mutation changes revision
-   proposal persists the source revision/snapshot it was based on
-   confirmation validates against current revision/cash state in the
    same transaction/unit-of-work
-   stale proposal confirmation fails without modifying previous
    commitment
-   competing confirmations cannot silently win
-   duplicate identical idempotent confirmation returns the original
    result
-   same idempotency key with a different request body/fingerprint is
    rejected
-   storage failure rolls back all changes
-   one active commitment per user/period
-   superseded confirmations remain queryable

SQLite behavior must be tested.

Do not claim production-grade distributed concurrency; satisfy the local
MVP contract deterministically.

------------------------------------------------------------------------

## 12. Integrity constraints

Enforce as much as practical in database/repository constraints:

-   valid references
-   exact currency/money precision
-   unique stable transaction IDs
-   unique occurrence identities
-   no duplicate transaction-to-occurrence payment match
-   no duplicate contribution assignment for one source movement
-   no Emergency Fund duplicated as a Goal
-   exclusive funding assignment semantics
-   one active confirmation per user/period
-   immutable proposal content after save
-   deterministic version progression
-   rollback safety

Where a rule belongs in domain validation rather than SQL, document that
boundary instead of duplicating inconsistent logic.

------------------------------------------------------------------------

## 13. Required tests

Add focused automated tests for Data-owned behavior.

At minimum test:

-   migrations on a clean SQLite DB
-   deterministic/idempotent seed
-   exact Decimal round-trip
-   June--September canonical balances
-   account conservation
-   transaction signs and totals
-   paid/unpaid occurrence matching
-   no duplicate occurrence reservation
-   transfer pair/contribution uniqueness
-   refund/reference integrity
-   effective subscription labels
-   13,500 protected-outflow source evidence
-   40,500 recommendation inputs
-   shock event conservation
-   irregular-income unresolved/resolved evidence
-   snapshot reload equality
-   restart persistence
-   immutable proposal reload
-   plan version history
-   duplicate confirmation replay
-   idempotency key/body mismatch
-   stale/concurrent confirmation conflict
-   transaction rollback on failure
-   invalid references rejected

Do not implement allocation-engine assertions inside Data tests except
where shared canonical expected input/output fixtures are intentionally
consumed for integration compatibility.

------------------------------------------------------------------------

## 14. Documentation

Create/update:

-   `docs/DATA_MODEL.md`
-   ER diagram in Mermaid or another repository-friendly text format
-   migration/seed instructions where appropriate
-   `docs/IMPLEMENTATION_STATUS.md` with factual Data-workstream
    progress

Document:

-   entities and relationships
-   exact money representation
-   revision mechanism
-   immutable snapshot/plan strategy
-   occurrence matching
-   effective-dated classification/subscription-label behavior
-   seed strategy
-   repository boundary
-   SQLite/PostgreSQL compatibility notes
-   known limitations

Do not rewrite PM product policy.

------------------------------------------------------------------------

## 15. Safety and scope

Use synthetic data only.

Do not add:

-   real bank credentials
-   API keys/tokens
-   real customer data
-   real banking integrations
-   real transfers
-   provider cancellation integrations
-   production auth
-   fraud/credit/investment features

Preserve fictional branding/prototype notices.

Inspect new dependencies before adding them.

------------------------------------------------------------------------

## 16. Integration gate

Do not replace the running Phase 1 application path prematurely.

Your work should be independently testable.

At the integration gate:

1.  consume the Frontend+Backend-owned typed snapshot/protocol contract;
2.  adapt persistence records into those domain records;
3.  inject the Data repository adapter;
4.  remove fixture-global persistence dependencies only when the
    replacement path is coherent;
5.  verify exact reload and lifecycle behavior;
6.  do not change PM-1.1 semantics to make integration easier.

If the other workstream has not published the shared typed contract yet,
stop before final adapter wiring and report the dependency clearly.

------------------------------------------------------------------------

## 17. Before finishing

Run the relevant Data tests and repository quality checks.

Also:

-   inspect `git diff`
-   run `git diff --check`
-   inspect dependency changes
-   scan for accidental secrets
-   verify no real-bank branding was introduced
-   verify no unrelated user work was overwritten

Do not commit or push.

------------------------------------------------------------------------

## 18. Final report

Return:

### Repository Assessment

What Data-related Phase 1 code existed.

### Data Model

Entities, relationships, precision, effective history.

### Migrations

What was added and migration status.

### Canonical Seed

Exact PM-1.1 seed/scenario support.

### Repository

Implemented operations and revision/concurrency behavior.

### Integrity

Database/repository guarantees.

### Tests

Commands and exact results.

### Documentation

Files created/updated.

### Integration Status

State one of:

-   `READY FOR FRONTEND+BACKEND ADAPTER INTEGRATION`
-   `WAITING FOR SHARED CONTRACT`
-   `BLOCKED`

List only genuine blockers.

### Git Status

Confirm no commit/push.

Stop after the Data workstream implementation/handoff.
