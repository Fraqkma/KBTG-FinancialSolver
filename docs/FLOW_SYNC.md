# Flow Sync product flow

Flow Sync is a financial decision-support layer inside a fictional banking environment. It helps the user inspect their situation, understand why a proposed allocation exists, and decide what to do.

## Phase 1 journey

1. A synthetic monthly salary appears in Activity and the dashboard payday card.
2. The dashboard invites the user to open Flow Sync.
3. Financial state shows income, essential commitments, prior flexible spending, current reserve and selected reserve target.
4. The plan shows the remaining amount and deterministic suggestions with reasons.
5. The user can review or accept the suggestion. Acceptance is a local demo status only.

## Inputs and policy

Inputs are defined in `apps/api/app/mock_data.py`; the typed financial state and allocation output are in `schemas.py`. The plan starts with income left after essentials and already recorded discretionary spending. It directs money to the emergency reserve up to the smaller of the reserve gap, remaining amount and 25% of monthly income. Any remaining available amount goes toward the laptop goal, capped at the goal gap. Further remainder stays flexible. The policy is intentionally small and replaceable, not presented as an optimized personal financial recommendation.

Validation requires non-negative financial amounts, positive income, essential expenses at or below income, and available-to-plan at or below income after essentials. The generated output is checked so allocations are non-negative and their sum does not exceed available income.

## Limitations and next decisions

One static fictional profile is used. There is no user adjustment form, recurring-expense detection, debt model, household profile, goal feasibility timeline, persistence, or personalized risk preference. Review these domain choices with the product journey before replacing the demo policy with a full allocation engine.
