const formatList = (items) => {
  if (!items) return '';
  if (typeof items === 'string') return items.trim();
  if (!Array.isArray(items)) return String(items);

  const cleaned = items.filter(Boolean);
  if (!cleaned.length) return '';

  return cleaned.map((entry, index) => `${index + 1}. ${entry}`).join('\n');
};

const buildSections = (entries) =>
  entries
    .filter((entry) => entry.content)
    .map((entry) => `${entry.title}:\n${entry.content}`)
    .join('\n\n');

const ensureContent = (value) => {
  if (!value) return '';
  return typeof value === 'string' ? value.trim() : formatList(value);
};

const padSignature = (name, projectName) =>
  `You are composing a ${name} prompt for "${projectName}" using Refactoring MCP guidance.`;

const createPrompt = (projectName, name, sections) => {
  const heading = padSignature(name, projectName);
  const body = buildSections(sections);
  return [heading, body].filter(Boolean).join('\n\n');
};

const buildProtocolPrompt = ({
  projectName = 'Unnamed project',
  context,
  inputs,
  analysis,
  transform,
  verification,
}) => {
  const sections = [
    { title: 'Context', content: ensureContent(context) },
    { title: 'Input Schema', content: ensureContent(inputs) },
    { title: 'Analysis Steps', content: ensureContent(analysis) },
    { title: 'Transform Strategy', content: ensureContent(transform) },
    { title: 'Verification', content: ensureContent(verification) },
  ];

  return createPrompt(projectName, 'protocol specification', sections);
};

const buildGovernancePrompt = ({
  projectName = 'Unnamed project',
  stakeholders,
  decisionRules,
  communication,
  compliance,
}) => {
  const sections = [
    { title: 'Stakeholders', content: ensureContent(stakeholders) },
    { title: 'Decision Rules', content: ensureContent(decisionRules) },
    { title: 'Communication', content: ensureContent(communication) },
    { title: 'Compliance Checks', content: ensureContent(compliance) },
  ];

  return createPrompt(projectName, 'governance specification', sections);
};

module.exports = {
  buildProtocolPrompt,
  buildGovernancePrompt,
};
