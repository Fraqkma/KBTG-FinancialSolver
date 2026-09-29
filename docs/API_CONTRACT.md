# API contract — PM-1.1

**Target contract, not the running Phase 1 API.** Reviewed against `main.py`, `schemas.py`, the web client and tests. Keep one local FastAPI application. Frontend+Backend owns HTTP/Pydantic/TypeScript models and services; Data owns persisted records and atomic repository operations described in [Integration plan](INTEGRATION_PLAN.md).

## 1. Common conventions

All routes except `/health` operate on the one synthetic demo user; do not accept a caller-selected user ID. No authentication or third-party API is introduced by this contract. API prefix stays `/api`. Client/server/fixtures switch to PM-1.1 together; no silent unit conversion or legacy fallback. A deployed compatibility version is unnecessary for this local prototype.

- `Money`: JSON string of major THB units, exactly two decimal places (`"15000.00"`); maximum absolute value 999999999999.99. Signed only where stated. Reject floats, exponent notation, NaN, more than two decimals and out-of-range values.
- `Id`: nonempty opaque string, maximum 128 characters. `Version`: positive integer. `Revision`: opaque string, maximum 128. Never calculate revision tokens in the browser.
- `Instant`: RFC3339 UTC string. `Date`: `YYYY-MM-DD` local date. `Month`: `YYYY-MM`. `Ratio`: decimal string (four fractional places); display rounding is separate.
- All listed response fields are required; nullable is explicitly `| null`. Request fields are required unless marked optional. Reject unknown mutation fields. Names <= 120 characters, descriptions <= 500. Enumerations below are closed.
- `Period`: `{id: Month, start: Instant, end_exclusive: Instant, timezone: "Asia/Bangkok", cadence: "monthly"}`.
- `Mode`: `normal|serious`. `Importance`: `high|standard|low`. Categories/inflow kinds/provenance follow [Transaction classification](TRANSACTION_CLASSIFICATION.md).
- Reads use current period if `period` omitted. Unsupported/malformed periods return 422. Historical state is read-only; new plans/edits require the active period. Lists are deterministic (transactions: occurred_at descending, ID ascending tie; other entity lists: ID ascending). The synthetic MVP is bounded; no pagination framework required.
- Every mutable input record has `record_version`. Financial State has aggregate `state_version`, including relevant source records, policy and current commitment reference. A mutation checks `expected_state_version` atomically. Updates never partially succeed.
- Read envelopes are `{data: T, state_version: Revision}` unless a table specifies otherwise. The token is from the same repository snapshot as the data. No caching requirement beyond ordinary local reads.

PM-1.1 preserves PM-1 object shapes, endpoints, `Mode` and `Goal.mode_override`; the amendment changes policy/version, amounts and reason-fact requirements only. Serious takes effect in the first planning period without a prior confirmation. General Savings inherits `Preferences.mode`; no new destination override or constraint-level enum is introduced. A Serious reduction uses the same preview/confirm operations as Normal, with no additional confirmation flag or dialog.

## 2. Shared read objects

### Accounts, transactions and classifications

```text
Account = {
  id: Id, name: string, kind: spending|savings|goal,
  account_mask: string, currency: "THB", balance: Money,
  purpose: spending|emergency_fund|general_savings|goals,
  as_of: Instant, record_version: Version
}
Classification = {
  category: Category, subcategory: string|null,
  inflow_kind: InflowKind|null,
  resolution: confirmed|suggested|unresolved,
  provenance: user|remembered|fixture|suggested|unknown,
  remembered_rule_id: Id|null,
  tax_treatment: net_after_tax|additional_tax_known|unknown|not_applicable,
  is_emergency: boolean, emergency_confirmed_at: Instant|null
}
Transaction = {
  id: Id, account_id: Id, amount: signed Money,
  direction: inflow|outflow, description: string, occurred_at: Instant,
  counterparty_key: string|null, classification: Classification,
  recurring_series_id: Id|null, occurrence_id: Id|null,
  transfer_pair_id: Id|null, refund_of_transaction_id: Id|null,
  income_reversal_of_transaction_id: Id|null,
  event_id: Id|null, contribution_id: Id|null, record_version: Version
}
```

Cash direction and sign must agree, amount nonzero. Refund reference must be to an eligible prior expense, same owner/currency, not refunded beyond original amount. Income reversal links are source facts on outflows, referencing recognized income of the same owner/currency; reverse at most the original unreversed amount and retain the income kind from the linked receipt for net-income aggregation. A reversal is not also consumption. A transfer pair may not be matched twice. Emergency true requires explicit user/fixture confirmation. Classification requests cannot edit transaction amount, account or occurrence timestamp.

### Goals, preferences and recurring records

```text
Goal = {
  id: Id, name: string, description: string|null,
  target_amount: Money, current_amount: Money, target_date: Date|null,
  importance: Importance, mode_override: Mode|null,
  status: active|paused|completed, record_version: Version
}
Preferences = {
  flow_sync_enabled: boolean, mode: Mode,
  emergency_target: Money|null, minimum_cash_buffer: Money,
  currency: "THB", timezone: "Asia/Bangkok", cadence: "monthly",
  record_version: Version
}
Subscription = {
  id: Id, name: string, counterparty_key: string|null,
  amount: Money, currency: "THB", interval: monthly|annual,
  anchor_date: Date|null, next_billing_date: Date|null,
  label: essential|keep|consider_cancelling,
  status: active|ended, ended_on: Date|null,
  source: manual|confirmed_pattern|fixture,
  monthly_equivalent: Money, last_charge: TransactionRef|null,
  record_version: Version
}
RecurringCommitment = {
  id: Id, name: string,
  kind: essential|financial_obligation|tax,
  amount: Money, interval: monthly|annual|once,
  anchor_date: Date, status: active|ended, ended_on: Date|null,
  record_version: Version
}
TransactionRef = {id: Id, amount: signed Money, occurred_at: Instant}
CommitmentOccurrence = {
  id: Id, source_type: recurring_commitment|subscription,
  source_id: Id, category: Category, name: string,
  due_date: Date|null, amount: Money,
  status: unpaid|paid|waived, paid_transaction_id: Id|null,
  estimated: boolean
}
```

Goal `current_amount` is derived from funding assignments, read-only through goal editing. Target must be > 0. A target below current funding is allowed and marks the goal complete with surplus visible; no automatic withdrawal. Completed goals require funding >= target, and reopening with a larger target is an explicit edit. Paused status can be selected at any time. Goal date is optional; a past date produces an overdue warning, not a rejected goal. Fund balances remain separate from goal definitions.

Subscription/recurring amounts must be > 0. An ended record requires `ended_on`; active requires null. Subscription `next_billing_date` and `monthly_equivalent` are derived; unknown anchor produces null next date and the conservative policy from [Subscription Manager](SUBSCRIPTION_MANAGER.md). Records preserve paid occurrences and history on edits. No deletion route erases financial history.

### State and performance

```text
AmountBreakdown = {
  category: Category, posted_amount: signed Money,
  upcoming_amount: Money, period_total: signed Money
}
GoalAssessment = {
  goal: Goal, effective_mode: Mode, remaining_amount: Money,
  progress_ratio: Ratio, required_monthly_contribution: Money,
  proposed_contribution: Money|null, estimated_completion_month: Month|null,
  estimate_assumption: string|null, reasons: Reason[]
}
HistoricalCapacity = {
  window_months: integer, sample_count: integer,
  periods: [{period: Month, net_income: Money, consumption: signed Money,
             disposable_capacity: signed Money}],
  mean: signed Money|null, limited_history: boolean
}
ProgressItem = {
  destination: Destination, committed_amount: Money,
  realized_net_amount: signed Money, outstanding_amount: Money,
  contribution_ids: Id[]
}
Commitment = {
  confirmation_id: Id, plan_id: Id, version: Version,
  period: Month, confirmed_at: Instant,
  supersedes_confirmation_id: Id|null, progress: ProgressItem[]
}
MetricSet = {
  net_income: Money, essential_expenses: signed Money,
  financial_obligations: signed Money, flexible_spending: signed Money,
  subscription_spending: signed Money, subscription_commitments: Money,
  realized_savings: signed Money, savings_rate: Ratio|null,
  available_cash: Money, emergency_coverage: Ratio|null,
  goal_progress: [{goal_id: Id, ratio: Ratio}]
}
ComparableMetrics = {
  period: Period, as_of: Instant, metrics: MetricSet,
  coverage: complete|matched_cutoff|unavailable
}
FinancialState = {
  period: Period, as_of: Instant, state_version: Revision, policy_version: string,
  net_income: Money, recurring_income: Money, irregular_income: Money,
  gross_or_taxable_income: Money|null, tax_reserved: Money,
  essential_expenses: signed Money, financial_obligations: signed Money,
  flexible_spending: signed Money, subscription_commitments: Money,
  subscription_spending: signed Money, expense_breakdown: AmountBreakdown[],
  upcoming_commitments: CommitmentOccurrence[],
  available_cash: Money, minimum_cash_buffer: Money,
  uncertain_inflow_amount: Money, allocatable_amount: Money, cash_shortfall: Money,
  emergency_fund_balance: Money, recommended_emergency_minimum: Money|null,
  emergency_fund_target: Money|null, emergency_coverage: Ratio|null,
  general_savings: Money, active_goals: GoalAssessment[],
  existing_commitments: Commitment[], historical_disposable_capacity: HistoricalCapacity,
  performance: MetricSet, previous_period_metrics: ComparableMetrics|null,
  completeness: complete|limited_history|needs_input|inconsistent,
  warnings: Issue[]
}
```

State money totals follow [Financial rules](FINANCIAL_RULES.md); signed expense totals permit cross-period refund adjustments. Income reversals cannot make recognized income negative; any excess is an unresolved correction, not silent valid income. `existing_commitments` contains at most two entries: this period's active commitment and the immediately previous period's final commitment, current first. The latter is a soft recommendation baseline, never an unpaid debt. `ProgressItem.committed_amount` is the full-period target (remaining allocation plus net funding already realized at its snapshot, floored at zero); outstanding subtracts current observed net funding and is floored at zero. Reads may return needs_input/inconsistent state with warnings; planning/confirmation must not treat that as valid. Assessment proposal fields are null outside a generated plan. `expense_breakdown` contains every category with consumption (including Other); Savings and Transfer never become consumption.

`recommended_emergency_minimum` and `emergency_coverage` now use Average Protected Monthly Outflow: Essential Expenses + Required Financial Obligations + explicitly Essential-labelled subscriptions, under the existing history/fallback policy. Current-period category totals alone cannot reconstruct that historical denominator. Preserve component history/labels in `source_snapshot_id` evidence and expose the components through emergency reason facts; no new FinancialState field is required. Canonical subscriptions are Keep, so their 600.00 monthly commitment stays outside the 13500.00 denominator. Zero/unknown coverage remains null. An empty `existing_commitments` list does not disable Serious ordering.

## 3. Plans, reasons and validation

```text
Destination = {kind: emergency_fund|general_savings|goal, goal_id: Id|null}
Reason = {
  code: ReasonCode, rule_id: string, message: string,
  facts: [{name: string, value: string, unit: thb|months|date|text}],
  previous_amount: Money|null, changed_amount: signed Money|null,
  consequence: string, protected: boolean, flexible: boolean
}
Issue = {code: string, field: string|null, message: string, blocking: boolean}
AllocationItem = {
  destination: Destination, amount: Money,
  recurring_amount: Money, one_off_amount: Money,
  editable: boolean, effective_mode: Mode, reasons: Reason[]
}
Plan = {
  plan_id: Id, version: Version, period: Period,
  status: proposed|confirmed|superseded, state_version: Revision,
  policy_version: string, source_snapshot_id: Id,
  created_at: Instant, confirmed_at: Instant|null,
  state_snapshot: FinancialState, allocations: AllocationItem[],
  unallocated: Money, reasons: Reason[], warnings: Issue[],
  validation: {valid: boolean, errors: Issue[]},
  replaces_confirmation_id: Id|null, trigger: RecalculationTrigger,
  is_stale: boolean
}
RecalculationTrigger = enable|manual|new_period|salary|irregular_income|
  unusual_expense|emergency_usage|goal_changed|obligation_changed|
  subscription_changed|preferences_changed|classification_changed|adjustment
```

Destination goal_id is required only for goal, null otherwise. No repeated destination. `recurring_amount + one_off_amount = amount`. Reasons exist for zero/deferred active goal allocations too. `source_snapshot_id` resolves to Data's immutable input/policy snapshot; `state_snapshot` is sufficient for the displayed explanation but not a substitute for storing original input evidence. Allocation amounts are remaining contributions, not full-period paid costs. Protected obligations are visible in state, not editable plan items.

`ReasonCode` minimum registry:

| Code | Required facts / rule |
| --- | --- |
| `REQUIRED_COSTS_RESERVED` | unpaid_total, buffer / rules §2 |
| `EMERGENCY_RECOVERY` | balance, target, gap, recovery_months, contribution, average_essential_expenses, average_required_obligations, average_essential_subscriptions, average_protected_monthly_outflow, emergency_multiplier, history_samples / §4 |
| `EMERGENCY_TARGET_BELOW_RECOMMENDATION` | selected_target, recommended_minimum, coverage (actual), selected_target_coverage, recommended_coverage, average_protected_monthly_outflow, target_shortfall / §4 |
| `GOAL_DEADLINE` | goal_id, remaining, months_remaining, requested, funded / §6 |
| `SERIOUS_COMMITMENT_PROTECTED` | effective_mode, request_source, requested, previous_outstanding, funded, shortfall, lower_priority_reductions / §6; priority applies without prior confirmation and can still be partially funded |
| `GOAL_REDUCED` | previous_or_requested, funded, old_completion, new_completion / §6 |
| `GENERAL_SAVINGS_REMAINDER` | recurring_budget, prior_allocations, amount / §6 |
| `HISTORY_CAP` | history_mean, samples, recurring_capacity, unallocated / §5–6 |
| `EXTRA_INCOME_EMERGENCY` | irregular_available, remaining_emergency_gap, amount / §6 |
| `EXTRA_INCOME_GOAL` / `EXTRA_INCOME_SAVINGS` | irregular_remaining, unmet_request (goal only), amount / §6 |
| `USER_ADJUSTMENT` | effective_mode, recommended, requested, consequence; old/new conditional completion for dated goals, old/new projected balance for undated savings, old/new projected coverage for emergency contributions / §6 |
| `EMERGENCY_USAGE` | event_id, emergency_paid, spending_paid, capacity_change / §4 |
| `LIMITED_HISTORY` / `CARRIED_CASH` | samples or carried_cash / §2, §5 |

Fact values are serialized strings with explicit units, names validated for the code. They are explanatory data, never a client-supplied calculation input. Consequences include a conditional timeline or coverage effect as appropriate. Add a code only with a documented domain rule. Do not expose backend jargon as primary UI copy.

For `SERIOUS_COMMITMENT_PROTECTED`, `request_source` is text `deadline|current_preview|current_commitment|previous_commitment|derived_remainder`; if deadline and commitment compete, report the source determining the larger request (commitment on an equal amount). `previous_outstanding` is 0.00 when absent; it is evidence, not an eligibility test. `shortfall=max(0,requested-funded)` is THB; `lower_priority_reductions` identifies reduced destinations/amounts as text. Emit this reason for Serious requests even when funding is zero and explain the consequence. Pair goal reductions with `GOAL_REDUCED`; for General Savings give requested/funded projected balances in the consequence/facts instead of inventing a target date. `protected=true` describes recommendation priority, never a money lock; `flexible=true` and `editable=true` remain valid for user-overridable savings. `previous_amount` compares to the earlier reviewed amount or confirmed contribution when one exists, otherwise null; `changed_amount` is funded minus that comparison, otherwise null. Keep comparison provenance in facts.

### PM-1.1 canonical response expectations

All amounts below are wire `Money` strings; coverage is a four-place `Ratio`. These are field/array excerpts, not additional response envelopes. Canonical target/recommendation is `"40500.00"`, historical denominator `"13500.00"`, policy_version `"PM-1.1"`; both goals/global mode stay `normal`.

| Field / destination amount | A | B | C after income confirmation |
| --- | --- | --- | --- |
| `available_cash` | `"18900.00"` | `"12900.00"` | `"28900.00"` |
| `allocatable_amount` | `"15000.00"` | `"9000.00"` | `"25000.00"` |
| `emergency_fund_balance` | `"18000.00"` | `"0.00"` | `"18000.00"` |
| `emergency_coverage` | `"1.3333"` | `"0.0000"` | `"1.3333"` |
| Emergency allocation | `"3750.00"` | `"6750.00"` | `"13750.00"` |
| Emergency `recurring_amount` | `"3750.00"` | `"6750.00"` | `"3750.00"` |
| Emergency `one_off_amount` | `"0.00"` | `"0.00"` | `"10000.00"` |
| Laptop allocation | `"5000.00"` | `"2250.00"` | `"5000.00"` |
| Moving allocation | `"1000.00"` | `"0.00"` | `"1000.00"` |
| General Savings allocation | `"4250.00"` | `"0.00"` | `"4250.00"` |
| `unallocated` | `"1000.00"` | `"0.00"` | `"1000.00"` |
| Laptop `estimated_completion_month` | `"2026-12"` | `"2027-05"` | `"2026-12"` |

All other destination splits are recurring with zero one-off amounts. B laptop `GOAL_REDUCED` compares 5000.00 → 2250.00 (`changed_amount="-2750.00"`), completion 2026-12 → 2027-05; moving compares 1000.00 → 0.00 with null new completion. C `EXTRA_INCOME_EMERGENCY` facts are irregular_available=10000.00, remaining_emergency_gap=18750.00 after recurring recovery, amount=10000.00. Projected C emergency balance 31750.00 and coverage 2.3519 never replace actual state values on Confirm.

Complete A emergency AllocationItem example:

```json
{
  "destination": {"kind": "emergency_fund", "goal_id": null},
  "amount": "3750.00",
  "recurring_amount": "3750.00",
  "one_off_amount": "0.00",
  "editable": true,
  "effective_mode": "normal",
  "reasons": [{
    "code": "EMERGENCY_RECOVERY",
    "rule_id": "financial_rules.4",
    "message": "Build your emergency savings toward 40500.00 THB over six months.",
    "facts": [
      {"name": "balance", "value": "18000.00", "unit": "thb"},
      {"name": "target", "value": "40500.00", "unit": "thb"},
      {"name": "gap", "value": "22500.00", "unit": "thb"},
      {"name": "recovery_months", "value": "6", "unit": "months"},
      {"name": "contribution", "value": "3750.00", "unit": "thb"},
      {"name": "average_essential_expenses", "value": "12000.00", "unit": "thb"},
      {"name": "average_required_obligations", "value": "1500.00", "unit": "thb"},
      {"name": "average_essential_subscriptions", "value": "0.00", "unit": "thb"},
      {"name": "average_protected_monthly_outflow", "value": "13500.00", "unit": "thb"},
      {"name": "emergency_multiplier", "value": "3", "unit": "months"},
      {"name": "history_samples", "value": "3", "unit": "months"}
    ],
    "previous_amount": null,
    "changed_amount": null,
    "consequence": "If funded, your balance would be 21750.00 THB, covering 1.61 months; 18750.00 THB would remain to your target.",
    "protected": true,
    "flexible": true
  }]
}
```

The non-canonical first-period Serious moving example in [Demo §8](DEMO_SCENARIO.md#8-non-canonical-serious-acceptance-examples) requires `existing_commitments=[]`, goal override/effective mode `serious`, requested/funded=1000.00, previous_outstanding=0.00, shortfall=0.00, request_source=deadline. Its Normal laptop receives 1250.00 after emergency 6750.00. A moving reduction to 500.00 returns `USER_ADJUSTMENT`, changed_amount=-500.00, completion 2027-02 → 2027-08 and unallocated=500.00; one normal Confirm saves that exact preview. The infeasible variant returns requested=1000.00, funded=500.00, shortfall=500.00, with Normal laptop zero. No extra public schema or prior-commitment requirement is implied by the retained reason-code name.

## 4. Operations

### Existing routes retained with PM-1.1 schemas

| Method/path | Purpose and request | Success |
| --- | --- | --- |
| `GET /health` | Local readiness; no query/body | 200 `{status:"ok", mode:"fictional-demo", contract_version:"PM-1.1"}`; 503 if required persistence unavailable |
| `GET /api/accounts` | Account display | 200 envelope `Account[]` |
| `GET /api/transactions?period=YYYY-MM` | Period activity including savings/transfer legs | 200 envelope `Transaction[]` |
| `GET /api/goals` | All goals including paused/completed | 200 envelope `Goal[]` |
| `GET /api/financial-state?period=YYYY-MM` | State and performance | 200 `FinancialState` (already includes revision) |
| `GET /api/flow-sync/plan?period=YYYY-MM` | Read saved current commitment and latest proposed version; no hidden writes | 200 `{period:Period,state_version:Revision,current_commitment:Commitment\|null,proposal:Plan\|null}` |
| `POST /api/flow-sync/preview` | Validate edited amounts against server facts; request below | 200 `Plan`, a stored immutable proposal version |
| `POST /api/flow-sync/confirm` | Persist exact reviewed version; request below | 200 `{confirmed:true,confirmation:Commitment,plan:Plan,state_version:Revision,message:string}` |

```json
{
  "plan_id": "plan-2026-09",
  "version": 1,
  "expected_state_version": "demo-a-1",
  "adjustments": [
    {"destination": {"kind": "goal", "goal_id": "goal-laptop"}, "amount": "2000.00"}
  ]
}
```

Preview body above is complete. Unspecified allocations retain base amounts. Empty adjustments permit validation with no edits. Backend recomputes split of edited amounts: retain prior one_off up to edited amount, put rest in recurring, then validate total cash; an override may exceed history with a warning. Preview never accepts balances, income, expense totals or a complete FinancialState from the browser. Base may be the active confirmed plan or a current proposal; superseded/stale base yields 409. On invalid edit return 422, not a saved confirmable plan.

```json
{
  "plan_id": "plan-2026-09",
  "version": 2,
  "expected_state_version": "demo-a-1",
  "expected_confirmation_id": null,
  "idempotency_key": "demo-a-adjusted-confirm-1"
}
```

Confirm's `expected_confirmation_id` is the current active confirmation for this period (or null for the first). Check replay identity first, then exact proposal version, source revision, current commitment, enabled setting, target/input validity and actual cash in one atomic operation. Store the exact payload snapshot and confirmation, never regenerate defaults. Identical key/body returns original success; reused key with different body returns 409 `IDEMPOTENCY_CONFLICT`. A second key cannot confirm a superseded/changed version; return 409 `CONFIRMATION_CONFLICT`. A repeat for the already active identical version can return its original success without creating a second commitment.

Confirmation changes the aggregate revision through the commitment reference. Return that new revision; the stored plan retains the revision it was reviewed against. `is_stale` applies to proposed versions; confirmed plans retain original assumptions and receive live feasibility/progress via current state. Status/times are lifecycle metadata, not mutation of allocation content.

### Only additional operations required by the journeys

| Method/path | Request | Success and boundary |
| --- | --- | --- |
| `GET /api/financial-preferences` | None | 200 envelope `Preferences` |
| `PATCH /api/financial-preferences` | `{expected_state_version, changes:{flow_sync_enabled?,mode?,emergency_target?,minimum_cash_buffer?}}` | 200 envelope Preferences; null target restores recommendation; currency/timezone/cadence not editable in MVP |
| `PATCH /api/transactions/{id}/classification` | `{expected_state_version, category, subcategory:null\|string, inflow_kind:null\|InflowKind, tax_treatment, is_emergency, refund_of_transaction_id:null\|Id, remember:boolean}` | 200 envelope Transaction; write explicit provenance and optional remembered rule atomically |
| `GET /api/subscriptions` | None | 200 envelope `Subscription[]`; suggestions remain visible in transactions until confirmed/recorded |
| `POST /api/subscriptions` | `{expected_state_version,name,counterparty_key:null\|string,amount,interval,anchor_date:null\|Date,label,source_transaction_id:null\|Id}` | 201 envelope Subscription; known recurring series may be linked once, no duplicate active record |
| `PATCH /api/subscriptions/{id}` | `{expected_state_version,changes:{name?,amount?,interval?,anchor_date?,label?,status?,ended_on?}}` | 200 envelope Subscription; validates merged record; no provider action |
| `POST /api/goals` | `{expected_state_version,name,description:null\|string,target_amount,target_date:null\|Date,importance,mode_override:null\|Mode}` | 201 envelope Goal; initially active, funded zero |
| `PATCH /api/goals/{id}` | `{expected_state_version,changes:{name?,description?,target_amount?,target_date?,importance?,mode_override?,status?}}` | 200 envelope Goal; no `current_amount` write |
| `GET /api/recurring-commitments` | None | 200 envelope `RecurringCommitment[]` for reviewing protected source records |
| `PATCH /api/recurring-commitments/{id}` | `{expected_state_version,changes:{name?,amount?,anchor_date?,status?,ended_on?}}` | 200 envelope RecurringCommitment; correct future expectations; cannot erase paid history |
| `POST /api/flow-sync/recalculate` | `{period:Month,expected_state_version:Revision,trigger:RecalculationTrigger}` | 201 Plan; fresh proposal from stored inputs; browser normally sends enable/manual, backend verifies event triggers |
| `GET /api/flow-sync/history?period=YYYY-MM` | Optional period; omit for all local history | 200 envelope `Plan[]`, newest period/version first; returns original snapshots including superseded commitments |

Change objects require at least one property. Optional nullable properties distinguish omission (“keep”) from null (“clear”). Create routes fill server IDs, timestamps, versions, source and derived fields. All mutations invalidate relevant proposals and return the new revision; they do not confirm plans. Generation/preview alone does not change financial input revision. Recalculation returns 422 for blocking state issues; it leaves the current commitment intact. Source input edits and enabled state may be made outside planning; historical plan content never changes.

No separate API for General Savings CRUD, performance score, entity administration, transfers, manual ledger balance updates, provider cancellation, policy management or public seed reset. General Savings/performance are state reads; observed funding comes from synthetic repository data. New recurring-obligation creation/import beyond the seeded records is deferred; record correction is sufficient for the MVP journey. If later scope adds obligation creation, specify it explicitly.

## 5. Errors and validation

All errors use one shape, including request validation and server failure:

```json
{
  "error": {
    "code": "ALLOCATION_EXCEEDS_CASH",
    "message": "Your plan exceeds the money available by 1000.00 THB.",
    "fields": [{"field": "adjustments", "code": "EXCEEDS_AVAILABLE", "message": "Use at most 15000.00 THB."}],
    "retryable": false,
    "current_state_version": "demo-a-1"
  }
}
```

`fields` may be empty; current_state_version may be null when state is unavailable. Do not leak stack traces or payloads.

| Status | Codes / handling |
| --- | --- |
| 404 | `NOT_FOUND` for unknown record, plan or version; do not substitute current version |
| 409 | `STATE_CHANGED`, `STALE_PLAN`, `CONFIRMATION_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `DUPLICATE_RECORD`; refresh/review or resolve duplicate |
| 422 | `INVALID_INPUT`, `ALLOCATION_EXCEEDS_CASH`, `TARGET_EXCEEDED`, `CASH_SHORTFALL`, `CLASSIFICATION_REQUIRED`, `INCOMPLETE_STATE`, `INVALID_FINANCIAL_STATE`, `FLOW_SYNC_DISABLED`, `PERIOD_NOT_ACTIVE`; show specific issue, no partial save |
| 503 | `DATA_UNAVAILABLE`, `CONFIRMATION_UNAVAILABLE`; safe retry, no success claim |
| 500 | `INTERNAL_ERROR`; safe generic message and local diagnostic ID if available |

Negative money, precision/sign mismatch, invalid references, duplicate destinations, inconsistent transfer/refund matches and conflicting status/date fields are boundary errors. Serious-mode reductions, lower emergency target, zero contributions, no goals and limited history are not errors by themselves.

## 6. Migration and contract acceptance

Phase 1 list bodies, integer THB fields, `available_for_plan`, free-text categories, state-body preview and `accepted` status are replaced by these explicit envelopes, decimal strings, derived cash state, typed categories, adjustment preview and versioned `confirmed` lifecycle. Update Pydantic, TypeScript, API client and fixtures in one coordinated change; never alias old integer numbers to satang implicitly.

Acceptance requires A/B and stretch C examples to serialize consistently, stale/replay/concurrent confirmation checks, no mutation from reads, persistent exact adjusted preview, transfer/refund/tax/subscription deduplication, zero/no-goal states and standard error shape. Also assert amended emergency facts/coverage and first-period Serious priority, higher-protection precedence, infeasible shortfall consequences and a cash-valid reduction saved with the ordinary confirmation. See [Integration plan](INTEGRATION_PLAN.md) for repository signatures and ownership. No unresolved product-level API issue remains in PM-1.1; physical table layout and internal DTO filenames remain engineering choices within these semantics.
