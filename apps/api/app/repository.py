"""Deterministic mock repository; replace this adapter when persistence is designed."""

from .mock_data import ACCOUNTS, GOALS, TRANSACTIONS
from .schemas import Account, Goal, Transaction


class MockFinanceRepository:
    def accounts(self) -> list[Account]:
        return [item.model_copy(deep=True) for item in ACCOUNTS]

    def transactions(self) -> list[Transaction]:
        return [item.model_copy(deep=True) for item in TRANSACTIONS]

    def goals(self) -> list[Goal]:
        return [item.model_copy(deep=True) for item in GOALS]
