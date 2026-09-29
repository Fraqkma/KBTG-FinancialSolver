# Current Task --- PM Specification Freeze

## Project

**Adaptive Financial Sorter (Flow Sync)**

## Current Phase

**PM Product Specification + Integration Planning**

Phase 1 implementation is already complete.

The current objective is **not** to implement Phase 2 yet.

The current objective is to execute the PM planning pass, freeze the
product specification, define shared contracts, and prepare clean
handoffs for the Data and Frontend+Backend workstreams.

------------------------------------------------------------------------

# Source of Truth

Read these files completely before doing any work:

1.  `AGENTS.md`
2.  `taskPM_MASTER.md`
3.  All existing files under `docs/`
4.  Relevant existing frontend/backend source code
5.  Existing tests and configuration

`taskPM_MASTER.md` is the authoritative task specification for this
phase.

This `task.md` is only the current execution entry point.

If older documentation, Phase 1 assumptions, mock behavior, or existing
code conflicts with an explicit product decision in `taskPM_MASTER.md`,
treat `taskPM_MASTER.md` as the newer product decision.

Do not silently discard useful Phase 1 implementation.

Inspect first, compare, and document the gap.

------------------------------------------------------------------------

# Important Phase 1 Context

Phase 1 already established a working prototype containing:

-   React + TypeScript + Vite frontend
-   FastAPI backend
-   modular-monolith structure
-   Overview
-   Accounts
-   Activity / Transactions
-   Goals
-   Money Overview
-   Flow Sync
-   Flow Sync Plan
-   Settings
-   mock financial data
-   mock allocation logic
-   frontend/backend tests
-   Playwright E2E
-   project documentation

The existing allocation behavior is prototype logic only.

Do not assume that the current reserve percentage, laptop-goal behavior,
mock repository, or other Phase 1 shortcuts represent the final Flow
Sync policy.

Use the actual repository as the reference for what Phase 1 implemented.

------------------------------------------------------------------------

# Execution Instructions

Execute `taskPM_MASTER.md` end-to-end.

The expected work is primarily:

``` text
Inspect Phase 1
      ↓
Formalize Product Specification
      ↓
Formalize Financial Rules
      ↓
Define User Journeys
      ↓
Define Transaction Classification
      ↓
Define Subscription Manager Scope
      ↓
Define Financial Performance
      ↓
Define Canonical Demo Scenarios
      ↓
Define API Contract
      ↓
Define Data Requirements
      ↓
Define Frontend/Backend Requirements
      ↓
Phase 1 Gap Analysis
      ↓
Integration Plan
      ↓
Specification Freeze Check
```

Do not jump directly into implementing all Phase 2 features.

------------------------------------------------------------------------

# Required Outputs

At minimum, create or update the documents required by
`taskPM_MASTER.md`, including:

``` text
docs/PRODUCT_SPEC.md
docs/USER_JOURNEY.md
docs/FINANCIAL_RULES.md
docs/TRANSACTION_CLASSIFICATION.md
docs/SUBSCRIPTION_MANAGER.md
docs/FINANCIAL_PERFORMANCE.md
docs/DEMO_SCENARIO.md
docs/API_CONTRACT.md
docs/INTEGRATION_PLAN.md
```

Also review existing documentation for consistency, including where
present:

``` text
docs/ARCHITECTURE.md
docs/FLOW_SYNC.md
docs/SECURITY.md
docs/IMPLEMENTATION_STATUS.md
```

Do not create duplicate documents that describe the same concept
differently.

Update existing documents where appropriate.

------------------------------------------------------------------------

# Product Decisions

Do not reopen already-decided product direction without a concrete
contradiction.

The current product direction includes:

-   Flow Sync is an optional financial decision layer.
-   It should help across multiple financial subsystems rather than act
    only as a salary splitter.
-   MVP includes Emergency Fund, General Savings/Goals, cash-flow
    analysis, and Subscription Manager.
-   Transaction history is an important source of financial state.
-   Classification begins from a simple template and can later be
    customized.
-   The system should minimize questions and remember useful user
    choices.
-   Emergency Fund has a recommended minimum while still allowing user
    override.
-   Goals may be named goals, but users may also save without a specific
    item/purpose.
-   Goal priority should primarily be derived from financial context,
    with optional user override.
-   Constraint behavior supports Normal and Serious modes.
-   Serious mode shows consequences but never punishes or prevents the
    user from controlling their money.
-   Confirm creates a tracked commitment; it does not move or lock real
    money.
-   Flow Sync normally plans monthly, can support configurable periods
    later, and can be manually recalculated.
-   Meaningful financial events may trigger or suggest recalculation.
-   Financial Performance should use explainable metrics and
    previous-period trends rather than an arbitrary score.
-   Subscription Manager should support recurring-cost awareness in MVP
    and preserve a future path toward deeper subscription management.
-   The main demo must show both a normal month and a financial-shock
    scenario.
-   Extra/irregular income is a useful stretch scenario.
-   Recommendations must be explainable and user-adjustable where
    appropriate.

The detailed definitions and constraints are in `taskPM_MASTER.md`.

------------------------------------------------------------------------

# Collaboration Boundary

Three workstreams exist:

``` text
PM / Product / Integration
          │
          ├───────────────┐
          ↓               ↓
Data / Database    Frontend + Backend
```

This task is the **PM workstream**.

Do not consume all implementation work that belongs to the other two
workstreams.

Your job is to make their work unambiguous.

After this task:

### Data should be able to begin

-   schema design
-   persistence
-   migrations
-   repositories
-   deterministic seed data
-   data consistency work

### Frontend + Backend should be able to begin

-   approved UI changes
-   backend services
-   Flow Sync engine implementation
-   validation
-   API implementation
-   plan adjustment/confirmation UX
-   automated testing

Both workstreams must receive clear contracts from the PM outputs.

------------------------------------------------------------------------

# Implementation Limit

Small code/config changes are allowed only when they are necessary to:

-   establish or validate a shared interface
-   remove a contradiction
-   verify an existing assumption
-   keep existing documentation/code coherent with the specification

Do not use this task to implement the entire next phase.

When uncertain whether something belongs to PM planning or
implementation, prefer documenting the requirement and handing it to the
appropriate workstream.

------------------------------------------------------------------------

# Decision Handling

When a small implementation-level choice is required and does not change
product behavior:

1.  choose the simplest reasonable option,
2.  document the assumption,
3.  keep it configurable when appropriate.

When a decision would materially change:

-   product behavior,
-   financial semantics,
-   user control,
-   scope,
-   data ownership,
-   or the demo story,

do not invent a new direction silently.

Record it as a genuine open question/blocker in the final report.

Do not create unnecessary blockers for minor engineering details.

------------------------------------------------------------------------

# Quality Requirements

The resulting specification must be internally consistent.

Check that:

-   terminology is consistent across documents
-   the same financial concept has the same meaning everywhere
-   demo numbers reconcile
-   API schemas match the product flow
-   Data requirements match the Financial State
-   Frontend/Backend requirements match the API contract
-   constraint semantics are consistent
-   confirmation/commitment semantics are consistent
-   subscription commitments are included correctly
-   transaction classification does not accidentally treat transfers as
    income
-   tax is not deducted twice
-   Phase 1 mock behavior is not documented as final policy unless
    intentionally retained

------------------------------------------------------------------------

# Repository Safety

Before editing:

-   inspect `git status`
-   preserve existing user work
-   do not overwrite unrelated changes
-   do not delete useful Phase 1 code simply because it will later
    change

During work:

-   use synthetic financial data only
-   do not add secrets
-   do not add real banking credentials
-   do not add real customer data
-   do not add prohibited real-bank branding
-   keep the prototype locally runnable

Before finishing:

-   inspect the complete diff
-   check for accidental secrets
-   run relevant tests if any code/configuration changed

------------------------------------------------------------------------

# Git

Do **not** commit.

Do **not** push.

Leave all changes available for PM review.

------------------------------------------------------------------------

# Completion Gate

Do not declare the PM pass complete until the specification-freeze
requirements in `taskPM_MASTER.md` are satisfied.

The most important test is:

> Can the Data engineer and Frontend+Backend engineer begin their work
> from the resulting documentation without having to invent Flow Sync
> product behavior themselves?

If not, improve the specification before stopping.

------------------------------------------------------------------------

# Final Response

When complete, return the final report requested by `taskPM_MASTER.md`.

The report must include:

1.  Repository Assessment
2.  Product Specification
3.  Decisions Frozen
4.  Phase 1 Gap Analysis
5.  Data Handoff
6.  Frontend/Backend Handoff
7.  API Contract
8.  Demo Scenarios
9.  Risks / Open Questions
10. Verification
11. Parallel Start Decision

Explicitly state whether:

**Data and Frontend+Backend are ready to start in parallel: YES / NOT
YET**

If `NOT YET`, list only the blockers that genuinely prevent parallel
implementation.

Stop after the PM specification/integration pass.
