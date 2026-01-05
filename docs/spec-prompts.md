# Refactoring MCP Protocol & Governance Prompts

This document captures the prompt-level protocol that powers the Refactoring MCP npm package. Each section explains how prompts are structured so automated tools and reviewers can reason about protocol scope, governance expectations, and how to build downstream tooling.

## Protocol Specification Prompt

**Purpose:** Guide a tool (or assistant) to elaborate a refactoring protocol that covers context, input validation, transformation plan, and verification heuristics.

**Template:**

```
You are composing a refactoring protocol for `$projectName` using the Refactoring MCP standards.
- **Context:** describe the current structural issues, constraints, and non-functional goals.
- **Input Schema:** detail the code artefacts, configuration files, or data tables that will be consumed.
- **Analysis Steps:** enumerate the inspection steps, dependency checks, and safety nets.
- **Transform Strategy:** outline the action plan, prioritized edits, and fallback rollbacks.
- **Verification:** list the smoke tests, linting steps, and governance gates.
Return a structured JSON containing `context`, `schema`, `analysis`, `transform`, and `verification` entries.
```

**Guidance:**
1. Always include a `context` summary that calls out risks and unknowns.
2. Inputs should be validated against known file patterns before modifications.
3. Mention tooling, such as linters or formatters, that will gate the final verification section.
4. Use `Transform Strategy` to prioritize by criticality and rollback safety.

## Governance Specification Prompt

**Purpose:** Dictate how to coordinate reviewers, owners, and approvals for the refactoring process.

**Template:**

```
Design a governance outline for the `$projectName` MCP delivery.
- **Stakeholders:** list the owners, reviewers, and approvers.
- **Decision Rules:** define consensus thresholds, fast-track conditions, and escalation paths.
- **Communication:** describe the notifications, status updates, and artifact sharing.
- **Compliance Checks:** cite any legal, security, or policy reviews (e.g., accessibility, security scanning).
Output a structured document with `stakeholders`, `decisionRules`, `communication`, and `compliance` sections.
```

**Guidance:**
- Tie stakeholders to code areas (e.g., payment team owns billing refactors).
- Decision rules should differentiate between documentation fixes, bug fixes, and breaking changes.
- Communication should include both synchronous (meeting) and asynchronous (issue updates) flows.
- Compliance checks must reference applicable tools, such as security scanners (SAST) or license audits.

## Using These Prompts in Refactoring MCP

1. Start with the protocol prompt to sketch the refactor plan.
2. Follow up with the governance prompt before executing edits.
3. Feed the generated JSON into automated tools (pipe into validation scripts or API calls) to ensure traceability and reproducibility.

The npm package exports helper utilities to build these prompts consistently, keeping teams aligned on both technical and governance expectations.
