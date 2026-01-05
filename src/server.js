#!/usr/bin/env node
const fs = require('node:fs/promises');
const path = require('node:path');
const { z } = require('zod');
const PromptStore = require('./store');
const { generateProtocolSpec, generateGovernanceSpec } = require('./api');
const { validatePromptPayload } = require('./validators');

const repoRoot = path.resolve(__dirname, '..');
const pkg = require('../package.json');

const DOCUMENTS = {
  spec_prompts: {
    title: 'Protocol & Governance Prompts',
    path: 'docs/spec-prompts.md',
  },
  prd: {
    title: 'PRD / README',
    path: 'README.md',
  },
  trd: {
    title: 'TRD',
    path: 'TRD.md',
  },
  mcp_server: {
    title: 'MCP Server Guidance',
    path: 'docs/mcp-server.md',
  },
  trd_questions: {
    title: 'TRD Questions',
    path: 'prompts/trd.questions.md',
  },
  agents: {
    title: 'Agent Instructions',
    path: 'examples/AGENTS.md',
  },
};

async function resolveDocumentPath(doc) {
  const candidate = path.join(repoRoot, doc.path);
  try {
    await fs.access(candidate);
    return candidate;
  } catch {
    throw new Error(`Document not found: ${doc.path}`);
  }
}

async function loadDocument(key) {
  const doc = DOCUMENTS[key];
  if (!doc) {
    throw new Error(`Unknown document: ${key}`);
  }
  const resolved = await resolveDocumentPath(doc);
  return fs.readFile(resolved, 'utf8');
}

const promptInputSchema = z.object({
  type: z.enum(['protocol', 'governance']),
  options: z.record(z.unknown()).default({}),
});

(async () => {
  const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
  const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');

  const store = new PromptStore();
  const server = new McpServer({
    name: pkg.name,
    version: pkg.version,
  });

  server.registerTool(
    'service_status',
    {
      title: 'Refactoring MCP Status',
      description: 'Return the MCP server metadata and uptime.',
      inputSchema: {},
      outputSchema: {
        service: z.string(),
        version: z.string(),
        uptime: z.number(),
        timestamp: z.string(),
      },
    },
    async () => ({
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              service: pkg.name,
              version: pkg.version,
              uptime: process.uptime(),
              timestamp: new Date().toISOString(),
            },
            null,
            2
          ),
        },
      ],
      structuredContent: {
        service: pkg.name,
        version: pkg.version,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
    })
  );

  server.registerTool(
    'refactoring_mcp_list_documents',
    {
      title: 'Refactoring MCP Documents',
      description: 'List the published Refactoring MCP guidance documents.',
      inputSchema: {},
      outputSchema: {
        documents: z.array(
          z.object({
            key: z.string(),
            title: z.string(),
          })
        ),
      },
    },
    async () => {
      const documents = Object.keys(DOCUMENTS).map((key) => ({
        key,
        title: DOCUMENTS[key].title,
      }));
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(documents, null, 2),
          },
        ],
        structuredContent: { documents },
      };
    }
  );

  server.registerTool(
    'refactoring_mcp_get_document',
    {
      title: 'Refactoring MCP Document',
      description: 'Fetch a Refactoring MCP document by key.',
      inputSchema: {
        document: z.enum(Object.keys(DOCUMENTS)),
      },
      outputSchema: {
        document: z.string(),
      },
    },
    async ({ document }) => {
      const text = await loadDocument(document);
      return {
        content: [
          {
            type: 'text',
            text,
          },
        ],
        structuredContent: {
          document: text,
        },
      };
    }
  );

  server.registerTool(
    'refactoring_mcp_get_bundle',
    {
      title: 'Refactoring MCP Bundle',
      description: 'Return all Refactoring MCP guidance documents in one bundle.',
      inputSchema: {},
      outputSchema: {
        bundle: z.string(),
      },
    },
    async () => {
      const entries = await Promise.all(
        Object.keys(DOCUMENTS).map(async (key) => {
          const doc = DOCUMENTS[key];
          const text = await loadDocument(key);
          return `# ${doc.title}\n\n${text}`;
        })
      );
      const bundle = entries.join('\n\n---\n\n');
      return {
        content: [
          {
            type: 'text',
            text: bundle,
          },
        ],
        structuredContent: {
          bundle,
        },
      };
    }
  );

  server.registerTool(
    'refactoring_mcp_generate_prompt',
    {
      title: 'Generate Refactoring MCP Prompt',
      description:
        'Generate a protocol or governance prompt using the Refactoring MCP builders and persist the output.',
      inputSchema: promptInputSchema,
    outputSchema: {
      spec: z
        .object({
          id: z.string(),
          type: z.enum(['protocol', 'governance']),
          projectName: z.string(),
          prompt: z.string(),
          timestamp: z.string(),
        })
        .optional(),
      errors: z.array(z.string()).optional(),
    },
    },
    async (input) => {
      const { type, options } = promptInputSchema.parse(input);
      const validation = validatePromptPayload({ type, options });
      if (!validation.valid) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ errors: validation.errors }, null, 2),
            },
          ],
          structuredContent: {
            errors: validation.errors,
          },
        };
      }

      const generator =
        type === 'protocol' ? generateProtocolSpec : generateGovernanceSpec;
      const spec = generator({ projectName: options.projectName, ...options });
      const saved = store.add(spec);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                id: saved.id,
                type: saved.type,
                projectName: saved.projectName,
                prompt: saved.prompt,
              },
              null,
              2
            ),
          },
        ],
        structuredContent: {
          spec: saved,
        },
      };
    }
  );

  server.registerTool(
    'refactoring_mcp_list_prompts',
    {
      title: 'List stored Refactoring MCP prompts',
      description: 'Return metadata for all prompts stored in the MCP server.',
      inputSchema: {},
      outputSchema: {
        prompts: z.array(
          z.object({
            id: z.string(),
            type: z.enum(['protocol', 'governance']),
            projectName: z.string(),
            createdAt: z.string(),
          })
        ),
      },
    },
    async () => {
      const prompts = store.list().map((entry) => ({
        id: entry.id,
        type: entry.type,
        projectName: entry.projectName,
        createdAt: entry.createdAt,
      }));
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(prompts, null, 2),
          },
        ],
        structuredContent: {
          prompts,
        },
      };
    }
  );

  server.registerTool(
    'refactoring_mcp_get_prompt',
    {
      title: 'Fetch a stored prompt',
      description: 'Retrieve a stored Refactoring MCP prompt by ID.',
      inputSchema: {
        id: z.string(),
      },
      outputSchema: {
        prompt: z
          .object({
            id: z.string(),
            type: z.enum(['protocol', 'governance']),
            projectName: z.string(),
            prompt: z.string(),
            createdAt: z.string(),
          })
          .nullable(),
      },
    },
    async ({ id }) => {
      const result = store.find(id);
      if (!result) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: 'prompt not found' }),
            },
          ],
          structuredContent: {
            prompt: null,
          },
        };
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
        structuredContent: {
          prompt: result,
        },
      };
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
