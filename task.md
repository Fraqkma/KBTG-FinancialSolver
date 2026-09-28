# Flow Sync — Adaptive Financial Sorter
## Initial Infrastructure & Banking Prototype Task

You are the lead software engineer responsible for bootstrapping a hackathon prototype called:

# Adaptive Financial Sorter
## Internal Product Name: Flow Sync

Flow Sync is a personal financial decision-support system designed primarily for young working adults / first-jobbers.

The long-term concept is broader than simply splitting salary into fixed percentages.

The system should eventually be able to:

- understand a user's current financial state,
- collect and organize financial information,
- identify recurring financial commitments,
- understand short- and long-term financial goals,
- apply financial rules and constraints,
- help determine how newly received income should be allocated,
- provide understandable financial recommendations,
- adapt recommendations when the user's situation changes,
- and integrate naturally into an existing digital banking experience.

For this first development phase, DO NOT try to fully implement the financial allocation engine yet.

The main goal is:

1. Build a believable but fictional digital banking frontend prototype.
2. Use that prototype to visualize where Flow Sync fits into the banking experience.
3. Establish a clean software architecture that can later support the real Flow Sync financial engine.
4. Prepare testing, security, configuration, and development infrastructure from the beginning.
5. Produce enough mock financial data and flows that we can later design the decision engine based on realistic use cases.

---

# IMPORTANT COMPETITION RULES

These rules are mandatory and should be treated as project-level constraints.

## Rule 1 — Do not use real organization names or branding

DO NOT use:

- KBank
- KBTG
- Kasikornbank / ธนาคารกสิกรไทย
- their logos
- their trademarks
- screenshots from their applications
- copied icons
- copied layouts that are clearly identifiable as their official application
- brand-specific wording
- visual elements that could make users think this is an official bank product

The application must be presented as a:

> Fictional Banking Prototype / Hackathon Demo

Do not clone a real bank application pixel-for-pixel.

Instead, create an original digital banking UI based on common banking UX patterns.

Use generic terminology such as:

- Main Account
- Savings
- Wallet
- Goals
- Transactions
- Transfer
- Payments
- Financial Overview

A small visible label such as:

> Prototype Demo

should appear somewhere appropriate in the application.

---

# VISUAL DIRECTION

Primary visual identity:

- Primary color: RED
- Supporting tones: white, dark charcoal, neutral gray
- Use red carefully as an accent and key-action color rather than making every surface red.
- Clean modern financial application.
- Professional but approachable.
- Suitable for users around age 22–30.
- Avoid looking like a direct copy of any Thai banking application.

The interface should feel like:

- modern mobile banking,
- fintech,
- simple enough for first-time financial planners,
- clear financial hierarchy,
- easy to understand without financial expertise.

Responsive design is required.

Desktop should display the prototype elegantly, but the main banking UI should feel mobile-first.

Do not overuse gradients, glassmorphism, excessive animations, neon effects, or generic AI-style visual design.

Favor:

- strong information hierarchy,
- spacing,
- readable typography,
- cards used only when useful,
- simple charts,
- clear interaction states.

---

# FIRST PHASE OBJECTIVE

Before implementing sophisticated financial logic, create the surrounding banking environment.

We want to answer:

> "If Flow Sync existed inside a digital banking app, where would users encounter it, what would it know, and what actions could it take?"

Create a realistic user journey from:

1. opening the banking application,
2. viewing financial status,
3. receiving salary,
4. reviewing recent transactions,
5. checking goals and commitments,
6. entering Flow Sync,
7. receiving an allocation recommendation,
8. understanding why the recommendation was generated,
9. optionally accepting or modifying the recommendation.

At this stage, recommendation calculations can use deterministic mock logic.

The architecture, however, should allow the mock logic to later be replaced with the real financial decision engine.

---

# PRODUCT STRUCTURE

The prototype should contain at least the following areas.

## 1. Banking Home

Main dashboard.

Show:

- greeting
- total available balance
- primary account
- recent salary deposit
- recent expenses
- quick actions
- spending snapshot
- savings / goals progress
- Flow Sync entry point

Important:

Flow Sync should feel integrated into the financial experience rather than appearing as a completely separate application.

Example Flow Sync entry:

> Your salary was received.
> Flow Sync has prepared this month's financial plan.

CTA:

> Review plan

Do not use this exact copy if better wording fits the UI.

---

## 2. Accounts

Allow the user to view mock accounts such as:

- Main Spending Account
- Emergency Savings
- Goal Savings
- Optional Wallet

Show:

- balance
- account type
- recent activity

Use fake account identifiers only.

Never use realistic personal information.

---

## 3. Transactions

Create a realistic mock transaction history.

Include examples such as:

Income:
- Salary
- Freelance income

Expenses:
- Rent
- Transportation
- Food
- Utilities
- Subscription
- Entertainment
- Shopping

Some transactions should be marked recurring.

Transaction data should later be usable by Flow Sync.

Build transaction models cleanly instead of hardcoding everything directly into UI components.

---

## 4. Financial Overview

Create a financial overview page showing:

- monthly income
- monthly spending
- essential expenses
- discretionary expenses
- savings
- available balance
- emergency reserve
- goal progress

This page represents the financial state that Flow Sync will consume.

Do not position this as AI prediction.

At this stage it is primarily:

> Financial state derived from structured financial data.

---

## 5. Financial Goals

Users should be able to view mock goals.

Examples:

- Emergency Fund
- New Laptop
- Travel
- Professional Course
- Future Investment

Each goal should contain:

- target amount
- current amount
- target date
- progress
- priority

Keep this extensible.

---

# FLOW SYNC

Flow Sync is the main prototype feature.

Create a dedicated Flow Sync section.

The user should be able to understand:

1. current financial state,
2. what constraints exist,
3. how much money is available,
4. suggested allocation,
5. why the allocation was suggested,
6. how the plan differs from a fixed-percentage budget.

---

# FLOW SYNC DASHBOARD

Suggested content:

## Current Financial State

Example:

Monthly income:
30,000 THB

Essential monthly expenses:
13,500 THB

Available emergency reserve:
8,000 THB

Emergency reserve target:
30,000 THB

Active goal:
Laptop — 18,000 / 35,000 THB

Remaining flexible cash:
calculated value

---

## This Month's Plan

Display suggested allocations such as:

- Essential expenses
- Daily spending
- Emergency reserve
- Goal contribution
- Flexible spending

This is NOT intended to become a rigid fixed-percentage budgeting system.

The explanation should clearly show that values can change depending on:

- income,
- expenses,
- reserve level,
- goals,
- financial obligations.

---

## Why this plan?

Create a simple explanation area.

Example concepts:

- Essential expenses are protected first.
- Your emergency reserve is below your preferred threshold.
- Your active goal remains achievable at the current contribution.
- Flexible spending was adjusted based on remaining available income.

Do not pretend the system has machine learning if it does not.

The first implementation should use explicit deterministic rules.

---

# FINANCIAL ALLOCATION ENGINE — PLACEHOLDER DESIGN

Do not fully optimize this yet.

However, establish a clean domain layer.

Conceptually:

Financial Data
    ↓
Financial State
    ↓
Rules / Constraints
    ↓
Allocation Engine
    ↓
Validation
    ↓
Recommendation
    ↓
User Review

The allocation engine should NOT live inside React UI components.

Create a clear abstraction/interface so we can replace the mock implementation later.

Potential domain concepts:

- FinancialProfile
- FinancialState
- Income
- Expense
- RecurringExpense
- Goal
- FinancialConstraint
- AllocationPlan
- AllocationItem
- Recommendation
- RecommendationReason

Example constraints:

- allocated money must not exceed available income
- essential expenses must be protected
- minimum reserve should be considered
- negative allocations are impossible
- values must be internally consistent

Keep the first algorithm intentionally simple.

Do not prematurely build AI/ML systems.

---

# RECOMMENDED SYSTEM ARCHITECTURE

Use a modular repository that can evolve into a production-style application.

Preferred structure:

/
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── shared/
│   └── config/
│
├── docs/
├── infra/
├── scripts/
├── .github/
├── .env.example
├── docker-compose.yml
├── README.md
├── AGENTS.md
└── task.md

Adjust structure if the selected frameworks have a better convention, but preserve clear separation of concerns.

---

# FRONTEND

Preferred stack:

- React
- TypeScript
- Vite
- Tailwind CSS
- a lightweight accessible component system if useful
- React Router
- TanStack Query only when actual API calls justify it

Do not install large libraries without a clear reason.

Use reusable components.

Suggested frontend structure:

apps/web/src/

├── app/
├── components/
│   ├── banking/
│   ├── flow-sync/
│   ├── charts/
│   └── common/
├── pages/
├── features/
│   ├── accounts/
│   ├── transactions/
│   ├── goals/
│   ├── financial-overview/
│   └── flow-sync/
├── services/
├── hooks/
├── types/
├── utils/
└── test/

Avoid putting the entire application into App.tsx.

---

# BACKEND

Preferred stack:

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- Alembic

Use SQLite for local prototype development if that makes setup easier.

Keep configuration compatible with PostgreSQL for later use.

Do not overbuild microservices.

Use a modular monolith for the hackathon.

Suggested modules:

api/
├── core/
├── accounts/
├── transactions/
├── goals/
├── finance/
├── flow_sync/
├── db/
└── tests/

---

# INITIAL API DESIGN

Create API contracts for at least:

GET /health

GET /api/accounts

GET /api/transactions

GET /api/goals

GET /api/financial-state

GET /api/flow-sync/plan

POST /api/flow-sync/preview

POST /api/flow-sync/confirm

Do not perform real transfers.

`confirm` should only simulate acceptance of a plan.

The prototype must never connect to a real banking system.

---

# MOCK DATA

Create a believable fictional user.

Do not use real personal information.

Example profile:

Age:
24

Employment:
Junior Software Engineer

Monthly salary:
30,000–35,000 THB

Typical financial commitments:

- rent
- electricity
- internet
- transportation
- food
- subscriptions

Include:

- recent salary deposit
- 1–2 goals
- incomplete emergency reserve
- realistic transaction history

The data should tell a story.

For example:

The user recently received their salary but has:

- mandatory rent payment,
- limited emergency savings,
- an active laptop savings goal,
- normal discretionary spending.

This creates a useful Flow Sync demonstration scenario.

---

# DATA MODEL

Create proper schemas/models rather than storing arbitrary objects.

At minimum define:

User
Account
Transaction
FinancialGoal
FinancialProfile
FinancialState
AllocationPlan
AllocationItem

Transaction should support:

- id
- account_id
- amount
- transaction_type
- category
- merchant / description
- timestamp
- recurring flag

Goal should support:

- id
- name
- target_amount
- current_amount
- target_date
- priority
- status

AllocationPlan should support:

- income_period
- available_income
- allocations
- constraints
- explanation
- status
- created_at

---

# QUALITY REQUIREMENTS

This project is being developed under:

Software Engineering & Quality

Do not turn the repository into a testing demonstration, but quality practices should exist from the beginning.

Add:

Frontend:
- ESLint
- TypeScript strict mode
- Vitest
- React Testing Library
- Playwright

Backend:
- pytest
- Ruff
- type checking if practical

Write a small but meaningful initial test suite.

Focus initially on:

## Financial invariants

Example:

sum(allocation) <= available_income

allocation >= 0

essential_expenses must be covered when feasible

invalid financial input must be rejected

## API

Test:

- health endpoint
- financial state
- allocation response schema
- invalid request handling

## Frontend

Test a few critical paths:

- banking home renders
- Flow Sync can be opened
- allocation plan appears
- user can review plan

## E2E

One basic Playwright test:

Open banking home
→ receive/display salary
→ enter Flow Sync
→ review recommendation

Do not chase high code coverage yet.

Prefer meaningful tests over coverage percentage.

---

# SECURITY REQUIREMENTS

Treat security as a mandatory part of repository setup.

## Secrets

Never commit:

- passwords
- API keys
- tokens
- database credentials
- private URLs
- personal financial information

Create:

.env.example

Only contain placeholders.

Ensure:

.env
.env.local
*.secret

and other sensitive files are excluded by `.gitignore`.

---

# DEPENDENCY SECURITY

Before finalizing Phase 1:

- review installed dependencies
- remove unused packages
- prefer maintained packages
- avoid suspicious or unnecessary dependencies
- run relevant dependency auditing tools

Document the commands in README.

---

# DEMO ACCESS CONTROL

Competition guidance recommends:

- offline demonstration
OR
- restricted-access deployment.

Design the application so either mode is possible.

## Local / Offline Mode

The entire demo should work locally with mock data.

Running the prototype locally must NOT require third-party APIs.

Recommended:

docker compose up

or documented local development commands.

---

## Optional Demo Password Gate

Prepare a simple demo-access gate that can be enabled via configuration.

Example:

DEMO_AUTH_ENABLED=true

DEMO_PASSWORD=...

DO NOT hardcode the password.

This is not intended to be production banking authentication.

It exists only to restrict hackathon demo access.

Clearly document this.

If `DEMO_AUTH_ENABLED=false`, normal local development should remain convenient.

---

# NETWORK / EXTERNAL SERVICES

Phase 1 should operate without:

- external AI APIs
- real banking APIs
- analytics trackers
- third-party financial services

This ensures the prototype can run safely offline.

If future external services are added, they must be isolated behind adapters/interfaces.

---

# PROTOTYPE SAFETY NOTICE

The UI should include a subtle notice such as:

> Hackathon Prototype — Uses simulated financial data.

This can appear in:

- footer
- about page
- demo banner

Do not show aggressive warnings everywhere.

---

# UI PAGES

Implement the following initial routes:

/
Banking dashboard

/accounts
Accounts overview

/transactions
Transaction history

/goals
Financial goals

/finance
Financial overview

/flow-sync
Flow Sync dashboard

/flow-sync/plan
Allocation recommendation

/settings
Demo/user settings

---

# NAVIGATION

Suggested navigation:

Home
Accounts
Activity
Goals
Flow Sync

Flow Sync should visually stand out slightly but still feel like part of the banking product.

---

# HOME PAGE — IMPORTANT

The Home page is the first page reviewers will see.

Make it visually strong.

Potential structure:

Header

Greeting
Prototype badge

Account summary

Available balance

Recent salary event

Flow Sync card:

"Your income has arrived."

"Review this month's financial plan."

Financial overview

Recent transactions

Goals progress

Quick actions

The screen should immediately communicate:

> This is a banking application, and Flow Sync is an intelligent financial-management layer within it.

---

# FLOW SYNC USER EXPERIENCE

Flow Sync should NOT feel like:

"Press button → random percentages."

It should feel like:

1. Understand financial state.
2. Identify constraints.
3. Prepare plan.
4. Explain plan.
5. Let user review.
6. User remains in control.

Example sequence:

Salary received
↓
Flow Sync notification
↓
Review Financial State
↓
Recommended Allocation
↓
Explanation
↓
Adjust if desired
↓
Confirm

No actual money transfer occurs.

Confirmation simply stores:

plan.status = accepted

for prototype purposes.

---

# USER CONTROL

The system must not imply that Flow Sync automatically controls the user's bank account.

Users should remain the final decision-maker.

Provide actions such as:

- Accept Plan
- Adjust Plan
- Review Details

Use clear wording.

---

# EXPLAINABILITY

Each recommendation should have short human-readable reasons.

Example:

Emergency Reserve
8,000 THB

Reason:
"Your emergency reserve is currently below your selected target."

Goal Contribution
4,000 THB

Reason:
"This contribution keeps your goal close to its target date."

Keep explanations short.

Do not create long AI-generated essays.

---

# FRONTEND CHARTS

Use charts only where they improve comprehension.

Potential charts:

- spending by category
- monthly cash-flow summary
- allocation breakdown
- goal progress

Avoid dashboard chart overload.

If possible, use lightweight charting.

---

# RESPONSIVENESS

Main target:

1366–1920 desktop demo screens

but ensure the application is usable at:

375px mobile width.

The prototype should visually resemble a mobile-first banking product even when presented on desktop.

One possible desktop pattern:

Left navigation
+
center banking application content
+
optional contextual side panel

Use judgement.

---

# DESIGN SYSTEM

Create reusable design tokens.

Examples:

--color-primary
--color-primary-hover
--color-background
--color-surface
--color-text
--color-muted
--color-danger
--color-success
--color-border

Primary theme:

Red

Do not mimic any organization's exact brand red.

Choose an original red tone.

Accessibility:

ensure text/background contrast is reasonable.

---

# ERROR STATES

Do not only implement happy paths.

Add basic states for:

- loading
- empty transaction history
- failed API call
- invalid financial state
- unavailable Flow Sync recommendation

Example safe fallback:

> We couldn't prepare a financial plan right now.
> Your balances and existing financial setup remain unchanged.

---

# OBSERVABILITY

Keep Phase 1 simple.

Add structured backend logging.

Log:

- application startup
- request failures
- financial plan calculation failures

Never log:

- passwords
- tokens
- sensitive user data

---

# DEVELOPMENT EXPERIENCE

Provide simple commands.

Ideal:

Frontend:

npm install
npm run dev
npm run test
npm run lint

Backend:

python -m venv .venv
pip install -r requirements.txt
uvicorn ...

or equivalent modern workflow if appropriate.

Docker:

docker compose up --build

Avoid unnecessary setup complexity.

---

# DOCUMENTATION

Create:

README.md

README should explain:

1. What Flow Sync is
2. What this repository contains
3. Architecture
4. How to run frontend
5. How to run backend
6. How to run tests
7. How mock data works
8. Demo password configuration
9. Security notes
10. Competition branding restrictions

---

Create:

docs/ARCHITECTURE.md

Include:

- system context
- frontend
- backend
- data model
- Flow Sync engine
- data flow

Use Mermaid diagrams where useful.

Example:

User
↓
Banking UI
↓
API
↓
Financial State Service
↓
Flow Sync Allocation Engine
↓
Validation
↓
Recommendation

---

Create:

docs/FLOW_SYNC.md

Document:

- current product concept
- problem Flow Sync solves
- user journey
- inputs
- constraints
- outputs
- recommendation lifecycle

---

Create:

docs/SECURITY.md

Document:

- no real financial data
- no bank credentials
- secret management
- dependency security
- offline demo
- demo access control
- no real banking integrations

---

Create:

docs/IMPLEMENTATION_STATUS.md

Maintain:

Completed

In Progress

Not Started

Known Limitations

Next Recommended Work

Update this file after Phase 1.

---

# AGENTS.md

Create AGENTS.md for future coding agents.

Include project principles:

1. Never introduce real organization branding.
2. Never connect to real banking infrastructure unless explicitly requested in the future.
3. Never commit credentials.
4. Financial calculations must live outside UI components.
5. Financial rules must be testable.
6. User remains in control of financial decisions.
7. Prefer deterministic and explainable logic.
8. Avoid unnecessary architecture.
9. Maintain separation between:
   - UI
   - API
   - domain logic
   - persistence
10. Update documentation when architecture changes.
11. Keep demo usable offline.
12. Maintain TypeScript/Python quality checks.
13. Do not silently introduce AI/ML.
14. Do not add dependencies without justification.

---

# PHASE 1 IMPLEMENTATION ORDER

Execute approximately in this order.

## Step 1 — Inspect repository

Before changing anything:

- inspect all existing files
- inspect package/configuration files
- inspect Git status
- preserve existing useful files
- do not overwrite task.md

Report what currently exists.

---

## Step 2 — Establish repository structure

Create frontend/backend/docs infrastructure.

Do not overengineer.

---

## Step 3 — Build fictional banking UI

Focus heavily on making the application visually understandable.

Implement:

- Home
- Accounts
- Transactions
- Goals
- Financial Overview

Use mock API/data.

---

## Step 4 — Add Flow Sync UI

Implement:

- Flow Sync entry
- Financial state
- Suggested allocation
- explanation
- plan review

Use deterministic mock rules initially.

---

## Step 5 — Connect frontend and backend

Replace frontend-only hardcoded financial objects with API data.

Keep presentation mock data centralized.

---

## Step 6 — Tests

Create meaningful initial:

- domain tests
- API tests
- frontend tests
- one E2E flow

---

## Step 7 — Security / demo configuration

Implement:

- .env.example
- secret-safe config
- optional demo password gate
- offline operation
- dependency review

---

## Step 8 — Documentation

Create all required docs.

Include architecture diagram.

---

## Step 9 — Final verification

Run:

- frontend lint
- frontend test
- frontend build
- backend lint
- backend tests
- API startup
- E2E test if environment allows

Review:

- Git diff
- dependency list
- secrets
- organization branding
- broken routes
- console errors

---

# DO NOT DO YET

Do NOT implement these during Phase 1 unless required for architecture:

- real banking integration
- OAuth with real banking services
- real money transfer
- real payment APIs
- machine learning
- external AI API
- complex forecasting
- fraud detection
- investment recommendation
- credit scoring
- production authentication
- Kubernetes
- event-driven microservices
- message queues
- Redis unless clearly necessary
- excessive infrastructure

This is a hackathon prototype.

Build a clean foundation rather than a miniature bank.

---

# SUCCESS CRITERIA

At the end of this task, opening the application should immediately make the overall concept understandable.

A reviewer should be able to see:

1. A fictional but realistic digital banking environment.
2. The user's accounts and transaction behavior.
3. Their financial goals.
4. Their current financial state.
5. Where Flow Sync sits in the banking journey.
6. How Flow Sync converts financial state into a suggested action.
7. Why the recommendation exists.
8. That the architecture can evolve beyond the initial mock.
9. That quality and security have been considered from the beginning.
10. That the prototype does not impersonate or copy any real organization.

---

# FINAL OUTPUT REQUIRED FROM THE CODING AGENT

After implementation, provide a concise engineering report containing:

## Repository Changes

What was created or modified.

## Architecture

What the major components are and why they were chosen.

## Flow Sync Integration

Where Flow Sync appears and how data reaches it.

## Mock Allocation Logic

Explain exactly what logic currently exists.

## Testing

Which tests exist and whether they pass.

## Security

What security safeguards were implemented.

## Running the Project

Exact commands required.

## Known Limitations

Anything intentionally mocked or unfinished.

## Recommended Next Phase

Based on what was learned while building the banking prototype, identify:

- missing financial data,
- missing domain concepts,
- unclear UX decisions,
- infrastructure changes,
- and the next steps required to build the real Flow Sync allocation engine.

Do not continue automatically into the next phase.

Stop after Phase 1 and wait for review.