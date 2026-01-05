type SectionInput = string | string[] | undefined | null;

const formatList = (items: SectionInput): string => {
  if (!items) return '';
  if (typeof items === 'string') return items.trim();
  if (!Array.isArray(items)) return String(items);

  const cleaned = items.filter(Boolean);
  if (!cleaned.length) return '';

  return cleaned
    .map((entry, index) => `${index + 1}. ${entry}`)
    .join('\n');
};

const buildSections = (entries: { title: string; content: string }[]): string =>
  entries
    .filter((entry) => entry.content)
    .map((entry) => `${entry.title}:\n${entry.content}`)
    .join('\n\n');

const ensureContent = (value: SectionInput): string => {
  if (!value) return '';
  return typeof value === 'string' ? value.trim() : formatList(value);
};

const padSignature = (name: string, projectName: string): string =>
  `You are composing a ${name} prompt for "${projectName}" using Refactoring MCP guidance.`;

const createPrompt = (
  projectName: string,
  name: string,
  sections: { title: string; content: string }[]
 ): string => {
  const heading = padSignature(name, projectName);
  const body = buildSections(sections);
  return [heading, body].filter(Boolean).join('\n\n');
};

export interface ProtocolPromptOptions {
  projectName?: string;
  context?: SectionInput;
  inputs?: SectionInput;
  analysis?: SectionInput;
  transform?: SectionInput;
  verification?: SectionInput;
  [key: string]: unknown;
}

export interface GovernancePromptOptions {
  projectName?: string;
  stakeholders?: SectionInput;
  decisionRules?: SectionInput;
  communication?: SectionInput;
  compliance?: SectionInput;
  [key: string]: unknown;
}

export const buildProtocolPrompt = ({
  projectName = 'Unnamed project',
  context,
  inputs,
  analysis,
  transform,
  verification,
}: ProtocolPromptOptions): string => {
  const sections = [
    { title: 'Context', content: ensureContent(context) },
    { title: 'Input Schema', content: ensureContent(inputs) },
    { title: 'Analysis Steps', content: ensureContent(analysis) },
    { title: 'Transform Strategy', content: ensureContent(transform) },
    { title: 'Verification', content: ensureContent(verification) },
  ];
  return createPrompt(projectName, 'protocol specification', sections);
};

export const buildGovernancePrompt = ({
  projectName = 'Unnamed project',
  stakeholders,
  decisionRules,
  communication,
  compliance,
}: GovernancePromptOptions): string => {
  const sections = [
    { title: 'Stakeholders', content: ensureContent(stakeholders) },
    { title: 'Decision Rules', content: ensureContent(decisionRules) },
    { title: 'Communication', content: ensureContent(communication) },
    { title: 'Compliance Checks', content: ensureContent(compliance) },
  ];
  return createPrompt(projectName, 'governance specification', sections);
};
