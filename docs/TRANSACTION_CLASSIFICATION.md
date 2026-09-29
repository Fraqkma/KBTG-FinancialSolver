# Transaction classification — PM-1.1

Target behavior, governed by [Financial rules](FINANCIAL_RULES.md). Phase 1 free-text Home/Food/Lifestyle categories and income/expense strings are not the final taxonomy.

## Template and representation

Transaction cash direction is `inflow|outflow`, with signed amount (positive inflow, negative outflow). Category describes meaning independently. Persist original description/date/amount and classification history; edits never change posted cash.

| Top-level label / wire value | Examples | Treatment |
| --- | --- | --- |
| Income / `income` | Salary, freelance | Recurring or irregular, recognized only with reliable provenance |
| Essential / `essential` | Rent, basic food, transportation, utilities | Required everyday costs |
| Financial Obligation / `financial_obligation` | Loan installment, required contractual payment | Separate category from essentials; included in Protected Monthly Outflow for emergency coverage |
| Savings / `savings` | Funding Emergency Fund, General Savings or a goal | Owned-account movement; not consumption or new income |
| Subscription / `subscription` | Recurring digital service | Distinct category; label can be Essential |
| Flexible / `flexible` | Dining, shopping, entertainment | Discretionary consumption |
| Transfer / `transfer` | Movement between owned accounts, pass-through funds | Never new income; link legs where both are present |
| Other / `other` | Unknown or nonstandard activity | Uncertain inflows excluded; outflow still reduces cash |

Optional subcategory is a short user-editable label under one of these parents, maximum 60 characters. MVP may remember this detail with a classification rule. A full category-management UI and custom top-level semantics are deferred. Unknown parent values are rejected; custom details cannot bypass parent semantics.

`inflow_kind=recurring_income|irregular_income|transfer|refund|other|unknown` is required for inflows and null for outflows. Refund is a distinct inflow kind, not a ninth category: inherit the original expense category when linked, otherwise use Other until resolved. Internal savings transfers use category Savings and inflow kind transfer. A transaction may carry `is_emergency=true` independently of its category, only after an explicit choice/known fixture fact.

## Suggest, remember, correct

1. Prefer an explicit classification for this transaction.
2. Otherwise apply an explicit remembered rule matching normalized counterparty/merchant identity, direction and recurring-series identity when present. Match identifiers, not an arbitrary substring in display descriptions.
3. Otherwise suggest from deterministic evidence: a seeded known source or at least three matching monthly events, same counterparty/direction, amount variation <= 10% of the median and date within five calendar days of the expected monthly day. Store these thresholds with the classification policy version. Pattern evidence suggests a recurring source; it does not make an ambiguous transfer into salary.
4. Display confident expense suggestions as suggestions, editable at any time. Verified recurring income source/explicit remembered income choice may be recognized automatically. A new inferred salary source remains a suggestion until confirmed once.
5. Ask about uncertain activity only if >= 500 THB or if the uncertainty affects feasibility/material recommendations. Keep one unresolved prompt per source/event and remember dismissals until new relevant evidence.

Persist provenance `user|remembered|fixture|suggested|unknown`, resolution `confirmed|suggested|unresolved`, matched rule ID and prior classification. Remembering is opt-in (“Use for similar activity”), defaults off for a one-off correction, and applies prospectively. Do not reclassify past history silently. A user can replace/disable a remembered rule by changing its reuse setting. Do not remember emergency status across all transactions from a merchant.

## Income, transfers and refunds

The lightweight inflow choice is Income / Transfer / Refund / Other. Income then uses an existing known recurring source or defaults to irregular; ask tax treatment only if usable cash remains unclear. Unknown inflow increases observed cash but stays in `uncertain_inflow_amount`. If confirmed as Transfer, it can become usable spending cash, but cannot increase income or historical earning capacity. If transfer linkage is incomplete, warn and prevent duplicate recognition of a later matching leg.

A linked refund reduces the same period/category's net expense up to the original unreversed amount; the original record stays visible. Cross-period refunds affect current cash and current net expense metrics, with a cross-period adjustment label; they do not rewrite previously confirmed state snapshots. The engine uses gross recurring protected costs (essentials, required obligations and Essential-labelled subscriptions) for the emergency denominator when an exceptional refund would otherwise distort the recurring need. Preserve component/label evidence under Financial rules §4; one-off emergency expenses, transfers and Keep subscriptions do not enter that denominator. An unlinked refund stays Other with an explicit adjustment label, never income; it is usable after user confirmation. No negative amount or cash direction is inferred from category alone.

Savings funding is linked to one destination and paired transfer/event ID. Count only one contribution per pair. Withdrawals from savings are not income, and reclassifying an internal transfer cannot conjure extra assets. Split one expense paid from two accounts using a shared event ID; sum its parts once.

## Recurrence and subscriptions

`recurring=true` alone does not identify a subscription. Rent and debt are recurring obligations with different categories. Store recurrence type, schedule, confidence and linked occurrences. A confirmed subscription creates or links a subscription record; history suggestions can be reviewed as a group. Match a posted charge to one due occurrence using explicit fixture/reference links first; ambiguous matches require resolution. A match removes that occurrence from upcoming cash reservations.

Material reclassification updates Financial State and offers recalculation; it never edits an old confirmed plan. Data owns classification history/rules/links; Frontend+Backend owns suggestions, validation and the correction UI. Tests must cover remembered choices, unlinked/linked refunds, transfer pairs, unknown inflows, small Other outflows, and corrected subscription matches.
