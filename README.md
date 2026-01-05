# Refactoring MCP — PRD

This project turns the Refactoring MCP prompt and governance specification templates into a dedicated MCP server so teams can host structured prompt generation via HTTP and automation scripts.

## 1. MCP Server Goal

- **What is this project?**  
  A dedicated MCP server (built on `@modelcontextprotocol/sdk`) that exposes MCP tools for generating protocol and governance prompt payloads following the Refactoring MCP standards.
- **What problem does it solve?**  
  Documentation-only templates are hard to integrate; this MCP server exposes prompt builders via HTTP so downstream automation and review tooling can consume the specs.
- **Who is the primary user?**  
  Platform engineers, MCP reviewers, or automation scripts needing consistent refactoring governance messaging via MCP workflows.

## 2. Success Definition

- **How do we know this project is successful?**  
  The npm package publishes, the MCP server starts, and prompts can be generated and stored via the `refactoring_mcp_*` tools.
- **What measurable outcome must be achieved?**  
  `npm test` succeeds, `npm start` (or `refactoring-mcp`) brings the MCP service online, and at least one prompt record can be created through the MCP tools.
- **What does failure look like?**  
  Prompt definitions remain stuck in Markdown without API access, or the automated validation/tests do not run.

## 3. Core MCP Server Action

- **What is the single most important action a user performs?**  
  Start the MCP server (via `npm start` or `refactoring-mcp`), host the API, and POST a protocol/governance prompt definition for downstream tooling.
- **What moment should make the user say “this works”?**  
  A successful `POST /api/prompts` followed by a `GET /api/prompts/:id` that returns the prompt text and metadata.

## 4. Non-Goals

- **What will this project NOT attempt to do?**  
  It does not persist prompts beyond in-memory, support authentication, or orchestrate remote agents.
- **What features are explicitly out of scope?**  
  Any persistent database, full LLM orchestration, or advanced scheduling can be deferred to future MCPs.

## 5. Constraints

- **Time constraints:** Keep the MVP lean for npm publishing—no long-running refactors.
- **Scope constraints:** Single MCP server (Express + prompt builders) without sprawling CLI features.
- **Resource constraints:** Only trusted dependencies (Express, built-in Node modules) are permitted.

## Validation Check

- **Can the project goal be explained in one sentence?** Yes — “Expose Refactoring MCP prompts via an Express API and CLI for automation-ready tooling.”
- **Can success be evaluated without subjective judgment?** Yes — endpoints respond successfully and tests pass.

## 6. MCP Server Usage

### Installation

- `npm install -g refactoring-mcp` (or `npm install refactoring-mcp` for local use).

### Run (stdio)

- `refactoring-mcp` or `npm start` boots the MCP server on port 3000 by default.
- Use `--port <number>` (or `-p`) or set the `PORT` env var to change the listening port.

### Example MCP Client Config

```json
{
  "command": "npx",
  "args": ["-y", "refactoring-mcp"]
}
```

### Tools

- `service_status` → return service metadata (name, version, uptime, timestamp).
- `refactoring_mcp_list_documents` → list the guidance documents that describe this MCP.
- `refactoring_mcp_get_document` → fetch a specific guidance document by key.
- `refactoring_mcp_get_bundle` → download all guidance documents in one bundle.
- `refactoring_mcp_generate_prompt` → build a protocol or governance prompt, validate the schema, and store the payload.
- `refactoring_mcp_list_prompts` → inspect saved prompt metadata and timestamps.
- `refactoring_mcp_get_prompt` → retrieve a stored prompt by `id`.

### Documents

- `spec` → `docs/spec-prompts.md` (protocol & governance spec templates).
- `trd` → `TRD.md` (technical boundaries for the MCP server).
- `mcp_server` → `docs/mcp-server.md` (server responsibilities and customization steps).
- `agents` → `examples/AGENTS.md` (agent instructions tied to this MCP).
- `trd_questions` → `prompts/trd.questions.md` (prompt template for drafting the TRD).

### Tool Overview

- `service_status` keeps MCP agents aware of the running version and uptime of the server.
- `refactoring_mcp_*` tools encapsulate prompt generation, doc discovery, and persisted prompt storage so other agents can consume the MCP output.

### MCP Server Runtime

- `refactoring-mcp` (installed globally) or `npm start` starts the MCP server so agents can access prompt specs.
- Override the port with `--port`, `-p`, or the `PORT` environment variable.

### Testing & Validation

- `npm test` runs `node --test ./test/*.test.js`, covering the prompt builders, store, and validators.
