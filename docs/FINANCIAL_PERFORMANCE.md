# Financial Performance — PM-1.1

Use the existing `/finance` view for factual metrics with source coverage, as-of time and actual/expected labels. No 0–100 score. Backend computes metrics; frontend formats them. [Financial rules](FINANCIAL_RULES.md) governs the underlying amounts.

| Metric | Calculation | Display/edge behavior |
| --- | --- | --- |
| Income | Posted recognized recurring + irregular net income | No transfer/refund/unknown inflow; show components |
| Essential Expenses | Posted net Essential expenses; expected unpaid component separately | Do not show the combined period forecast as already spent |
| Financial Obligations | Posted net obligations; unpaid required amounts separately | Shortfall remains visible |
| Flexible Spending | Posted Flexible consumption net of linked refunds | Zero is a real value, not missing data |
| Subscription Spending | Posted Subscription charges net of linked refunds | Separate from normalized monthly commitments |
| Recurring Subscription Commitment | Sum monthly equivalents of active records | Run-rate change, not actual spending change |
| Realized Savings | Net posted funding to Emergency Fund, General Savings and goals from spending/income, minus withdrawals back to spending or direct consumption from these funds | Exclude transfers between savings destinations; emergency use reduces net saving once |
| Savings Rate | Realized Savings / net income × 100 | Can be negative; null if income <= 0; never count confirmation as saving |
| Planned Savings | Sum current proposal/confirmed remaining saving allocations, labelled planned | Optional planned rate uses same denominator, distinct from realized rate |
| Emergency Coverage | Actual fund balance / Average Protected Monthly Outflow (Essential Expenses + Required Financial Obligations + Essential-labelled subscriptions, using rules §4 history/fallback) | Months to two decimals; null for unknown/zero denominator; Keep subscriptions excluded |
| Goal Progress | Actual funded amount / target × 100 | Cap visual bar at 100%; show actual amount and any surplus; no automatic progress on Confirm |
| Available Cash | Posted spending-account cash | Show upcoming costs, buffer and uncertain inflows leading to allocatable amount |
| Historical Disposable Capacity | Mean of last three complete periods; display months and sample count | Preserve negative values; partial history labelled; null when absent |

Net Realized Savings can be negative even when contributions are positive. Funding a goal from General Savings is a re-designation, not new saving. Gains/valuation changes are outside the synthetic cash-only MVP.

PM-1.1 canonical average protected outflow is 13,500 THB and recommended minimum is 40,500. Actual A/C emergency coverage is 1.3333 months (1.33 displayed), B is 0.0000. Projected coverage after the proposed contributions would be A 1.6111, B 0.5000, C 2.3519; label it projected and keep it separate from actual coverage on confirmation. Planned totals/rates remain A 14,000/46.67%, B 9,000/30.00%, C 24,000/60.00%; realized rates remain 0%, −60%, 0%. The one-off shock stays in actual expenses/saving metrics but outside the recurring protected-outflow denominator. Exact reconciliation is in [Demo §7](DEMO_SCENARIO.md#7-canonical-reconciliation-and-projected-values).

## Comparison semantics

Use the previous **complete** period for completed monthly comparisons. For an open current period, compare posted flows only to the same local day/time cutoff of the preceding month (clip to shorter-month end); label “month to date vs same point last month.” If that historical cutoff cannot be reconstructed, show the current value and “Comparable history unavailable.” Never compare an incomplete flow total against a whole prior month without stating different coverage; do not render a percentage trend in that case.

Balance/progress metrics use snapshots at the two as-of cutoffs. Commitment run-rate can compare two known subscription snapshots and must be labelled as run-rate. Historical capacity is already a multi-month aggregate, so show its window rather than an unrelated month-over-month percentage.

For money: absolute delta = current − prior; percentage change = delta / abs(prior) × 100 when prior != 0. When prior is zero show only absolute change and “No prior baseline.” For rates use percentage-point difference (e.g. 41% to 46% is +5 percentage points). Coverage uses months; goal progress uses percentage points. Round only the display, not underlying money computations. Negative expense totals from cross-period refunds carry an adjustment label and no misleading “improved habits” claim.

The Phase 1 hardcoded +4.8% account trend must be removed or replaced with this evidence. Do not reuse illustrative percentages from `taskPM_MASTER.md` as demo facts. [Demo scenario](DEMO_SCENARIO.md) lists expected actual/planned values and historical amounts; integration tests must derive them from the same seed.
