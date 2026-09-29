# Flow Sync product specification

Specification: **PM-1.1**, frozen for implementation on 2026-09-29. This describes the target MVP; it does not claim that Phase 1 implements it.

## Authority and document map

`taskPM_MASTER.md` supersedes the original Phase 1 task and prototype policy. `taskPM_1_1_AMENDMENT.md` supersedes PM-1 only for Emergency Fund coverage/target and Serious constraint semantics; this document set includes that amendment. `AGENTS.md` continues to govern safety, branding and engineering. This specification and its linked contracts resolve the details delegated to the PM pass. Later product changes require a documented PM decision and corresponding contract/example changes.

| Question | Authoritative document |
| --- | --- |
| Product scope and promises | This document |
| Screens, states and user actions | [User journey](USER_JOURNEY.md) |
| Amount semantics, policy and invariants | [Financial rules](FINANCIAL_RULES.md) |
| Categories and uncertain activity | [Transaction classification](TRANSACTION_CLASSIFICATION.md) |
| Recurring subscription behavior | [Subscription Manager](SUBSCRIPTION_MANAGER.md) |
| Metrics and comparisons | [Financial Performance](FINANCIAL_PERFORMANCE.md) |
| Canonical synthetic amounts | [Demo scenario](DEMO_SCENARIO.md) |
| Wire schemas and lifecycle operations | [API contract](API_CONTRACT.md) |
| Ownership, handoffs, gaps and freeze gates | [Integration plan](INTEGRATION_PLAN.md) |

Other docs link to these definitions rather than establish competing rules. `taskData.md` and `taskFrontendBackend.md` contain older examples and references to an absent `taskPM.md`; read those references as this PM-1.1 document set. Their salary, categories, preview inputs and status examples are superseded where the contracts differ.

## Capability and problem

For a young working adult using the fictional banking prototype, Flow Sync is an optional decision layer that turns financial activity, balances, commitments and preferences into an understandable monthly recommendation. It helps the user see what money is available, protect upcoming necessities, prepare for emergencies, save with or without a named goal, and understand the consequences of changes.

The product loop is data → Financial State → priorities and constraints → recommendation and reasons → optional override → explicit commitment → observed progress → future recalculation. The banking environment supplies context; the four pillars supply inputs to one decision layer.

## MVP capabilities

| Capability | User promise | Acceptance boundary |
| --- | --- | --- |
| Emergency Fund | Cover Essential Expenses + Required Financial Obligations + Essential-labelled subscriptions; view balance, coverage, selected/recommended target and recovery | Default recommendation is three months of average protected outflow; lower targets warn without blocking; separate from Goals |
| General Savings and Goals | Save without a named goal; optionally create/edit/pause goals with dates, progress and importance | Empty goal list works; priority follows the documented rules |
| Cash-flow analysis | Understand income, obligations, essentials, flexible activity and uncertainty | Transfers and refunds are not new income; actual cash constrains every plan |
| Subscription Manager | Review recurring services, cost, next known charge and preference labels | Upcoming charges remain reserved until genuinely ended/paid; labels alone do not cancel |
| Monthly planning | Review, adjust, validate, confirm and manually recalculate | Server computes amounts; no silent replacement of a confirmed version |
| Progress and performance | Distinguish intended contributions from observed saving and show factual trends | Confirmation does not increase balances or realized savings |

Flow Sync starts disabled for a fresh profile. Enabling it accepts defaults and prepares a reviewable proposal; the canonical demo can start enabled. Disabling stops plan prompts and generation, preserves history and permits ordinary banking views. Re-enabling checks current data. No compulsory onboarding questionnaire.

Core delivery includes Scenarios A and B. Scenario C is a stretch demo; the schema must already distinguish irregular income, transfer, refund and unknown inflow. Basic safe classification is core even if the extra-income demonstration is deferred.

## User control

Users may correct classifications, manage subscription records and labels, select an emergency target, create/edit/pause goals, change general or per-goal modes, adjust contribution amounts, retain money unallocated, or decline a proposal. Normal adapts more freely to current state. Serious gives a selected saving/goal contribution stronger recommendation priority immediately, including the first planning period; a confirmed commitment further strengthens continuity. Required cash protection and Emergency Fund recovery come first, then Serious requests, Normal goals, residual General Savings and unallocated money. Lower-priority destinations absorb reductions first; infeasible Serious requests show shortfall and concrete consequences without inventing capacity.

General Savings follows global mode without requiring a target, date or description; only goals have optional mode overrides. Both modes remain editable, including reductions to zero. A Serious override shows old/new contribution and conditional timing/coverage or saving-balance consequence, clearly identifies the changed Serious contribution, and requires only the normal explicit plan confirmation. No repeated reassurance dialogs, money locks, fees, penalties, debt from missed commitments or guilt language.

Confirm records a versioned financial commitment for tracking and later recommendations. It is not a legal agreement, transfer, withdrawal, cancellation, or restriction on spending. A material change produces a new proposal and comparison with the prior commitment. Every replacement needs explicit confirmation, including user-requested adjustments.

## Non-goals and extension points

No real banking connectivity, money movement, subscription cancellation, usage scraping, investment advice, credit scoring, fraud detection, full tax engine, ML forecasting, chatbot, warehouse, microservices or production authentication. Arbitrary performance scores are out of scope. Custom top-level taxonomy administration and non-monthly planning UI are later extensions; optional subcategories and typed period boundaries keep that path open.

Future bank/provider adapters may supply records through the repository boundary. Future subscription management/usage adapters require separate approval and real capability; MVP must never imply they exist. A deterministic engine and structured reasons remain sufficient.

## Delivery constraints

Preserve the original red/neutral responsive UI, local operation and modular monolith. Use synthetic records, fictional branding and a visible prototype notice. Reuse existing routes where possible. Retain no-op bank controls only if clearly disabled/marked unavailable; do not imply that Add money or New account performs an action.

The freeze covers product behavior, inputs, outputs and acceptance examples. Data owns physical storage design. Frontend+Backend owns service and UI implementation. [Integration plan](INTEGRATION_PLAN.md) defines the shared seam and the exact parallel start boundary.
