# PM MASTER TASK --- Adaptive Financial Sorter (Flow Sync)

## Role and objective

Act as the **Project Manager + Product / Integration Engineer** for this
repository.

This is the PM-side source-of-truth pass after Phase 1. Inspect the
existing prototype, formalize the product decisions in this file, align
Product/Data/Frontend/Backend contracts, and prepare a specification
freeze so the Data and Frontend+Backend workstreams can begin in
parallel without inventing product behavior independently.

Do not redesign the product from scratch. Do not commit or push unless
explicitly instructed.

## Product definition

**Adaptive Financial Sorter / Flow Sync** is an optional financial
**decision layer**, not merely a salary splitter or fixed-percentage
budget.

It uses financial data and user preferences to understand the current
financial situation and recommend what to do with available money.

Core loop:

``` text
Financial Data
→ Financial State
→ Decision Layer
→ Constraints + Priorities
→ Recommendation
→ Explanation
→ Optional User Override
→ Commitment
→ Progress Tracking
→ Future Recalculation
```

The user always remains in control. The MVP must not perform real
transfers, lock money, cancel real services, access real banking
systems, or silently change a confirmed commitment.

Flow Sync should minimize questions. Prefer defaults, remembered
choices, transaction history, and suggested classifications. Ask only
when uncertainty materially affects the plan or when explicit
confirmation is required.

------------------------------------------------------------------------

# 1. Inspect Phase 1 first

Before changing anything:

1.  Read `AGENTS.md` and the original `task.md`.
2.  Inspect the complete repository and Git status.
3.  Read all existing docs.
4.  Inspect frontend routes and Flow Sync UX.
5.  Inspect backend routes, schemas, services, and mock repository.
6.  Inspect current allocation logic and Financial State calculation.
7.  Inspect tests and demo data.
8.  Preserve useful Phase 1 work.

Phase 1 currently includes React/TypeScript/Vite, FastAPI, a
modular-monolith structure, banking overview, accounts,
transactions/activity, goals, money overview, Flow Sync, plan review,
settings, mock financial data, mock allocation logic, tests, and E2E
coverage.

The current reserve-first/laptop allocation is prototype behavior, not
final policy.

------------------------------------------------------------------------

# 2. MVP scope

The MVP has four connected pillars:

1.  **Emergency Fund**
2.  **General Savings and Goals**
3.  **Cash-flow / Transaction Analysis**
4.  **Subscription Manager**

These are not independent mini-apps. They feed the Flow Sync decision
layer.

Explicitly defer unless later approved:

-   real banking connectivity
-   real transfers
-   real subscription cancellation
-   provider usage scraping
-   investment advice
-   credit scoring
-   fraud detection
-   full tax engine
-   ML forecasting
-   AI chatbot
-   microservices
-   data warehouse
-   production-scale authentication/infrastructure

------------------------------------------------------------------------

# 3. Emergency Fund

Flow Sync should understand:

-   current emergency balance
-   recommended minimum
-   user-selected target
-   emergency coverage
-   emergency usage
-   recovery after emergency usage

Initial policy:

``` text
Recommended Emergency Minimum
≈ 3 × average monthly essential expenses
```

Treat the multiplier as configurable policy, not a scattered magic
number.

The user may accept the recommendation or choose a higher/lower target.
A target below the recommendation should show a warning/consequence, not
block the user.

Support both:

-   user explicitly marks an event/expense as emergency
-   Flow Sync detects a large/unusual expense and asks whether it is an
    emergency

Do not permanently classify ambiguous activity as emergency without
appropriate confirmation.

------------------------------------------------------------------------

# 4. General Savings and Goals

Flow Sync must work even when the user does not have a named purchase
goal.

Support:

### General Savings

Savings without a required item, target date, or description.

### Financial Goal

Optional structured goal with fields such as:

-   name
-   description
-   target amount
-   current amount
-   target date
-   progress
-   user importance/preference
-   constraint mode

Examples may include laptop, travel, education, moving, or any custom
purpose.

Goal priority should primarily be calculated from context rather than
forcing the user to rank every goal manually.

Evaluate factors such as:

-   target date
-   remaining amount
-   historical disposable capacity
-   current obligations
-   emergency-fund condition
-   available money
-   existing commitment
-   user preference

Allow the user to override importance when desired.

Avoid opaque arbitrary scoring. If numeric weights are introduced,
document them and keep policy configurable.

------------------------------------------------------------------------

# 5. Transaction classification

Use this first-level MVP template:

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

Allow optional subcategories, for example:

``` text
Essential
├── Rent
├── Food
├── Transportation
└── Utilities

Flexible
├── Dining
├── Shopping
└── Entertainment
```

This is a starter template, not a closed taxonomy. Users should later be
able to customize/add detail.

Desired behavior:

``` text
Transaction
→ remembered classification?
   → yes: reuse, still editable
   → no: suggest classification
       → confident: show suggestion
       → uncertain and financially meaningful: ask user
```

Remember explicit user classifications where appropriate. Do not
repeatedly ask the same question.

------------------------------------------------------------------------

# 6. Income classification

Conceptually distinguish:

-   recurring income
-   irregular/extra income
-   transfer
-   refund
-   unknown inflow

Do not count every incoming transaction as income.

Recurring salary-like patterns may be inferred from history. For
ambiguous irregular inflow, use a lightweight confirmation such as:

``` text
Income / Transfer / Refund / Other
```

If extra money is confirmed as income, evaluate it against the existing
Financial State rather than applying a fixed split.

------------------------------------------------------------------------

# 7. Subscription Manager

Subscription Manager is part of the long-term Flow Sync vision.

MVP should:

-   identify/record recurring subscriptions
-   show subscriptions in one place
-   show amount and billing period
-   show expected next billing date when known
-   calculate recurring monthly commitment
-   include upcoming charges in available-money calculations
-   allow labels such as `Essential`, `Keep`, `Consider Cancelling`
-   show useful spending trend

Long-term vision may include:

-   managing subscriptions directly
-   cancelling/modifying subscriptions
-   understanding actual usage
-   comparing usage against cost
-   recommending whether a subscription remains worthwhile

Do not fake these integrations in MVP. Represent them as future
extension points only.

------------------------------------------------------------------------

# 8. Financial State

Formalize a deterministic Financial State model. At minimum evaluate:

``` text
period
net_income
recurring_income
irregular_income
essential_expenses
financial_obligations
flexible_spending
subscription_commitments
upcoming_commitments
available_cash
allocatable_amount
emergency_fund_balance
emergency_fund_target
emergency_coverage
general_savings
active_goals
goal_progress
existing_commitments
historical_disposable_capacity
previous_period_metrics
```

Every important field must have clear semantics and source.

Do not add metrics unless they support recommendation, explanation,
validation, or user understanding.

------------------------------------------------------------------------

# 9. Tax treatment

Main MVP demo uses **net income after tax**.

Do not subtract tax again when salary transactions already represent net
income.

Architecture may distinguish:

``` text
gross_or_taxable_income
net_income
tax_reserved
```

when known, especially for future irregular/freelance income.

Do not build a full tax engine in MVP.

------------------------------------------------------------------------

# 10. Decision priority

Conceptual order:

``` text
Income
→ Tax obligation only when applicable and not already withheld
→ Required financial obligations
→ Essential expenses
→ Emergency Fund
→ General Savings / Goals
→ Flexible / Remaining Money
```

This must not become one rigid fixed-percentage formula.

Recommendations should adapt to the current Financial State.

------------------------------------------------------------------------

# 11. Historical capacity

Formalize **Historical Disposable Capacity** so affordability is not
judged from one month only.

Example:

``` text
Month -3: 12,000
Month -2: 16,000
Month -1: 14,000
Current:  15,000
```

Use recent history to estimate sustainable saving/goal commitments.

Choose and document a reasonable MVP history window. Keep it
configurable rather than scattering the number through business logic.

------------------------------------------------------------------------

# 12. Constraint model

Support two main modes:

### Normal

Default. Flow Sync can adapt the plan more freely when conditions
change.

### Serious

Flow Sync tries harder to protect the commitment and makes consequences
of reducing it more visible.

Neither mode may prevent the user from using their own money.

No punishment, lock, or financial penalty.

Show consequences instead, e.g.:

``` text
Recommended contribution: 5,000 THB
User changes to:          2,000 THB
Estimated completion: October → December
```

Do not make onboarding ask for many constraint settings.

Use sensible defaults and allow:

-   general Flow Sync mode
-   optional per-goal override
-   optional emergency behavior configuration
-   advanced customization only when the user chooses it

------------------------------------------------------------------------

# 13. Commitment semantics

`Confirm` means:

> The user accepts the current plan as a financial commitment and allows
> Flow Sync to use it for progress tracking and future recommendations.

It does **not** mean a legal agreement, real transfer, automatic
withdrawal, or money lock.

Persist enough information to reproduce the commitment, including:

-   plan/version
-   allocations
-   relevant goals
-   constraint modes
-   assumptions
-   confirmation time
-   progress state

If circumstances materially change, Flow Sync may propose a revised
plan, but must not silently replace the confirmed commitment. Material
revisions require review/confirmation.

------------------------------------------------------------------------

# 14. Recalculation policy

Default planning period is **monthly**.

Design so another planning period can be configured later where
practical.

Support manual recalculation.

Potential triggers:

-   new monthly period
-   salary/major recurring income received
-   meaningful irregular income
-   large/unusual expense
-   emergency usage
-   goal created/changed
-   recurring obligation changed
-   subscription changed
-   manual recalculation

Do not create noisy recalculation after every insignificant transaction.

Document which events only refresh metrics, which suggest recalculation,
and which require user review.

------------------------------------------------------------------------

# 15. Financial Performance

Do not create an arbitrary 0--100 score in MVP.

Use factual metrics such as:

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

Show previous-period trend where meaningful.

Examples:

``` text
Savings: +8% vs previous month
Subscription spending: +419 THB vs previous month
Available money for goals: +12% vs previous month
```

------------------------------------------------------------------------

# 16. Canonical demo

Create one deterministic fictional user and reconcile all numbers across
UI, API, seed data, tests, and docs.

Baseline:

``` text
Monthly net salary: 30,000 THB
Average required/normal monthly expenses: 15,000 THB
Baseline remaining amount: 15,000 THB
```

Define the exact expense/subscription/goal breakdown once.

## Scenario A --- Normal month

No unusual expense.

Flow Sync evaluates:

``` text
Transactions
+ Financial State
+ Emergency Fund
+ General Savings
+ Goals
+ Subscriptions
+ Historical Capacity
+ Existing Commitments
```

Then recommends how the 15,000 THB should be handled.

Do not use one fixed percentage split.

## Scenario B --- Financial shock

Same baseline, but a meaningful emergency occurs, such as an urgent
family medical expense.

Demonstrate:

``` text
Normal State
→ Emergency / unusual expense
→ Emergency Fund evaluation
→ Recalculate capacity
→ Protect required obligations
→ Reduce/defer lower-priority goals where appropriate
→ Explain consequences
→ User reviews revised plan
```

This scenario must clearly demonstrate why Flow Sync differs from fixed
budgeting.

## Scenario C --- Extra income (stretch)

Example:

``` text
Salary:            30,000 THB
Extra freelance:  +10,000 THB
```

After the inflow is confirmed as income, evaluate it against the current
Financial State. Potential destinations include emergency fund, general
savings, urgent goals, other goals, or available money.

Do not automatically send all extra income to a goal.

------------------------------------------------------------------------

# 17. Recommendation explanations

Every meaningful recommendation should answer:

-   Why this amount?
-   Why this destination?
-   What changed?
-   What happens if the user changes it?
-   What is protected?
-   What is flexible?

Prefer structured reason data from domain/backend logic.

Example:

``` json
{
  "category": "emergency_fund",
  "amount": 5000,
  "reason_code": "EMERGENCY_BELOW_RECOMMENDED_TARGET",
  "reason": "Your emergency savings are below the recommended minimum.",
  "editable": true
}
```

Do not use external AI just to generate explanations.

------------------------------------------------------------------------

# 18. UX principle

Flow Sync should feel like assistance, not administration.

Avoid:

-   asking users to classify everything
-   excessive onboarding questions
-   repeated confirmations
-   guilt/punishment language
-   hidden automatic changes
-   unnecessary technical terminology

Prefer:

``` text
Observe
→ Suggest
→ Explain
→ Allow Override
→ Remember Preference
```

------------------------------------------------------------------------

# 19. Architecture boundary

Preserve modular-monolith architecture.

Conceptually separate:

``` text
Data / Repository
→ Financial State Builder
→ Decision / Allocation Engine
→ Plan Validator
→ Recommendation / Explanation
→ API
→ Frontend
```

Subscription Manager, Goals, Emergency Fund, and transaction
classification feed the Flow Sync decision layer.

Do not introduce microservices, queues, Redis, Kubernetes, ML
infrastructure, or similar complexity without demonstrated need.

------------------------------------------------------------------------

# 20. Ownership

### PM owns

-   product behavior
-   user journey
-   financial-rule definitions
-   constraint semantics
-   demo scenario
-   API expectations
-   cross-team integration decisions

### Data workstream owns

-   persistent schema
-   relationships
-   migrations
-   repositories
-   data consistency
-   deterministic seed data

### Frontend + Backend workstream owns

-   user-facing implementation
-   backend services
-   approved allocation logic implementation
-   API implementation
-   validation
-   frontend integration
-   automated tests

Do not silently change product behavior to resolve an implementation
disagreement. Document/escalate genuine contradictions.

------------------------------------------------------------------------

# 21. Required PM documents

Create/update:

### `docs/PRODUCT_SPEC.md`

Product definition, problem, MVP, non-goals, decision-layer concept,
user control, future extension points.

### `docs/USER_JOURNEY.md`

Enabling Flow Sync, normal month, classification, subscriptions, general
savings, goals, emergency, extra income, plan review, override,
commitment, recalculation.

### `docs/FINANCIAL_RULES.md`

Terminology, Financial State, allocation priority, emergency policy,
savings/goals, historical capacity, constraints, irregular income, tax
assumptions, recalculation, invariants, configurable policies.

### `docs/TRANSACTION_CLASSIFICATION.md`

Template, subcategories, custom categories, suggestions, remembered
choices, unknowns, income/transfer/refund, subscriptions.

### `docs/SUBSCRIPTION_MANAGER.md`

MVP behavior, recurring charges, upcoming commitments, Flow Sync
relationship, future usage insight and management integrations,
limitations.

### `docs/FINANCIAL_PERFORMANCE.md`

Metrics, calculation semantics, previous-period trends, limitations.

### `docs/DEMO_SCENARIO.md`

Exact deterministic baseline and Scenarios A/B/C. All numbers must
reconcile.

### `docs/API_CONTRACT.md`

Only APIs required by the product. Define purpose, request/response
schemas, validation, errors, and ownership.

### `docs/INTEGRATION_PLAN.md`

Frozen PM decisions, dependencies for Data and Frontend+Backend,
interfaces, merge order, blockers, acceptance gates.

------------------------------------------------------------------------

# 22. API review

Review existing concepts before adding/changing endpoints:

``` text
GET /health
GET /api/accounts
GET /api/transactions
GET /api/goals
GET /api/financial-state
GET /api/flow-sync/plan
POST /api/flow-sync/preview
POST /api/flow-sync/confirm
```

Evaluate only what is actually needed for:

-   subscriptions
-   transaction classification
-   general savings/goals
-   constraints
-   plan history
-   recalculation

Do not create an oversized REST API simply because entities exist.

------------------------------------------------------------------------

# 23. Data handoff

Produce a concrete handoff describing product data requirements for:

-   accounts
-   transactions
-   classifications
-   recurring transactions
-   subscriptions
-   financial preferences
-   emergency fund
-   general savings
-   goals
-   constraints
-   allocation plans/items
-   versions/confirmations
-   historical metrics

Clearly state which values should be persisted, derived, or only cached
if justified.

Do not unnecessarily dictate database implementation details that belong
to the Data engineer.

------------------------------------------------------------------------

# 24. Frontend/Backend handoff

Produce a concrete handoff describing:

-   required screens/states
-   backend services
-   calculation ownership
-   validation
-   explanations
-   adjustment behavior
-   confirmation
-   recalculation
-   errors/empty states
-   required E2E scenarios

Preserve useful Phase 1 UI instead of redesigning for its own sake.

------------------------------------------------------------------------

# 25. Core invariants

At minimum formalize:

-   allocations cannot be negative
-   confirmed allocation cannot exceed actually available plan money
-   required obligations are represented before discretionary allocation
-   tax is not reserved twice
-   transfers are not counted as new income
-   confirmed plan/version is reproducible
-   meaningful recommendation changes have an explainable reason
-   revised recommendations do not silently overwrite confirmed
    commitments
-   uncertain classification is not treated as certain when it
    materially affects the plan

------------------------------------------------------------------------

# 26. Configurable policy

Avoid scattered magic numbers.

Potential configurable policies include:

-   emergency-fund multiplier
-   historical analysis window
-   unusual-transaction threshold
-   recalculation thresholds
-   goal-priority weights
-   minimum meaningful change for notification

Do not build a full policy-management platform. Central documented
configuration is enough for MVP.

------------------------------------------------------------------------

# 27. Security and competition constraints

-   synthetic data only
-   no secrets/API keys/tokens in source
-   maintain `.env.example` and `.gitignore`
-   no real financial data
-   no real banking integrations
-   no real money movement
-   no prohibited real-bank branding in public-facing prototype material
-   clearly identify the app as prototype/demo
-   preserve local/offline demo capability

------------------------------------------------------------------------

# 28. Phase 1 gap analysis

After formalizing the specification, classify relevant Phase 1
components:

``` text
KEEP
MODIFY
REPLACE
DEFER
```

Review at minimum:

-   mock allocation rule
-   Financial State
-   Goals
-   Flow Sync page
-   Plan page
-   confirmation behavior
-   mock repository
-   API schemas
-   transaction categories
-   tests
-   documentation

Do not implement every MODIFY/REPLACE item during this PM pass.

------------------------------------------------------------------------

# 29. Specification freeze gate

Before completion, another engineer must be able to answer from
documentation alone:

1.  What is Flow Sync?
2.  What is in/out of MVP?
3.  What data does it use?
4.  How are transactions/income classified?
5.  How are subscriptions treated?
6.  What is Financial State?
7.  What is the allocation priority?
8.  How is Emergency Fund handled?
9.  How do General Savings and Goals differ?
10. How is goal priority determined?
11. What are Normal and Serious modes?
12. What can users override?
13. What does Confirm mean?
14. When does recalculation occur?
15. How is extra income handled?
16. How is an emergency handled?
17. What appears in Financial Performance?
18. What must Data implement?
19. What must Frontend+Backend implement?
20. What interfaces connect the workstreams?

If an answer still requires guessing, improve the specification before
handoff.

------------------------------------------------------------------------

# 30. PM-task implementation limit

This task is primarily for specification, contracts, integration
boundaries, and gap analysis.

Small code/config changes are allowed only when necessary to:

-   establish shared interfaces
-   remove a contradiction
-   keep documentation and existing behavior coherent
-   support specification verification

Do not implement the entire Phase 2 yourself. Major Data and
Frontend/Backend implementation begins after specification freeze.

------------------------------------------------------------------------

# 31. Verification

Before finishing:

-   check consistency across all PM documents
-   reconcile every demo number
-   verify API contract against product requirements
-   verify terminology consistency
-   distinguish Phase 1 prototype behavior from final policy
-   run relevant tests if code/config changed
-   inspect Git diff/status
-   check for accidental secrets
-   do not commit or push

------------------------------------------------------------------------

# 32. Final report

Return:

## 1. Repository Assessment

What Phase 1 currently implements.

## 2. Product Specification

What is now formally defined.

## 3. Decisions Frozen

Major decisions that are now source of truth.

## 4. Phase 1 Gap Analysis

KEEP / MODIFY / REPLACE / DEFER.

## 5. Data Handoff

Exactly what the Data workstream can begin.

## 6. Frontend/Backend Handoff

Exactly what the Frontend+Backend workstream can begin.

## 7. API Contract

Important interfaces and genuine unresolved issues.

## 8. Demo Scenarios

Normal month, financial shock, optional extra income.

## 9. Risks / Open Questions

Only genuine unresolved issues. Do not reopen frozen decisions without a
concrete technical reason.

## 10. Verification

Docs, tests, security checks, Git status.

## 11. Parallel Start Decision

State whether Data and Frontend+Backend are now safe to begin in
parallel.

Stop after this PM specification/integration pass.

Do not commit or push.
