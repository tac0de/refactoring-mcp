# TRD — Refactoring MCP

This document captures the technical guardrails for the Refactoring MCP prompt service so the implementation stays aligned with the PRD while remaining lightweight and publishable via npm.

## 1. Architecture Direction

- **Is this a single-user tool or multi-user system?**  
  A single-process MCP server based on `@modelcontextprotocol/sdk` that exposes tools via `McpServer`/`StdioServerTransport`; concurrency is limited to the request boundaries enforced by the MCP runtime.
- **Is persistence required?**  
  No. Prompt definitions are cached in-memory (`PromptStore`) and intended for transient use; future persistence can be layered in behind the same store abstraction if needed.
- **Is real-time behavior required?**  
  No. MCP calls are synchronous and the server is expected to respond within milliseconds for prompt generation.

## 2. Data Model Boundaries

- **What data MUST be stored?**  
  Each generated prompt is stored with an `id`, creation timestamp, `type`, `projectName`, and the structured payload produced by the builders for auditability.
- **What data MUST NOT be stored?**  
  No authentication credentials, secrets, or third-party API keys are ever persisted. Inputs are limited to non-sensitive project descriptors and plan text.
- **What data can be derived instead of persisted?**  
  Metrics such as total prompt count or uptime are computed on demand (e.g., `store.list().length` or process uptime) rather than stored permanently.

## 3. Technology Constraints

- **Required technologies:** Node.js 18+, Express 4.x, and `node:test` for automated verification.
- **Forbidden technologies:** No databases, ORMs, TypeScript, or external orchestration frameworks—keeping the bundle small for npm publication and quick CLI runs.
- **Justification for constraints:** Minimizing dependencies aligns with the npm-package goal and avoids complicating the CLI entry point or API server.

## 4. Operational Constraints

- **Expected scale:** Light traffic (tens of requests) per process; no horizontal scaling is expected for the MVP.
- **Performance expectations:** Prompt generation should finish within milliseconds; Express middleware avoids heavy processing.
- **Security or compliance requirements:** The service does not expose sensitive data. Additional middleware (e.g., rate limiting or auth) can be layered later if needed.

## Validation Check

- **Do technical choices support the PRD goals?** Yes — the Express + CLI stack provides runnable APIs and tooling described in the README/PRD.
- **Are any technical decisions premature or unnecessary?** No — everything beyond the prompt store and HTTP endpoints is explicitly deferred until future phases.
