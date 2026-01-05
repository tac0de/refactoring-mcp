# Custom MCP Server Guidance

This MCP server is the canonical runtime for the Refactoring MCP prompt workflow. It is built on `@modelcontextprotocol/sdk` (`McpServer` + `StdioServerTransport`) so agents can interact via the MCP protocol. Treat it as a lightweight HTTP host that captures structured protocol/governance specs and makes them available to coordinating agents.

## Server responsibilities

- Expose `/api/prompts` and `/api/prompts/:id` so MCP agents can create and read protocol/governance specs generated through the npm helpers.
- Offer `/api/status` for service discovery (name, version, uptime, timestamp).
- Validate incoming payloads against the MCP prompt schema before persisting them into `PromptStore`.
- Keep state in-memory within `PromptStore`; the MCP server is stateless beyond that store for the MVP.

## Customization steps

1. **Update prompt validation** (`src/validators.js`) whenever a new MCP prompt type or field is required.
2. **Extend the prompt store** (`src/store.js`) if you need audit logging, persistence, or indexing for downstream MCP governance tools.
3. **Add endpoints** in `src/app.js` only when they align with MCP server duties (e.g., bridging to metadata or agent status).
4. **Expose helpers** through `src/index.js` so other MCP adapters can import generators without hitting HTTP endpoints.

## Runtime notes

- The CLI shim (`bin/refactoring-mcp.js`) just starts the server; treat it as a convenience, not a CLI-first experience.
- Agents should not rely on CLI flags beyond `--port`/`-p` because the MCP server is expected to run inside orchestrated environments.
- Use `npm test` regularly to keep prompt builders, store, and validators aligned with MCP spec changes.ㅁ

## When designing new MCP artifacts

- Document their purpose in `README.md` (PRD), `TRD.md`, and `docs/spec-prompts.md` so future agents refer to the same spec.
- Update `examples/AGENTS.md` whenever governance rules or MCP activation changes.
- Keep the prompt schema small; MCP servers should stay open and responsive, not overloaded with heavy compute.
