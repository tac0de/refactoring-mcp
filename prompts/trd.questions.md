# TRD Questions — Refactoring MCP

This prompt sheet helps keep the TRD output aligned with the PRD goals of the Refactoring MCP service.

```
You are drafting the Refactoring MCP TRD.
- Describe the architecture shape (single-process API, CLI, no persistent storage).
- Define the data that must be captured, and clarify what must never be stored (e.g., secrets).
- List the technology constraints (Node 18+, Express, node:test) and technologies we avoid.
- Outline operational constraints (scope, performance expectations, security limits).
Provide the rationale for each answer so reviewers understand why the TRD choices support the MCP.
```

Use this prompt in tandem with the PRD spec doc and the prompt templates inside `docs/spec-prompts.md`.
