# Subscription Manager — PM-1.1

One of Flow Sync's connected inputs. Reuse Activity/Money overview navigation with a focused `/subscriptions` page or section. [API contract](API_CONTRACT.md) defines the shared objects; [Demo scenario](DEMO_SCENARIO.md) defines the only canonical service amounts.

## MVP behavior

List confirmed records and separately show suggested recurring services. Each record has synthetic merchant/series identity, display name, amount, currency, billing interval (`monthly|annual`), billing anchor date when known, next expected billing date when known, active/ended state, evidence/source, and preference label `essential|keep|consider_cancelling`. Default label is Keep. Allow manual recording and correction; show last posted charge and monthly equivalent.

Monthly commitment = amount for monthly billing or amount / 12 for annual billing, rounded to cents half-up for presentation. This is a comparison metric. Cash planning reserves the full unpaid charge due in the current period, not its monthly equivalent. A future annual charge outside the period is shown as upcoming later; MVP does not manufacture an amortized savings fund for it. State that limitation visibly when relevant.

Monthly dates retain the anchor day, clipped to the last day of shorter months. Annual dates clip February 29 to February 28 when needed, returning to the original anchor in leap years. Generate occurrences from the schedule and retain stable IDs. An occurrence is unpaid, paid (linked transaction), or explicitly waived/ended before becoming due. Overdue unpaid occurrences remain reserved and visible. Payment matching is atomic and unique so duplicate imports cannot double count.

## Cash-flow relationship

- Posted charge: belongs to Subscription spending and already reduced cash.
- Unpaid current-period occurrence: belongs to upcoming commitments and reserves cash once.
- Monthly equivalent: belongs to recurring commitment metrics; do not subtract it again.
- Essential label: additionally includes that subscription in Protected Monthly Outflow alongside Essential Expenses and Required Financial Obligations; it remains in category Subscription and is not added to the Essential subtotal or reserved twice.
- Keep / Consider Cancelling: excluded from the emergency denominator but still included in normal recurring cost and unpaid cash reservations. “Consider Cancelling” is an intention label, not cancellation evidence.

Use the Financial rules §4 history/fallback window and retain effective label history plus cost evidence to reproduce the denominator. A label edit updates relevant source revisions and future recommendations; it never rewrites confirmed snapshots. Canonical Melody Box 200 and Cloud Nest 400 are both Keep throughout June–September, so Essential subscription contribution to the denominator is zero: 12,000 essentials + 1,500 obligations = 13,500, recommended minimum 40,500. For a non-canonical complete-history variant with Melody Box explicitly Essential throughout all three months, average protected outflow becomes 13,700 and recommendation 41,100; do not retroactively assume that history from a new label edit. All 600 of subscription commitments remain in normal monthly costs either way.

If next date is unknown, display “Next date unknown.” For a known active monthly/annual service with no confirmed current-period payment and no usable schedule, conservatively reserve one full charge in this period with `due_date=null` and `estimated=true`. Ask for date only when that uncertainty is material to the plan. With evidence that this period is already paid, reserve zero; missing schedule remains flagged. Never guess a precise billing date.

Ending a record means the user reports it ended externally, with an effective date. Preserve prior charges and already due unpaid occurrences unless explicitly corrected with evidence; exclude occurrences whose due dates are after the effective end date. This does not contact the provider. Price/date edits affect future unpaid occurrences with a revision record; they cannot rewrite paid history or confirmed plans.

## Trend, suggestions and limitations

Show actual Subscription spending for comparable periods and change in recurring monthly commitment separately. Neither is a usage metric. Use the coverage rules in [Financial Performance](FINANCIAL_PERFORMANCE.md); do not claim a service is unused from cost alone.

Empty state invites “Record a subscription” or review of detected candidates. Loading, unavailable API, unknown billing date, duplicate match, and stale edit each get a specific recoverable state. The plan remains based on the last valid stored facts; failed edits must not appear saved.

Future extension seams: provider management adapter, cancellation/modification authorization, actual usage evidence and cost/usage analysis. These are deferred, with no fake cancel button, simulated provider success, or claimed usage insight in MVP. Data owns schedules/occurrences and reconciliation; Frontend+Backend owns user flows, matching rules and projection calculations.
