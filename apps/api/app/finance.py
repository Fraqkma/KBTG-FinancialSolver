from datetime import datetime, timezone

from .mock_data import ACCOUNTS, FINANCIAL_PROFILE, GOALS, TRANSACTIONS
from .schemas import AllocationItem, AllocationPlan, FinancialState


class InvalidFinancialState(ValueError):
    pass


def build_financial_state() -> FinancialState:
    period_transactions = [
        transaction
        for transaction in TRANSACTIONS
        if transaction.timestamp.strftime("%B %Y") == FINANCIAL_PROFILE.period
    ]
    monthly_income = sum(
        transaction.amount
        for transaction in period_transactions
        if transaction.transaction_type == "income"
    )
    essential_categories = {"Home", "Utilities", "Transport", "Insurance"}
    expenses = [
        transaction
        for transaction in period_transactions
        if transaction.transaction_type == "expense"
    ]
    essential_expenses = sum(
        abs(transaction.amount)
        for transaction in expenses
        if transaction.category in essential_categories
    )
    discretionary_spending = sum(
        abs(transaction.amount)
        for transaction in expenses
        if transaction.category not in essential_categories
    )
    emergency_account = next(
        (
            account
            for account in ACCOUNTS
            if account.id == FINANCIAL_PROFILE.emergency_account_id
        ),
        None,
    )
    if emergency_account is None:
        raise InvalidFinancialState("The emergency reserve account is unavailable.")
    available_for_plan = max(
        0, monthly_income - essential_expenses - discretionary_spending
    )
    return FinancialState(
        period=FINANCIAL_PROFILE.period,
        monthly_income=monthly_income,
        essential_expenses=essential_expenses,
        discretionary_spending=discretionary_spending,
        current_balance=sum(account.balance for account in ACCOUNTS),
        emergency_reserve=emergency_account.balance,
        reserve_target=FINANCIAL_PROFILE.reserve_target,
        available_for_plan=available_for_plan,
        constraints=[
            "Set aside rent and recurring bills first",
            "Build the emergency reserve gradually",
            "Keep the monthly plan within available income",
        ],
    )


def validate_financial_state(state: FinancialState) -> None:
    amounts = (
        state.monthly_income,
        state.essential_expenses,
        state.discretionary_spending,
        state.current_balance,
        state.emergency_reserve,
        state.reserve_target,
        state.available_for_plan,
    )
    if any(value < 0 for value in amounts) or state.monthly_income <= 0:
        raise InvalidFinancialState(
            "Financial amounts must be non-negative and income must be positive."
        )
    if state.essential_expenses > state.monthly_income:
        raise InvalidFinancialState("Essential expenses exceed monthly income.")
    if state.discretionary_spending > state.monthly_income - state.essential_expenses:
        raise InvalidFinancialState(
            "Discretionary spending exceeds income after essential expenses."
        )
    if state.available_for_plan > state.monthly_income - state.essential_expenses:
        raise InvalidFinancialState(
            "Available amount exceeds income after essential expenses."
        )


def generate_allocation_plan(state: FinancialState) -> AllocationPlan:
    validate_financial_state(state)
    remaining = state.available_for_plan
    reserve_gap = max(0, state.reserve_target - state.emergency_reserve)
    reserve = min(remaining, reserve_gap, state.monthly_income // 4)
    remaining -= reserve
    goal_gap = max(0, GOALS[0].target_amount - GOALS[0].current_amount)
    goal = min(remaining, goal_gap)
    remaining -= goal
    allocations = [
        AllocationItem(
            category="Emergency reserve",
            amount=reserve,
            reason="Your reserve is below its selected target.",
            priority=1,
        ),
        AllocationItem(
            category="Laptop goal",
            amount=goal,
            reason="Moves your active goal forward with the amount left.",
            priority=2,
        ),
    ]
    if sum(item.amount for item in allocations) > state.available_for_plan:
        raise InvalidFinancialState("The resulting plan violates allocation limits.")
    return AllocationPlan(
        id=f"flow-sync-{state.period.lower().replace(' ', '-')}",
        income_period=state.period,
        available_income=state.available_for_plan,
        allocations=allocations,
        unallocated=remaining,
        explanation=(
            "Essential commitments are already protected. Remaining available "
            "money supports your reserve, then your active goal."
        ),
        created_at=datetime.now(timezone.utc),
    )
