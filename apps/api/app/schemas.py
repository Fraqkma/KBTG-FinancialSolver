from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel, Field


class Account(BaseModel):
    id: str
    name: str
    kind: str
    account_mask: str
    balance: int
    accent: str


class Transaction(BaseModel):
    id: str
    account_id: str
    amount: int
    transaction_type: str
    category: str
    description: str
    timestamp: datetime
    recurring: bool = False


class Goal(BaseModel):
    id: str
    name: str
    target_amount: int
    current_amount: int
    target_date: date
    priority: str
    status: str


class FinancialProfile(BaseModel):
    period: str
    emergency_account_id: str
    reserve_target: int = Field(ge=0)


class FinancialState(BaseModel):
    period: str
    monthly_income: int
    essential_expenses: int
    discretionary_spending: int
    current_balance: int
    emergency_reserve: int
    reserve_target: int
    available_for_plan: int
    constraints: list[str]


class AllocationItem(BaseModel):
    category: str
    amount: int = Field(ge=0)
    reason: str
    priority: int


class PlanStatus(str, Enum):
    proposed = "proposed"
    accepted = "accepted"


class AllocationPlan(BaseModel):
    id: str
    income_period: str
    available_income: int = Field(ge=0)
    allocations: list[AllocationItem]
    unallocated: int = Field(ge=0)
    status: PlanStatus = PlanStatus.proposed
    explanation: str
    created_at: datetime


class PlanConfirmation(BaseModel):
    accepted: bool
    message: str
    plan: AllocationPlan


class PlanConfirmationRequest(BaseModel):
    plan_id: str
