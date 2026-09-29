# Financial rules — PM-1.1

Target MVP policy; existing `finance.py` is the Phase 1 placeholder. PM-1.1 applies `taskPM_1_1_AMENDMENT.md` to the PM-1 freeze under `taskPM_MASTER.md`: only emergency coverage and Serious constraint semantics change. Defaults remain configurable prototype policy, not claims of universally suitable financial advice. Canonical values live in [Demo scenario](DEMO_SCENARIO.md).

## 1. Units, time and sources

Use THB only in MVP. Compute in integer satang or exact decimal with two places; never binary floating-point money. API money is a fixed two-decimal string in major THB units. Reject excess precision rather than silently round user input. Ratios may be decimal strings rounded for display.

`ceil_cent` rounds a nonnegative calculated contribution up to the next satang. Means retain exact precision through calculation; money-valued means/targets returned on the wire round half-up to cents and that same rounded amount is used by the engine. Ratios use four decimal places on the wire. Caps and final unallocated subtraction happen in exact cents so rounding cannot create extra money.

Store instants in UTC. Monthly periods use `Asia/Bangkok`, inclusive local start and exclusive next-month start. A period has `id` (`YYYY-MM`), `start`, `end_exclusive`, `timezone`, `cadence=monthly`. Due dates are local dates. Inject a clock for reproducible fixtures; do not derive the demo month from the wall clock. Retain explicit boundaries so another cadence can be added later.

Sources are posted synthetic transactions, reconciled account balances/opening snapshots, confirmed classifications, recurring schedules and occurrences, preferences, goal definitions/funding assignments, and immutable plan/confirmation records. A schedule is an expectation, not posted income or expenditure. A confirmed plan is an intention, not a bank transaction.

## 2. Financial State dictionary

State is a derived read model with `state_version`, `as_of`, `policy_version`, `period` and input completeness/warnings. Version changes whenever a financially relevant source changes. Classification suggestions and explicit choices retain provenance.

| Field | Meaning and source |
| --- | --- |
| `net_income` | Recognized posted recurring + irregular income within the period, net of explicitly linked income reversals; transfers, refunds and uncertain inflows excluded |
| `recurring_income` / `irregular_income` | Disjoint recognized income components; salary already net of tax in the demo |
| `gross_or_taxable_income` | Nullable explicitly supplied information; never inferred from net salary |
| `tax_reserved` | Unpaid, explicitly recorded tax obligation not already withheld; zero in all canonical scenarios |
| `essential_expenses` | Period total: posted Essential expense net of linked refunds + unpaid expected Essential occurrences; excludes subscriptions and obligations |
| `financial_obligations` | Same period total for required contractual outgoings, e.g. debt installment; excludes tax and all other category totals |
| `flexible_spending` | Posted Flexible expense net of refunds; future discretionary shopping is not silently reserved |
| `subscription_commitments` | Active subscriptions normalized to a monthly amount for recurring-cost awareness; not a cash deduction itself |
| `subscription_spending` | Posted Subscription charges net of linked refunds in this period |
| `upcoming_commitments` | Itemized unpaid occurrences due before period end: obligations, essentials, subscriptions and applicable explicit tax; includes overdue unpaid occurrences, excludes already matched payments |
| `available_cash` | Posted balance in designated spending accounts; excludes Emergency Fund, General Savings and goal-designated money; includes buffer and uncertain inflows until deducted below |
| `minimum_cash_buffer` | User-selected amount to leave outside new allocations; preference, not a money lock |
| `uncertain_inflow_amount` | Still-unclassified incoming money in spending accounts, held out of planning conservatively until resolved |
| `allocatable_amount` | Maximum additional contributions the current proposal may commit, as calculated below |
| `cash_shortfall` | Amount by which reserved upcoming cash, buffer and uncertain inflows exceed spending cash; never hidden by clamping |
| `emergency_fund_balance` | Actual funded amount designated exclusively for emergency use, from linked account/bucket; never a second goal balance |
| `recommended_emergency_minimum` | Configured multiplier × Average Protected Monthly Outflow (definition and history/fallback in §4) |
| `emergency_fund_target` | Explicit user target if set, else recommended minimum |
| `emergency_coverage` | Actual emergency balance / Average Protected Monthly Outflow, expressed in months; null when denominator is zero or unknown |
| `general_savings` | Actual savings with no required purpose/date; exclusive funded designation, separate from emergency and goals |
| `active_goals` / `goal_progress` | Active goal definitions and actual funded amounts/target, remaining gap, deadline contribution, proposed timeline; paused/completed goals excluded from new automatic allocations |
| `existing_commitments` | Active confirmation for this period and, if available, the immediately previous period's final confirmation; immutable targets, modes, realized progress and outstanding amounts |
| `historical_disposable_capacity` | Mean of complete prior monthly net income less consumption, obligations and applicable additional tax; §5 |
| `previous_period_metrics` | Derived prior-period metrics with comparison coverage; see [Financial Performance](FINANCIAL_PERFORMANCE.md) |

All expense totals are positive costs. Signed transaction amounts determine cash movement independently of category. Aggregations retain `posted_amount` and `upcoming_amount` components so the UI can distinguish actual and expected. Each occurrence/transaction contributes once to an expense category; an Essential subscription remains category Subscription and only joins the emergency cost denominator as a labelled subset.

### Available money and no double counting

```text
reserved = sum(unpaid upcoming commitment amounts)
raw_capacity = available_cash - reserved - minimum_cash_buffer - uncertain_inflow_amount
allocatable_amount = max(0, raw_capacity)
cash_shortfall = max(0, -raw_capacity)
```

Paid expenses already reduced account cash: do not subtract them again. Recognized income is explanatory context, not cash added a second time. Do not use total account balances as available money. A refund can restore cash but is not new income. Transfers between owned accounts do not create income. Moving savings to spending increases spending cash only after an actual recorded transfer; plan confirmation cannot do this.

Existing confirmed allocations are **not** subtracted a second time when evaluating a replacement proposal for the same period. The proposal replaces outstanding contributions; the old version remains current until confirmation. Already realized contributions left spending cash and are subtracted from remaining destination needs. There is one active commitment per user/period; past unmet promises inform explanations but are not legal debts or duplicate cash deductions.

No income is required to inspect Financial State. Zero income with usable carried cash can support a plan, with an explicit warning that it draws on existing cash. If `cash_shortfall > 0`, preserve required items and return a non-confirmable shortfall result, never a fabricated valid allocation. Zero capacity without shortfall can return a valid zero-contribution plan. Unknown essential inputs yield incomplete state and non-confirmable results.

## 3. Tax and classification

Salary and the canonical freelance receipt are explicitly net after tax; `tax_reserved=0`. Do not estimate/deduct tax again. If a future inflow has unknown tax treatment, ask only when needed to determine usable cash; exclude the unresolved amount until clarified. A user-provided unpaid tax amount is one upcoming occurrence; it is not simultaneously a second expense deduction.

Positive direction alone never means income. Use the eight-category template and income kinds in [Transaction classification](TRANSACTION_CLASSIFICATION.md). Materially uncertain incoming money is excluded; an unresolved material expense is already deducted from cash and prevents confirmation if its obligation/emergency meaning affects the proposal. Small unknown expenses remain Other, visible, and included in spending totals. Do not delete expenses because classification is uncertain.

## 4. Emergency Fund

```text
Protected Monthly Outflow
  = Essential Expenses + Required Financial Obligations + Essential Subscriptions
Recommended Emergency Minimum
  = emergency_multiplier × Average Protected Monthly Outflow
Emergency Coverage (months)
  = actual Emergency Fund balance / Average Protected Monthly Outflow
```

This denominator represents unavoidable monthly outflows during income loss or financial shock. Required contractual obligations now contribute alongside essentials; only subscriptions explicitly labelled Essential contribute. Keep and Consider Cancelling subscriptions, flexible spending, savings/goal contributions, transfers, one-off emergency expenses, already-withheld tax and optional purchases are excluded. Emergency Fund stays separate from Goals. Applicable explicit tax obligations continue under §3 and upcoming cash protection; do not infer tax or add a second tax component to this denominator.

Use the last `history_months=3` complete months' protected monthly outflows, retaining each month's component amounts and effective subscription labels. With fewer months, use available complete months and flag limited history. With no history, use current known recurring essential schedules/budget, required obligation schedules and Essential subscription costs, labelled estimated; unknown components are not zero and require input. A zero denominator gives null coverage rather than infinity. Use the existing recurring-cost evidence treatment for exceptional refunds; exclude a one-off emergency event without erasing it from actual spending/capacity metrics. Subscription monthly equivalents alone are not extra expenses; the history calculation uses the relevant month’s cost evidence once, preserving the existing history policy.

The default multiplier remains 3. Selected target can be any nonnegative amount, above or below the recommendation; show lower-target gap and coverage consequences without blocking. No target warning authorizes a transfer. Canonical history has 12,000 essentials + 1,500 required obligations + 0 Essential subscriptions = 13,500 THB per month; recommendation is 40,500 THB. The two Keep subscriptions still count toward normal cost and due cash reservations.

Default monthly recovery contribution = `ceil_cent(gap_before_period_contributions / recovery_months)` minus already realized net emergency contributions this period, floored at zero and capped at the current gap. `recovery_months=6`. Here `gap_before_period_contributions = max(0, selected_target - actual_balance + realized_net_contributions_this_period)`. Emergency expense withdrawals reduce actual balance and are not negative contributions; they increase recovery need. This keeps an already funded monthly contribution from being requested again.

An explicit emergency mark, or confirmation of a suggestion, makes the event eligible for emergency explanations. The app may show an impact preview using the emergency balance; it never draws from it automatically. Recorded synthetic emergency use changes the account balance and triggers a revised proposal. Large unconfirmed expenses are shown as possible emergencies, never permanently inferred as such.

## 5. Historical Disposable Capacity

For each of the last `history_months=3` complete calendar months:

```text
disposable_capacity = recognized net income
  - Essential expenses - Financial Obligation expenses
  - Subscription expenses - Flexible expenses - Other consumption
  - additional applicable tax expense
```

All expenses here are realized net of linked refunds, including emergency expenses. Internal transfers and savings contributions are not consumption. Do not truncate negative months to zero before averaging. Store source coverage; missing months are not zero-income months. The mean uses available complete months, with a limited-history warning if fewer than three; no complete history returns null. Current month is displayed separately and excluded from the history mean.

For new recurring recommendations use `max(0, mean)` as the historical cap; without history, use current recurring cash capacity and label affordability provisional. This is a planning guardrail, not a claim that future income is guaranteed. Unusual past losses lower the default cap; users may override with explanations and valid cash.

## 6. Deterministic allocation procedure

This is the frozen MVP procedure, replacing the 25%-of-salary/laptop policy. It uses needs and history, with no arbitrary goal score.

1. Build and validate state. Represent unpaid required obligations, essentials, subscriptions and applicable tax before allocating any savings. Return a shortfall/incomplete outcome where necessary.
2. Let `A=allocatable_amount`. Let `E=min(A, max(0, recognized irregular net income this period - irregular amount already assigned to realized savings contributions))`. Attribution to irregular income is persisted when recording synthetic contribution progress; default to recurring funding first, then irregular funding. This prevents reusing one-off income after it has been saved. Let `K=min(max(0, A-E), max(0, historical_capacity))`; without history substitute `A-E` for the history cap. `K` is the remaining recurring planning budget; reduce the history cap by already realized savings contributions funded from recurring money this period before taking this minimum.
3. From `K`, fund the remaining emergency recovery contribution in §4, capped by available budget. A below-target fund takes priority over goal contributions. If insufficient, show the delayed recovery amount.
4. Determine contribution requests below. Fund Serious goals first, then any Serious General Savings request, then Normal goals. Within goals use the deterministic order below. Cap every contribution by remaining `K` and, for goals, the actual remaining gap. Explicitly show reduced/zero requests and consequences. A prior confirmation is not needed for Serious priority.
5. Place the remainder of `K` in General Savings, in addition to any protected Serious saving contribution from step 4. This residual is lower priority than goal requests in either mode. This step also works with no active goals and no General Savings target.
6. Use up to `E` as one-off money: close any remaining emergency target gap first, then fill unmet current-month Serious requests and Normal goal requests in the same order, then General Savings. Do not accelerate all goal balances arbitrarily. Recompute available one-off money after recurring allocations; never exceed `A`.
7. Leave `A - sum(allocations)` as unallocated spending money. Recurring cash above sustainable history remains available by default; an explicit adjustment may save it.
8. Generate reasons, consequences and validation. User adjustments replace individual remaining contribution amounts (including zero); unspecified amounts retain the base version. Recompute unallocated and timelines. Reject total > `A`, negatives, unknown/duplicate destinations or destination amounts beyond their remaining target gaps. General Savings has no target cap. The selected emergency target can be changed first if the user wants to save beyond it.

### Goal requests and order

Goal target > 0, actual funding >= 0, optional date, optional importance `high|standard|low`, mode override `normal|serious|null`. Effective mode = override or global mode. Completed/paused goals get no automatic request; retained funding stays accounted for.

For a dated goal, count monthly contributions from the current month through the target month, inclusive, minimum one (overdue goals get one). Desired monthly amount = `ceil_cent((remaining_gap + realized_net_goal_contributions_this_period) / months_remaining)`. Subtract realized net contributions this period to obtain the remaining request. Completion prediction, assuming the proposed remaining contribution repeats monthly, uses `ceil(remaining_gap / proposed_contribution)` contribution months from the current month; zero yields no forecast. Predictions are conditional, never promises.

For commitment protection, prefer the current-period outstanding contribution. If there is no current-period confirmation, use the immediately previous period's final full-month target as a soft recurring baseline, subtracting any realized contribution in the new month. Do not carry an older missed amount as debt. Full-month target = remaining allocation in the confirmed snapshot + net contribution already realized for that destination at that snapshot (floor at zero). A current-period zero overrides an older nonzero baseline. Completed goals need no future forecast; show completion from observed funding.

For an undated goal use an existing confirmed monthly contribution when present, otherwise request zero and invite an optional amount during review. A selected amount in the current preview needs no prior confirmation. Mode/importance can protect and order a contribution but does not invent an undated target amount.

Order goals lexicographically: (1) effective Serious before Normal, regardless of confirmation history; (2) importance high/standard/low; (3) earliest target month, with undated last; (4) smaller remaining target gap; (5) within Serious, an outstanding existing commitment before none; (6) stable goal ID ascending. Normal goals retain their importance/date/gap/ID order, skipping the continuity tie-break. No Normal goal outranks a Serious goal through its commitment history. No opaque weighted score.

Serious's automatic request is the larger of the deadline request and outstanding existing commitment, capped at remaining gap; without a commitment, its deadline request receives the same Serious priority in its first period. Normal uses the recalculated deadline request (or prior commitment for an undated goal) and adapts more freely to current state. Existing commitments strengthen Serious continuity but are never a prerequisite for its behavior. Explicit user edits can lower either request, including to zero, and supersede these automatic defaults.

### Constraint strength, General Savings and shocks

Automatic recommendation order is required obligations/protected cash → Emergency Fund recovery → Serious goals / Serious saving requests → Normal goals → residual General Savings / lower-priority flexible saving → unallocated money. Actual cash, essential/upcoming costs, buffer and material unresolved uncertainty always constrain the plan. For one-off money, closing the emergency target gap still precedes every goal/saving request. Historical capacity remains the default recurring guardrail; Serious never manufactures extra capacity.

General Savings has no required target, date or description and inherits global mode; it has no destination-specific override. In global Normal it receives the remainder. In global Serious, use the same current/previous-period continuity baseline defined above when present. Without that baseline, its first-period default request is `max(0, K - funded_emergency_recovery - sum(current goal requests))`; this derives an amount from available needs/history, then protects it in step 4. A user may instead select a contribution through the existing preview before any confirmation. Serious goals precede Serious General Savings when those requests compete (General Savings has no importance/date/gap ordering inputs); both precede Normal goals. Additional General Savings beyond the request stays the residual in step 5. No new preference field or public mode is needed.

During a shock, fund higher-level protection/recovery, then preserve Serious requests as far as feasible. Reduce lower-priority Normal goals and residual General Savings first; consume otherwise unallocated capacity only within the existing cash/history rules. If Serious itself cannot be fully funded, show requested versus feasible amount, shortfall and conditional goal timing or saving/coverage effect. Do not move money or silently replace the confirmed plan.

Manual preview keeps the existing exact-edit contract: unspecified amounts stay at the base version, so the user must adjust other entries if their chosen amounts exceed cash. This is an explicit override of the automatic recommendation, not a reason to reject a cash-valid Serious reduction. Show old versus new contribution, state that a Serious contribution/commitment is being changed, and update conditional timing/coverage as applicable. Use only the normal explicit plan confirmation; no extra or repeated “are you sure?” flow. Never lock funds, impose fees/penalties, treat a missed commitment as debt, or use punishment/guilt language.

## 7. Commitment, progress and versioning

Proposal content is immutable: state snapshot/version, policy version/config, allocations, goals, effective modes, source assumptions, warnings, reasons, period and creation time. A preview creates another proposal version; it does not change the current confirmed commitment. Confirm references the exact stored version and checks current source revision and cash again atomically.

Persist confirmation time, idempotency identity, replaced confirmation reference and realized progress links. One active confirmed version per user/period; earlier confirmed versions are retained and shown as superseded. A changed goal, classification or preference never rewrites historical snapshots. A duplicate identical confirmation returns the original result. Stale versions return a conflict and require refreshed review.

Progress is observed posted savings funding assigned once to a destination, not the confirmed amount. A matched internal transfer counts once toward saving, never twice at debit/credit legs. Emergency spending is tracked separately. Prototype confirmation does not generate ledger records. Users may leave an infeasible old commitment recorded while reviewing a revision; its current feasibility must be visible.

## 8. Recalculation policy

Every posted/source change refreshes metrics and relevant revision tokens. Suggestions may be computed locally in the backend on demand, without queues. Automatic recalculation can only produce a proposal; it never confirms one.

| Event | Metrics | Proposal/prompt | Review requirement |
| --- | --- | --- | --- |
| Small ordinary transaction | Refresh | No prompt unless accumulated effect crosses threshold or invalidates current plan | Any eventual replacement requires Confirm |
| New monthly period | Refresh | New period proposal when enabled and sufficient data | Confirm new period |
| Salary received | Refresh | Suggest updated monthly plan | Review before replacing commitment |
| Unknown meaningful inflow | Refresh cash, quarantine inflow | Ask Income/Transfer/Refund/Other once | Resolve before using that money |
| Confirmed meaningful irregular income | Refresh | Suggest recalculation | Review replacement |
| Large/unusual expense | Refresh cash immediately | Ask whether emergency if unclear; suggest impact review | Resolve material ambiguity; review replacement |
| Confirmed emergency usage | Refresh fund/cash | Recovery proposal | Explicit replacement confirmation |
| Goal, obligation, subscription or financial preference change | Refresh | Recalculate; notify only for material effect | Any replacement requires review |
| Manual recalculate | Refresh | Always compute on request | No confirmation unless user accepts |

Material notification: any infeasibility, a target-date shift of at least one month, or aggregate absolute change in destination amounts/unallocated since last displayed proposal >= `max(500 THB, 5% of prior allocatable amount)`. Accumulate small changes; do not compare only the last transaction. Any revision-token mismatch still prevents confirmation, even if below the notification threshold. Coalesce one pending prompt per period/reason; dismissed prompts stay quiet until a new material change. Recompute safely on next view; do not depend on background infrastructure.

## 9. Central policy defaults

| Key | PM-1.1 default | Purpose |
| --- | --- | --- |
| `planning_timezone`, `cadence` | Asia/Bangkok, monthly | Period boundaries |
| `history_months` | 3 complete months | Capacity and emergency expense window |
| `emergency_multiplier` | 3 | Recommended coverage |
| `recovery_months` | 6 | Target gap recovery horizon |
| `default_mode` | normal | Minimal onboarding |
| `default_minimum_cash_buffer` | 2,000 THB | Available cash outside new commitments; editable down to zero |
| `material_change_absolute`, `material_change_relative` | 500 THB, 0.05 | Prompt threshold; larger threshold applies |
| `unusual_expense_absolute`, `unusual_expense_relative` | 5,000 THB, 0.20 | Flag expense >= larger of absolute and fraction of mean recurring income; without history use current recurring income |
| `classification_material_amount` | 500 THB | Unknown amounts >= threshold prompt; smaller ones prompt too if they change feasibility or materially change recommendation |

No goal-weight configuration is needed because ordering is explicit. Policy version and values are captured in each plan. Advanced UI may expose recovery horizon later; MVP needs selected emergency target, global mode, per-goal mode and editable cash buffer. Currency precision and safety invariants are not user toggles.

## 10. Invariants and failure outcomes

1. Every allocation and unallocated amount is nonnegative; sum(allocations) + unallocated = allocatable amount exactly to the cent.
2. Confirmed remaining contributions cannot exceed actual eligible cash after upcoming costs/buffer/uncertainty. Income-based capacity alone never authorizes spending.
3. Required expenses remain represented, including when funds are insufficient. No valid savings plan is fabricated from missing or inconsistent data.
4. Paid obligations and subscription occurrences are not reserved again; transfers are not income; net salary is not taxed again; refunded expense is not erased from history.
5. Account/bucket funding is exclusive; Emergency Fund is not simultaneously a goal or General Savings. Progress is not confirmation.
6. Negative historical capacity and emergency losses remain visible. Limited history, zero denominators and no-goal states are explicit.
7. Confirmed plan/version is reproducible; exact reviewed adjustments survive confirmation/restart. Stale or competing confirmations cannot silently win.
8. Every meaningful amount/change has structured reasons and consequences. Serious mode never blocks an otherwise cash-valid override.
9. Revisions never silently overwrite confirmed commitments. Material uncertainty cannot be presented as fact.
10. API/domain failures leave previous commitments and balances intact. Use typed validation errors, not fallback sample results.
