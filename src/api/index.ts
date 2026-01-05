import {
  buildProtocolPrompt,
  buildGovernancePrompt,
  ProtocolPromptOptions,
  GovernancePromptOptions,
} from '../tools/promptBuilder.js';

export interface PromptSpec {
  type: 'protocol' | 'governance';
  projectName: string;
  prompt: string;
  timestamp: string;
  details: Record<string, unknown>;
}

const makePayload = (
  type: PromptSpec['type'],
  prompt: string,
  projectName: string,
  details: Record<string, unknown> = {}
 ): PromptSpec => ({
  type,
  projectName,
  timestamp: new Date().toISOString(),
  prompt,
  details,
});

const normalizeProjectName = (input: unknown): string =>
  typeof input === 'string' && input.trim().length
    ? input.trim()
    : 'Unnamed project';

export const generateProtocolSpec = (
  options: ProtocolPromptOptions = {}
 ): PromptSpec => {
  const projectName = normalizeProjectName(options.projectName);
  const prompt = buildProtocolPrompt({ projectName, ...options });
  return makePayload('protocol', prompt, projectName, {
    lanes: ['context', 'inputSchema', 'analysis', 'transform', 'verification'],
  });
};

export const generateGovernanceSpec = (
  options: GovernancePromptOptions = {}
 ): PromptSpec => {
  const projectName = normalizeProjectName(options.projectName);
  const prompt = buildGovernancePrompt({ projectName, ...options });
  return makePayload('governance', prompt, projectName, {
    lanes: ['stakeholders', 'decisionRules', 'communication', 'compliance'],
  });
};
