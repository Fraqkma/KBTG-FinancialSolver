import pytest
from app.finance import (
    InvalidFinancialState,
    build_financial_state,
    generate_allocation_plan,
)
from app.schemas import FinancialState


def test_mock_plan_respects_available_money_and_nonnegative_allocations():
    state = build_financial_state()
    plan = generate_allocation_plan(state)
    assert state.monthly_income == 32000
    assert state.essential_expenses == 12600
    assert state.discretionary_spending == 6400
    assert state.current_balance == 52480
    assert state.emergency_reserve == 18500
    assert state.available_for_plan == 13000
    assert sum(item.amount for item in plan.allocations) <= plan.available_income
    assert all(item.amount >= 0 for item in plan.allocations)
    assert plan.allocations[0].category == "Emergency reserve"


def test_invalid_financial_state_is_rejected():
    state = FinancialState(
        period="test",
        monthly_income=10,
        essential_expenses=11,
        discretionary_spending=0,
        current_balance=0,
        emergency_reserve=0,
        reserve_target=20,
        available_for_plan=1,
        constraints=[],
    )
    with pytest.raises(InvalidFinancialState):
        generate_allocation_plan(state)


def test_spending_that_exceeds_the_monthly_budget_is_rejected():
    state = build_financial_state()
    state.discretionary_spending = state.monthly_income
    with pytest.raises(InvalidFinancialState):
        generate_allocation_plan(state)
