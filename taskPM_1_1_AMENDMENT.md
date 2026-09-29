# PM-1.1 Amendment Task --- Emergency Coverage + Serious Constraint Semantics

## Objective

Apply a small documentation-only amendment to the frozen PM-1
specification. Do not redesign Flow Sync, begin Phase 2 implementation,
commit, or push.

This amendment changes only:

1.  the Emergency Fund coverage/target denominator; and
2.  the meaning and strength of `Serious` constraint mode.

Read `AGENTS.md`, `taskPM_MASTER.md`, and the complete PM-1 document set
before editing. Propagate every affected value, example, API example,
integration handoff, and acceptance expectation.

## 1. Emergency Fund amendment

Replace the PM-1 emergency coverage denominator with:

``` text
Protected Monthly Outflow
=
Essential Expenses
+ Required Financial Obligations
+ Essential Subscriptions
```

The intent is to cover unavoidable monthly outflows that may continue
during loss of income or a financial shock.

Do not include flexible spending, non-essential subscriptions,
savings/goal contributions, transfers, one-off emergency expenses,
already-withheld tax, or optional purchases.

Applicable explicit tax obligations remain governed by the existing
tax/upcoming-obligation policy. Do not turn MVP into a tax engine.

Recommended minimum:

``` text
Recommended Emergency Minimum
=
Emergency Multiplier × Average Protected Monthly Outflow
```

Default multiplier remains 3 months. Use the existing history/fallback
policy.

The user may select a target above or below the recommendation. A lower
target produces a warning/consequence, never a block.

Emergency Fund remains separate from Goals.

## 2. Canonical demo impact

Current canonical monthly values are:

``` text
Essential Expenses                 12,000 THB
Required Financial Obligation       1,500 THB
Subscriptions                         600 THB
Flexible                               900 THB
Total Normal Cost                  15,000 THB
```

The two current subscriptions are `Keep`, not `Essential`, unless
another authoritative PM document explicitly says otherwise.

Therefore PM-1.1 canonical protected monthly outflow is:

``` text
12,000 + 1,500 = 13,500 THB
```

and:

``` text
Recommended Emergency Minimum
= 13,500 × 3
= 40,500 THB
```

Only subscriptions explicitly labelled `Essential` enter the emergency
denominator.

Recalculate every affected downstream value, including emergency
gap/coverage/recovery, Scenario A/B/C allocations, projected balances,
planned rates if affected, unallocated amounts, structured reason facts,
API examples, and acceptance expectations.

Do not preserve old output amounts when the amended rule mathematically
changes them. All arithmetic must reconcile.

## 3. Serious means stronger constraint

`Serious` must have meaningful effect from the moment the user selects
it. It must not require a prior confirmed commitment before it matters.

Conceptually:

``` text
Normal
→ adaptive default
→ recommendation changes more freely with current state

Serious
→ stronger commitment constraint
→ stronger protection for the selected saving/goal contribution
→ lower-priority allocations absorb reductions first
→ clearer consequences when deviating
→ still fully user-overridable
```

Serious is a stronger constraint, not a money lock.

Never prevent access to money, impose penalties/fees, silently move
money, silently confirm plans, treat missed commitments as debt, or use
punishment/guilt language.

## 4. Constraint ordering

Higher-level financial protection still comes first:

``` text
Required obligations / protected cash
        ↓
Emergency Fund recovery
        ↓
Serious Goals / Serious saving commitments
        ↓
Normal Goals
        ↓
General Savings / lower-priority flexible saving
        ↓
Unallocated money
```

A Serious goal receives stronger protection even in its first planning
period.

Within Serious goals use deterministic factors already supported by
PM-1, such as:

1.  user importance
2.  deadline urgency
3.  remaining target gap
4.  existing commitment when one exists
5.  stable ID tie-breaker

An existing commitment strengthens continuity but is not the
prerequisite for Serious behavior.

Avoid opaque weighted scoring.

## 5. Constraint strength

Keep the two public MVP modes:

``` text
Normal
Serious
```

Do not invent extra public levels in this amendment.

### Normal

-   adapts more freely as financial conditions change;
-   recalculates from current state;
-   explains reductions;
-   remains user-overridable.

### Serious

-   protects the selected goal/saving contribution more strongly;
-   places Serious destinations ahead of comparable Normal destinations
    after higher-level protections;
-   attempts to preserve the required/committed contribution when
    feasible;
-   pushes reductions first toward lower-priority Normal goals, General
    Savings, and discretionary/unallocated capacity where appropriate;
-   if the Serious contribution itself becomes infeasible, reduces it
    only after higher-level protections and explains the
    shortfall/consequence;
-   uses an existing confirmed commitment as an additional continuity
    constraint;
-   remains user-overridable.

Serious remains subordinate to actual available cash, required
obligations, essential/upcoming protected cash, cash buffer, material
unresolved uncertainty, and Emergency Fund recovery.

Never manufacture capacity to satisfy Serious mode.

## 6. Serious override UX

Do not make stronger constraint mean annoying UX.

When a user manually reduces a Serious contribution:

-   allow it;
-   show old vs new contribution;
-   show the concrete consequence;
-   update conditional completion timing/coverage;
-   clearly indicate that a Serious commitment is being changed;
-   require only the normal explicit plan confirmation.

Do not add repeated "are you sure?" dialogs solely because the mode is
Serious.

Constraint strength belongs primarily in recommendation/allocation
behavior, not repeated questioning.

## 7. Serious during financial shock

During a shock:

1.  protect required cash/obligations;
2.  apply Emergency Fund recovery;
3.  preserve Serious commitments as far as feasible capacity allows;
4.  reduce/defer lower-priority Normal goals and General Savings first;
5.  if Serious itself must be reduced, explain why and show the
    consequence;
6.  never silently replace the confirmed plan.

If the canonical Scenario B has only Normal goals, keep it that way if
useful. Add a small non-canonical Serious example instead of distorting
the main demo merely to prove the rule.

## 8. General Savings

General Savings remains valid without a target, date, or description.

If the current model supports only global mode plus per-goal override,
keep General Savings aligned with global mode unless an authoritative PM
document already defines a destination-specific override.

Do not expand the schema only for this amendment unless necessary.

## 9. Documents to inspect/update

At minimum:

-   `docs/PRODUCT_SPEC.md`
-   `docs/FINANCIAL_RULES.md`
-   `docs/DEMO_SCENARIO.md`
-   `docs/API_CONTRACT.md`
-   `docs/INTEGRATION_PLAN.md`
-   `docs/USER_JOURNEY.md`
-   `docs/FINANCIAL_PERFORMANCE.md`
-   `docs/SUBSCRIPTION_MANAGER.md`
-   README / implementation status where affected

Move displayed target-contract/spec version from PM-1 to `PM-1.1`
consistently where appropriate.

Do not edit unaffected files merely to touch them.

## 10. API/data compatibility review

Prefer preserving PM-1 shapes.

Expected likely result:

-   Emergency values/reasons change, existing fields remain sufficient.
-   `Mode = normal|serious` remains sufficient.
-   `Goal.mode_override` remains sufficient.
-   Reason facts may need clarification.
-   No new public constraint-level enum is required.

If a schema change is truly necessary, make the smallest target-contract
change and explain why. Do not redesign the API.

## 11. Handoff impact

Data must understand:

-   required financial obligations now contribute to protected monthly
    outflow;
-   only Essential-labelled subscriptions contribute to that emergency
    denominator;
-   storage/history must preserve enough evidence to reproduce the
    calculation.

Frontend+Backend must understand:

-   Serious has first-period behavior;
-   Serious is a stronger recommendation constraint;
-   an existing commitment further strengthens continuity;
-   Serious remains overridable;
-   reductions require structured consequences;
-   no extra repeated confirmation flow is required.

## 12. Verification

Before finishing:

1.  Recalculate every canonical equation affected by the new emergency
    target.
2.  Verify account conservation is unchanged.
3.  Verify allocations never exceed allocatable cash.
4.  Verify Scenario A/B/C tables reconcile.
5.  Verify emergency coverage uses the new denominator consistently.
6.  Verify Essential subscription treatment is consistent across
    documents.
7.  Verify Serious affects a first-period goal.
8.  Verify Serious never outranks required protection or Emergency
    recovery.
9.  Verify Serious remains overridable.
10. Verify no document says Serious requires prior commitment to have
    priority.
11. Verify no stale PM-1 emergency target of 36,000 remains where PM-1.1
    should use 40,500.
12. Verify API examples and acceptance expectations match amended
    canonical values.
13. Run `git diff --check`.
14. Inspect for accidental secrets/branding.
15. Do not commit or push.

Application tests do not need to run if this remains documentation-only.

## 13. Final report

Return:

### PM-1.1 Changes

### Emergency Fund

### Serious Constraint

### Contract Impact

### Demo Impact

### Files Updated

### Verification

### Parallel Start Decision

State whether Data and Frontend+Backend remain safe to begin in
parallel.

Stop after the PM-1.1 documentation amendment.

Do not implement Phase 2. Do not commit or push.
