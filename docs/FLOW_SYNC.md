# Flow Sync — product entry point

Flow Sync is a financial decision-support layer inside a fictional banking environment. It helps the user inspect their situation, understand why a proposed allocation exists, and decide what to do.

**Current specification: PM-1.1.** [Product specification](PRODUCT_SPEC.md) owns MVP scope, [User journey](USER_JOURNEY.md) owns user behavior and [Financial rules](FINANCIAL_RULES.md) owns calculation semantics. The following Phase 1 description documents code that still runs; it is not final policy.

## Phase 1 journey

1. A synthetic monthly salary appears in Activity and the dashboard payday card.
2. The dashboard invites the user to open Flow Sync.
3. Financial state shows income, essential commitments, prior flexible spending, current reserve and selected reserve target.
4. The plan shows the remaining amount and deterministic suggestions with reasons.
5. The user can review or accept the suggestion. Acceptance is a local demo status only.

## Phase 1 inputs and placeholder policy

Inputs are defined in `apps/api/app/mock_data.py`; the typed financial state and allocation output are in `schemas.py`. The plan starts with income left after essentials and already recorded discretionary spending. It directs money to the emergency reserve up to the smaller of the reserve gap, remaining amount and 25% of monthly income. Any remaining available amount goes toward the laptop goal, capped at the goal gap. Further remainder stays flexible. The policy is intentionally small and replaceable, not presented as an optimized personal financial recommendation.

Validation requires non-negative financial amounts, positive income, essential expenses at or below income, and available-to-plan at or below income after essentials. The generated output is checked so allocations are non-negative and their sum does not exceed available income.

## Current runtime limitations

One static fictional profile is used. There is no user adjustment form, recurring-expense detection, debt model, goal feasibility timeline or persistence. The PM pass now defines the next implementation; no further product discovery is required to start its agreed scope.

## Approved target flow

An optional monthly decision layer connects Emergency Fund, General Savings/Goals, transaction analysis and Subscription Manager. Structured source facts build Financial State; required upcoming costs and available cash constrain recommendations; history and needs determine saving contributions. Structured reasons explain amounts, priorities, changed conditions and conditional timelines.

PM-1.1 emergency coverage uses average protected monthly outflow: essentials + required obligations + Essential-labelled subscriptions. The canonical average is 13,500 THB and three-month recommendation 40,500. Serious gives first-period saving/goal requests priority after required cash and emergency recovery; existing commitments add continuity. Users may reduce these contributions with explained consequences and only the normal explicit confirmation.

Users can review, adjust and preview amounts. Confirm creates a persistent, reproducible commitment for tracking; it never moves or locks money. Changes in financial circumstances produce a separate proposal requiring explicit review. Actual progress comes from observed synthetic funding records, not confirmation.

Use [Canonical demo](DEMO_SCENARIO.md) for the exact normal/shock/extra-income story, [API contract](API_CONTRACT.md) for typed interfaces and [Integration plan](INTEGRATION_PLAN.md) for implementation ownership and acceptance. Real transfers, provider cancellations, tax engines and external AI remain deferred.
