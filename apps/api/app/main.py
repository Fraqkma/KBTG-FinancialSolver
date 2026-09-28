import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .finance import (
    InvalidFinancialState,
    build_financial_state,
    generate_allocation_plan,
)
from .repository import MockFinanceRepository
from .schemas import (
    Account,
    AllocationPlan,
    FinancialState,
    Goal,
    PlanConfirmation,
    PlanConfirmationRequest,
    PlanStatus,
    Transaction,
)

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s"
)
logger = logging.getLogger("flow_sync")
app = FastAPI(
    title="Flow Sync Demo API",
    version="0.1.0",
    description="Fictional financial decision-support prototype",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
repository = MockFinanceRepository()
accepted_plans: set[str] = set()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "mode": "fictional-demo"}


@app.get("/api/accounts")
def accounts() -> list[Account]:
    return repository.accounts()


@app.get("/api/transactions")
def transactions() -> list[Transaction]:
    return repository.transactions()


@app.get("/api/goals")
def goals() -> list[Goal]:
    return repository.goals()


@app.get("/api/financial-state", response_model=FinancialState)
def financial_state() -> FinancialState:
    return build_financial_state()


@app.get("/api/flow-sync/plan", response_model=AllocationPlan)
def flow_sync_plan() -> AllocationPlan:
    try:
        plan = generate_allocation_plan(build_financial_state())
        if plan.id in accepted_plans:
            plan.status = PlanStatus.accepted
        return plan
    except InvalidFinancialState as error:
        logger.warning("Plan generation rejected an invalid financial state")
        raise HTTPException(status_code=422, detail=str(error)) from error


@app.post("/api/flow-sync/preview", response_model=AllocationPlan)
def preview_plan(state: FinancialState) -> AllocationPlan:
    try:
        return generate_allocation_plan(state)
    except InvalidFinancialState as error:
        logger.warning("Plan preview rejected an invalid financial state")
        raise HTTPException(status_code=422, detail=str(error)) from error


@app.post("/api/flow-sync/confirm", response_model=PlanConfirmation)
def confirm_plan(request: PlanConfirmationRequest) -> PlanConfirmation:
    plan = flow_sync_plan()
    if request.plan_id != plan.id:
        raise HTTPException(
            status_code=404, detail="This demo plan is no longer available."
        )
    plan.status = PlanStatus.accepted
    accepted_plans.add(request.plan_id)
    return PlanConfirmation(
        accepted=True,
        message="Plan accepted in this demo. No money was moved.",
        plan=plan,
    )
