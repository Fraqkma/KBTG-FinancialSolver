# Security and demo boundaries

- The repository contains fictional names, balances and transactions only. No customer data or real account number is present.
- The application has no real banking connection, payment integration, transfer action, external AI service, tracker or analytics call.
- `.env` files, virtual environments, databases and build output are ignored. `.env.example` has local placeholders only; the prototype currently needs no credentials.
- Demo authentication is intentionally omitted for local-only mock data. Do not treat this prototype as a production banking application.
- The API binds to loopback for documented local use. CORS is limited to local Vite origins; allowed methods are GET and POST.
- Confirming a plan changes only a process-local simulated status and never moves money.
- Runtime UI assets use local system font fallbacks; no remote font or image service is required.
- Dependency review commands are documented in README. Re-run audits when dependencies are installed or upgraded.
- Use the fictional Flow Sync identity only. Never add real bank names, logos, screenshots or recognizable institutional branding.

Known limitation: API confirmation state is in memory and the API has no production authentication, rate limiting, database or deployment hardening.
