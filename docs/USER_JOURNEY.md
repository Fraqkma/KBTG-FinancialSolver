# User journey — PM-1.1

Target behavior using the existing fictional banking shell and routes. [Product specification](PRODUCT_SPEC.md) owns scope; [API contract](API_CONTRACT.md) owns operations. Screens may combine sections; do not build an independent application for each pillar.

## Entry and setup

Home shows balances, activity and a Flow Sync invitation. A new profile sees “Enable Flow Sync”; one action enables monthly planning with Normal mode and default policy. Show the recommended emergency target and available history; allow optional edits in Settings. No required goal or priority questionnaire. Existing demo fixtures can start enabled. Disabled users can still view accounts/activity and saved history.

`/settings` exposes enable/disable, global Normal/Serious mode, emergency target and cash buffer. `/goals` permits an optional per-goal mode override and importance. Advanced recovery configuration is deferred; its default is visible in the explanation. Saving preferences persists input facts and invalidates affected proposals, but does not accept a new plan.

Explain Serious as stronger protection in recommendations from the first plan, with lower-priority Normal goals/residual savings reduced first. Existing commitments add continuity; they are not required to activate the mode. Required cash and Emergency Fund recovery remain ahead of Serious. General Savings follows the global mode, with no separate override control.

## Normal month (Scenario A)

1. Open Home after the canonical salary receipt; the CTA points to `/flow-sync`.
2. Review the financial picture: income, paid costs, unpaid upcoming commitments, cash buffer, Emergency Fund, General Savings, goals, subscriptions and history.
3. Open `/flow-sync/plan` for the server-generated remaining contributions. Show actual money available and the historical capacity used; list why each destination gets its amount and what remains flexible.
4. Show the selected emergency target beside its recommended minimum: canonical 40,500 THB, based on average protected monthly outflow 13,500 (12,000 essentials + 1,500 required obligations + zero Essential subscriptions). Actual coverage is 1.33 months and proposed recovery is 3,750. Show active goal deadlines and contributions. Dated goals with no allocation remain visible with a consequence.
5. Confirm the exact reviewed version. Display “Commitment saved. No money was moved,” confirmation time and planned-versus-realized progress. Reload/restart retains the commitment.

## Activity and classification

Activity offers optional category/subcategory correction and a “remember for similar activity” control. Known rules are shown with provenance and remain editable. A meaningful unknown incoming transaction asks Income / Transfer / Refund / Other. While unresolved, show the receipt but exclude it from money available to allocate. Resolving it refreshes metrics and offers one recalculation prompt if material.

Large ambiguous expenses ask “Was this an emergency?” with Yes / No / Decide later. The expense already reduces cash. Decide later leaves the uncertainty visible; the app cannot confirm a proposal whose recommendation depends materially on the unanswered classification. Ordinary banking views remain usable.

## Subscriptions and saving without a goal

Subscription Manager lists services, billing frequency, next known dates, monthly commitments and actual spending trends. Record/edit a service or review a suggested recurring series. Essential / Keep / Consider Cancelling labels express preferences. Reporting a service ended records a fact about external cancellation; no provider action is claimed.

Only Essential-labelled subscriptions enter emergency coverage costs. The canonical two Keep services still count toward normal cost and unpaid bills; they do not increase the emergency denominator.

Goals view has General Savings as a distinct balance without required title/date/target. Users can add a named goal, change its target/date, set optional importance, or pause it. Show feasibility and an explained order, not a hidden priority score. Empty goal lists still lead to an emergency/general-saving recommendation. Preserve money from paused goals; pausing is not an automatic withdrawal.

## Adjust, preview, confirm

Editable fields are remaining contributions and optional input preferences in their own forms. Required unpaid costs are visible protected inputs, not sliders inside the plan. Correct a wrong bill/classification through its source record; do not erase a real obligation to make a plan pass.

On amount edit, mark the view “Unsaved adjustment” and disable Confirm until the preview succeeds. Backend receives the base plan/version/state token and changed destinations; it recalculates unallocated money, validates current cash and returns a new immutable preview version, reasons and timeline consequences. Show field errors without discarding the user's input.

Normal and Serious both allow reductions to zero. For Serious, show the old reviewed/committed amount versus the new amount, identify the Serious contribution being changed, and show its concrete consequence: updated conditional goal completion, projected emergency coverage or projected undated saving balance as applicable. This applies even before the first confirmation; an earlier confirmed commitment is optional evidence. Use only the ordinary explicit plan confirmation, with no additional or repeated “are you sure?” dialogs solely because of Serious. Lowering the emergency target below the recommendation shows coverage consequences without blocking. Returning to the original recommendation requires an explicit reset/recalculate action; no hidden edits.

Confirm sends exactly the version currently displayed. Double-click/retry uses the same idempotency key. If state changed, show a conflict, retain edits locally, reload the current facts and request a new preview. Never replace an adjusted preview with a newly generated default during confirmation.

## Financial shock (Scenario B)

Start with A's confirmed commitment and unchanged realized contributions. Load the deterministic synthetic emergency event (local fixture operation), or mark its posted expense as emergency. Show how much was actually paid from the emergency balance and spending cash. Flow Sync does not execute the payment.

Show required upcoming costs still protected, reduced cash, depleted emergency coverage, the recovery contribution, and smaller/deferred goal contributions. Compare old and proposed plans with reasons and conditional completion dates. The old commitment is labelled affected/infeasible; it remains recorded until the user explicitly confirms the revision. Declining leaves history intact, with the changed financial situation still visible.

Canonical B stays Normal: emergency recovery 6,750, laptop 2,250, moving/General Savings/unallocated zero from 9,000 available. Laptop completion conditionally moves December 2026 → May 2027. If a destination is Serious, preserve it after required cash and recovery, reducing Normal goals/residual savings first. If it still cannot be funded, show the shortfall and consequence. [Demo §8](DEMO_SCENARIO.md#8-non-canonical-serious-acceptance-examples) provides separate first-period and infeasible Serious variants; none silently replace a confirmed plan.

## Extra income (Scenario C, stretch)

Start from A independently of B. The new receipt appears as unknown; the current confirmed commitment remains. The user confirms irregular income and its known net-tax treatment. Recalculate against the current emergency gap, existing goals, history and actual cash. Show why the one-off amount does not become a recurring promise. Review and confirm as usual.

## Recalculation and performance

Manual Recalculate is available while enabled. New month, salary, emergency use and material goal/obligation/subscription changes offer review according to [Financial rules](FINANCIAL_RULES.md). Small transactions update metrics quietly. All replacement proposals need confirmation, even when auto-generated.

Money overview shows actual, expected and planned values separately, with comparable historical trends. Confirmation changes intended progress only. History is accessible within Flow Sync; select a version to see the original assumptions/reasons and whether it was superseded.

## Required failure and empty states

| State | Required behavior |
| --- | --- |
| Loading | Show a labelled loading state, no stale values presented as current |
| No goals | Offer General Savings and optional Add goal; no index-zero assumption |
| No subscriptions/history | Honest empty/limited-history state; planning follows documented fallback |
| No income | Show actual carried cash and provisional assumptions; no fabricated salary |
| Cash shortfall | Itemize required costs and shortfall; no confirmable savings plan |
| Material unknown | Explain the one relevant classification needed; preserve other browsing |
| Invalid adjustment | Inline error with available amount and affected field; previous commitment intact |
| API unavailable | Retry; cached/old commitment explicitly labelled historical/unavailable for confirmation |
| Stale preview/competing confirmation | Refresh and review again, preserve unsaved edits visibly |
| Confirmation persistence failure | No success state; retry idempotently, balances unchanged |
| Flow Sync disabled | No prompts/new proposals; saved history remains readable |

Keyboard labels, focus after validation, readable money formatting and 375px navigation are part of acceptance. Preserve the Phase 1 visual system. Hide or label unrelated no-op banking controls; do not simulate real account creation or transfers.
