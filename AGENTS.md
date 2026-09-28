ได้ ผมจะแยกให้เป็น 2 ส่วนเลย: **`AGENTS.md`** สำหรับให้ AI ตัวอื่นเข้าใจโปรเจกต์และกฎร่วมกัน และ **Prompt เริ่มทำงาน** สำหรับสั่ง Codex/Claude Code ให้เปิด repo แล้วลงมือ Phase 1 ตาม `task.md`

## `AGENTS.md`

```md
# AGENTS.md
# Adaptive Financial Sorter (Flow Sync)

This file defines the working rules, architectural direction, product intent, and collaboration expectations for any AI coding agent working on this repository.

The project is a hackathon prototype called:

# Adaptive Financial Sorter
## Product / Feature Name: Flow Sync

Flow Sync is a financial decision-support system intended to help users understand and manage their money more easily.

The system is broader than a salary splitter.

Its long-term purpose is to help users:

- understand their current financial state,
- organize financial information,
- recognize recurring expenses and obligations,
- define financial goals,
- evaluate available money,
- apply financial rules and constraints,
- generate suitable allocation plans,
- explain the reason behind recommendations,
- adapt plans when the user's financial situation changes,
- and integrate naturally into a digital banking environment.

This project is primarily developed from the perspective of:

# Software Engineering & Quality

The system should therefore demonstrate not only what the feature does, but also:

- how it is structured,
- how it is developed,
- how correctness is maintained,
- how failures are handled,
- how important logic is tested,
- and how the prototype can evolve safely.

---

# 1. Project Principles

All coding agents must follow these principles.

## 1.1 Build a coherent product, not isolated demo screens

Every feature should contribute to a believable end-to-end experience.

Avoid creating disconnected pages purely for visual presentation.

The application should show how:

Financial Data
→ Financial State
→ Decision Logic
→ Recommendation
→ User Review

fit together.

---

## 1.2 Flow Sync is not just a salary splitter

Do not reduce the concept to:

"salary comes in → split into fixed percentages"

The main difference is that the system should eventually adapt based on:

- income,
- recurring expenses,
- obligations,
- emergency reserve,
- goals,
- available balance,
- user preferences,
- constraints.

Fixed percentages may be used for mock/demo logic only when appropriate, but must not become the architectural assumption.

---

## 1.3 User remains in control

Flow Sync is a decision-support system.

It does not automatically control the user's money.

Recommendations should be presented for review.

Actions may include:

- Review
- Adjust
- Accept
- Recalculate

Do not imply automatic real transfers.

---

# 2. Competition / Branding Restrictions

This is mandatory.

Do not use or reproduce:

- KBank
- KBTG
- Kasikornbank
- ธนาคารกสิกรไทย
- organization logos
- trademarks
- official screenshots
- copied layouts
- copied branding
- organization-specific icons
- recognizable visual elements that imply this is an official product

The prototype must remain a fictional digital banking product.

Use labels such as:

> Hackathon Prototype

or

> Prototype Demo

where appropriate.

Never make the project look like an official banking application.

---

# 3. Design Direction

The frontend should represent a modern fictional banking application.

Primary visual direction:

- primary accent: red
- white / neutral backgrounds
- dark charcoal text
- clean spacing
- modern fintech appearance
- simple and approachable
- suitable for young working adults
- mobile-first design
- responsive desktop presentation

Avoid:

- copying real banking UI
- excessive gradients
- glassmorphism everywhere
- neon cyberpunk design
- animation for decoration only
- dense dashboards
- unnecessary charts

Use clear hierarchy and strong readability.

---

# 4. Technical Philosophy

The project should be simple enough for a hackathon but structured enough to demonstrate sound engineering.

Prefer:

> modular monolith

over:

> microservices

Do not introduce infrastructure only because it is fashionable.

Architecture must follow product needs.

---

# 5. Repository Structure

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

Agents may adjust this if the chosen framework clearly benefits from another structure.

Do not reorganize the repository without a reason.

---

# 6. Frontend Guidelines

Preferred stack:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Vitest
- React Testing Library
- Playwright

TanStack Query may be used when API integration justifies it.

Avoid large dependency-heavy UI frameworks unless clearly useful.

---

## 6.1 Frontend separation

Do not place all logic in `App.tsx`.

Separate:

- pages
- reusable UI
- domain feature components
- API clients
- types
- hooks
- formatting utilities

Preferred high-level organization:

apps/web/src/

├── app/
├── components/
├── pages/
├── features/
│   ├── accounts/
│   ├── transactions/
│   ├── goals/
│   ├── finance/
│   └── flow-sync/
├── services/
├── hooks/
├── types/
├── utils/
└── test/

---

## 6.2 Financial logic must not live in UI components

Never calculate core allocation logic directly in React components.

UI components should receive structured results.

Bad:

```ts
const savings = salary * 0.2
```

inside a page component.

Better:

```ts
const plan = await getFlowSyncPlan()
```

or use a domain function/service outside the UI.

---

# 7. Backend Guidelines

Preferred stack:

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- Alembic
- pytest
- Ruff

Use SQLite for local development if appropriate.

Keep database setup compatible with PostgreSQL.

Do not create multiple backend services unless there is a strong reason.

---

## 7.1 Backend module boundaries

Suggested modules:

apps/api/

├── core/
├── accounts/
├── transactions/
├── goals/
├── finance/
├── flow_sync/
├── db/
└── tests/

The exact structure may change, but the boundaries should remain clear.

---

# 8. Domain Layer

Flow Sync should have an explicit domain model.

Potential entities / concepts:

- User
- Account
- Transaction
- FinancialGoal
- FinancialProfile
- FinancialState
- RecurringExpense
- FinancialConstraint
- AllocationPlan
- AllocationItem
- Recommendation
- RecommendationReason

Do not use arbitrary dictionaries everywhere.

Use structured schemas and types.

---

# 9. Flow Sync Architecture

Conceptual data flow:

User Financial Data
↓
Financial State Builder
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

These steps may initially run within one backend application.

They should still remain logically separated.

---

# 10. Financial State

The system should derive a usable financial state from structured data.

Possible inputs:

- salary
- other income
- recurring expenses
- discretionary expenses
- account balances
- emergency savings
- debt / obligations
- goals

Output may contain:

- total income
- essential expenses
- discretionary spending
- available cash
- reserve status
- goal status
- remaining allocatable amount

Do not mix financial state calculation with presentation formatting.

---

# 11. Allocation Engine

The allocation engine may begin with deterministic rules.

Do not introduce AI/ML unless explicitly requested later.

Initial constraints may include:

- allocation cannot exceed available money
- no negative allocations
- essential expenses should be protected when feasible
- reserve minimum should be considered
- plans must remain internally consistent
- impossible plans should be rejected or marked invalid

The engine must be replaceable later.

---

# 12. Recommendation Explanations

Recommendations should be explainable.

Each recommendation may include:

- category
- amount
- reason
- related constraint
- priority

Example:

```json
{
  "category": "emergency_reserve",
  "amount": 4000,
  "reason": "Emergency savings are below the selected reserve target."
}
```

Do not create fake AI explanations.

Keep explanations deterministic and traceable to rules.

---

# 13. Testing Philosophy

Quality should be meaningful, not performative.

Do not chase high coverage percentages for presentation.

Test important behavior.

Focus on:

- business rules
- financial invariants
- API contracts
- key user flows
- failure behavior

---

## 13.1 Financial tests

Important invariants:

```text
sum(allocation_items) <= available_income
```

```text
allocation_amount >= 0
```

```text
essential expenses cannot silently disappear
```

```text
invalid financial input must not produce a valid plan
```

```text
accepted plan must remain internally consistent
```

---

## 13.2 Frontend tests

Test important interactions such as:

- dashboard loads
- Flow Sync entry appears
- user opens the financial plan
- recommendation data renders
- error state is displayed when API fails

---

## 13.3 E2E tests

Keep a small number of meaningful Playwright flows.

Example:

Banking Home
→ Salary Received
→ Flow Sync
→ Review Plan
→ Accept Plan

Do not build dozens of brittle UI tests during the hackathon.

---

# 14. Failure Handling

Financial software must fail safely.

If Flow Sync cannot calculate a valid plan:

DO NOT:

- guess silently
- fabricate a result
- show stale plan as current
- proceed as if calculation succeeded

Instead show a safe error state.

Example:

> We couldn't prepare a financial plan right now.
> Your current balances and setup remain unchanged.

---

# 15. Security Rules

Never commit secrets.

Forbidden:

- API keys
- tokens
- passwords
- production credentials
- real financial information
- private connection strings

Use:

.env

for local secrets.

Commit:

.env.example

with placeholders only.

---

## 15.1 Git hygiene

`.gitignore` should cover:

- .env
- .env.local
- virtual environments
- node_modules
- build artifacts
- temporary database files if appropriate
- secret files

Before committing, inspect:

```bash
git status
git diff
```

Search the repository for accidental secrets.

---

# 16. Dependencies

Do not install packages casually.

Before adding a dependency ask:

1. What problem does it solve?
2. Can the existing stack already solve it?
3. Is it maintained?
4. Is the package necessary for the prototype?
5. Does it increase security or complexity risk?

Remove unused dependencies.

---

# 17. External Services

Phase 1 should not depend on external services.

Avoid:

- external AI APIs
- banking APIs
- analytics services
- external financial data
- tracking systems

The demo should run offline.

Future integrations should use adapters/interfaces.

---

# 18. Authentication

Do not build real banking authentication.

A simple demo access gate is allowed.

Configuration example:

```env
DEMO_AUTH_ENABLED=true
DEMO_PASSWORD=example-placeholder
```

Never hardcode the real demo password.

This is only intended to restrict hackathon demo access.

---

# 19. Data Privacy

Use fictional mock data only.

Never include:

- real account numbers
- real customer names
- real transaction records
- real phone numbers
- personal financial information

Mock data should be believable but clearly synthetic.

---

# 20. Mock Data Strategy

Mock data should represent a coherent financial story.

Example fictional user:

- young employee
- receives monthly salary
- pays rent
- transportation expenses
- utilities
- food
- subscriptions
- has limited emergency savings
- has one or two financial goals

Transactions should support the Flow Sync demo.

Do not generate random data every run unless a seeded deterministic generator is used.

Demo behavior should be reproducible.

---

# 21. API Design

Initial API direction:

```text
GET  /health

GET  /api/accounts
GET  /api/transactions
GET  /api/goals

GET  /api/financial-state

GET  /api/flow-sync/plan
POST /api/flow-sync/preview
POST /api/flow-sync/confirm
```

No endpoint should initiate a real transfer.

`confirm` means:

> user accepts the recommended plan inside the prototype

not:

> move real money.

---

# 22. API Contracts

Frontend and backend should communicate using explicit schemas.

Do not depend on loosely shaped responses.

If shared types are practical, keep them in a shared package.

Otherwise maintain clearly documented Pydantic / TypeScript equivalents.

---

# 23. Observability

Use basic structured logging.

Useful logs:

- app startup
- API failures
- plan generation failure
- invalid financial state

Never log:

- passwords
- authentication secrets
- sensitive financial payloads unnecessarily

Avoid excessive logging.

---

# 24. Documentation

Architecture changes must be documented.

Maintain:

- README.md
- docs/ARCHITECTURE.md
- docs/FLOW_SYNC.md
- docs/SECURITY.md
- docs/IMPLEMENTATION_STATUS.md

If architecture changes significantly, update documentation in the same task.

---

# 25. Architecture Documentation

`docs/ARCHITECTURE.md` should describe:

- system context
- frontend
- backend
- persistence
- Flow Sync domain
- data flow
- key architectural decisions

Use Mermaid diagrams when useful.

---

# 26. Flow Sync Documentation

`docs/FLOW_SYNC.md` should explain:

- purpose
- user journey
- system inputs
- financial state
- constraints
- allocation process
- recommendation output
- explanation model
- current limitations
- future direction

---

# 27. Security Documentation

`docs/SECURITY.md` should include:

- mock-only financial data
- secret handling
- environment configuration
- dependency checks
- demo access
- offline mode
- branding restrictions
- known prototype limitations

---

# 28. Implementation Status

Keep:

`docs/IMPLEMENTATION_STATUS.md`

current.

Suggested format:

## Completed

## In Progress

## Not Started

## Known Issues

## Known Limitations

## Next Recommended Work

Update it after meaningful changes.

---

# 29. Coding Style

Prefer simple readable code.

Avoid clever abstractions.

Do not create abstractions before there are at least clear use cases for them.

Names should reflect the financial domain.

Prefer:

```text
build_financial_state()
generate_allocation_plan()
validate_plan()
```

over vague names such as:

```text
process_data()
run_engine()
helper()
```

---

# 30. Change Scope

Before making changes:

1. inspect the repository,
2. inspect current architecture,
3. inspect current task.md,
4. inspect Git status,
5. identify the minimum coherent change.

Do not rewrite working systems unnecessarily.

---

# 31. Existing Work

Preserve existing implementation unless:

- broken,
- clearly inconsistent with the current architecture,
- insecure,
- or explicitly requested to replace it.

Refactor intentionally.

Do not regenerate the project from scratch without justification.

---

# 32. Git Safety

Do not:

- force push
- rewrite Git history
- delete unrelated files
- reset work that may belong to the user
- commit automatically unless explicitly requested

Before completing a task, inspect:

```bash
git status
git diff
```

Report unexpected existing changes.

---

# 33. Development Commands

Prefer simple reproducible commands.

Frontend target:

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

Backend target:

```bash
python -m venv .venv
pip install -r requirements.txt
pytest
uvicorn ...
```

Docker target:

```bash
docker compose up --build
```

These may be adjusted based on actual tooling.

Document the real commands in README.

---

# 34. Do Not Overengineer

Do not introduce during early phases unless explicitly justified:

- Kubernetes
- distributed systems
- microservices
- Kafka
- RabbitMQ
- Redis
- service mesh
- GraphQL
- event sourcing
- CQRS
- ML pipeline
- vector database
- LLM orchestration
- production IAM

The project should remain understandable during a hackathon presentation.

---

# 35. AI Usage

Do not silently add AI features.

Flow Sync does not require an LLM or machine learning to demonstrate its core value.

If AI is introduced later:

- document exactly why,
- isolate it behind an interface,
- provide deterministic fallback,
- never expose credentials,
- test failure behavior,
- do not allow AI-generated values to bypass financial validation.

---

# 36. Product Language

Use simple user-facing financial language.

Avoid technical terminology in the UI such as:

- constraint solver
- optimization function
- inference pipeline
- financial state vector

These may appear in engineering documentation.

User-facing wording should emphasize:

- current financial situation
- monthly plan
- available money
- essential expenses
- savings
- goals
- recommendations
- reasons

---

# 37. Track Alignment

The project belongs to:

Software Engineering & Quality

Do not artificially force the project into a Data Science solution.

Data supports the feature, but software behavior, correctness, usability, integration, and quality should remain central.

The system should demonstrate:

```text
Problem
→ Product Design
→ Software Design
→ Implementation
→ Validation
→ Reliable User Experience
```

---

# 38. Phase 1 Objective

The current Phase 1 goal is not to perfect the financial algorithm.

It is to build enough of the surrounding banking environment to understand:

- where Flow Sync belongs,
- what information it needs,
- when users interact with it,
- what the backend must support,
- and what financial logic should be implemented next.

Prioritize:

- product flow
- architecture
- realistic mock data
- clear boundaries
- quality foundation

before advanced financial logic.

---

# 39. Agent Completion Behavior

When completing a task, always report:

## What Changed

Files / systems modified.

## Why

Reasoning behind major implementation choices.

## Verification

Commands/tests run and results.

## Known Limitations

What remains mocked or incomplete.

## Next Recommended Step

The most logical continuation.

Do not automatically start major next-phase work unless explicitly requested.

---

# 40. Core Reminder

The final goal is not:

> build a fake bank.

The fake banking environment exists to demonstrate:

> how Flow Sync could become a reliable financial decision-support layer inside a digital banking experience.

Every major implementation decision should support that goal.
```