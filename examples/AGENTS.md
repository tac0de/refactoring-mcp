# AGENTS.md

This document defines how AI agents may operate in this repository.

---

## Active MCPs

- Refactoring MCP (current) — the prompt-generation MCP server being published.
- Project Bootstrap MCP (reference) — already completed and only used for inspiration.

---

## MCP Transition Rules

- Coding agents may operate only while Refactoring MCP is active.
- Do not restart or remove Project Bootstrap MCP artifacts; they serve as architectural inspiration only.
- Keep Refactoring MCP focused on prompt-building, governance guidance, and the supporting MCP server.

## Custom MCP Server Instructions

- This repository builds a specialized MCP server; the Express CLI entrypoint is only a runtime convenience.
- Always align new endpoints, validators, and store changes with the server duties described in `docs/mcp-server.md`.
- Keep the prompt schema in sync with `docs/spec-prompts.md` and record any changes in `TRD.md`.
- Future turns should assume these documents (README/AGENTS/TRD/docs) define the ongoing MCP server context; reference them before adding new behavior.
- The MCP server exposes `refactoring_mcp_*` tools (list/generate prompt, document bundle, service_status); interact with these tools via the MCP transport rather than inventing new REST endpoints.

---

## Allowed Actions

- Implement or evolve code that supports prompt generation, validation, CLI startup, or documentation aligned with the Refactoring MCP PRD/TRD.
- Add tests that cover new behaviors introduced for the API or validators.
- Update PRD/TRD/AGENTS docs to reflect actual constraints.

---

## Forbidden Actions

- Do not add unrelated features (authentication, persistence layers, or unrelated APIs) beyond the scope defined here.
- Do not remove or rewrite the existing prompt templates unless explicitly asked.
- Do not publish code that relies on network calls or external services during MCP operations.
