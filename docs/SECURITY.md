# Security and demo boundaries

This document distinguishes current Phase 1 safeguards from PM-1.1 requirements. [Product specification](PRODUCT_SPEC.md) and [API contract](API_CONTRACT.md) define the approved scope; PM-1.1 behavior is awaiting implementation.

- The repository contains fictional names, balances and transactions only. No customer data or real account number is present.
- The application has no real banking connection, payment integration, transfer action, external AI service, tracker or analytics call.
- `.env` files, virtual environments, databases and build output are ignored. `.env.example` has local placeholders only; the prototype currently needs no credentials.
- Demo authentication is intentionally omitted for local-only mock data. Do not treat this prototype as a production banking application.
- The API binds to loopback for documented local use. CORS is limited to local Vite origins; allowed methods are GET and POST.
- In Phase 1, confirming a plan changes only a process-local simulated status and never moves money. PM-1.1 requires persistent exact-version commitments with the same no-money-movement boundary.
- Runtime UI assets use local system font fallbacks; no remote font or image service is required.
- Dependency review commands are documented in README. Re-run audits when dependencies are installed or upgraded.
- Use the fictional Flow Sync identity only. Never add real bank names, logos, screenshots or recognizable institutional branding.

Known limitation: API confirmation state is in memory and the API has no production authentication, rate limiting, database or deployment hardening.

## PM-1.1 implementation requirements

- Server owns financial facts and validation. Preview accepts referenced plan/version and edited contributions, never client-supplied account balances or an authoritative Financial State.
- Confirm atomically checks actual cash, source revision, current commitment and idempotency identity. Failures do not partially replace commitments or update balances.
- Restrict data access to the synthetic demo user; verify same-user/currency references and transfer/refund/occurrence uniqueness at boundaries.
- Persist only synthetic records and inspectable snapshots. Keep DB files ignored, local setup explicit and seed/reset actions outside public API routes.
- Add PATCH to permitted local CORS methods when the approved edit endpoints are implemented; retain explicit loopback origins. This pass does not change runtime CORS.
- Log operation/outcome codes and safe IDs for failures, without secrets or full financial payloads. Standard error responses must not disclose stack traces.
- Keep `.env.example` placeholders and existing `.gitignore` protection; no credentials are needed for the specified MVP. Dependency additions require justification and audit in their implementation task.
- Local/offline means runtime needs no network services after tools/dependencies are installed. A public deployment or password gate is separate work, not a capability claimed here.
