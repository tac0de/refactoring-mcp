const {
  buildProtocolPrompt,
  buildGovernancePrompt,
} = require('../tools/promptBuilder');

const makePayload = (type, prompt, projectName, details = {}) => ({
  type,
  projectName,
  timestamp: new Date().toISOString(),
  prompt,
  details,
});

const normalizeProjectName = (input) =>
  typeof input === 'string' && input.trim().length ? input.trim() : 'Unnamed project';

const generateProtocolSpec = (options = {}) => {
  const projectName = normalizeProjectName(options.projectName);
  const prompt = buildProtocolPrompt({ projectName, ...options });
  return makePayload('protocol', prompt, projectName, {
    lanes: ['context', 'inputSchema', 'analysis', 'transform', 'verification'],
  });
};

const generateGovernanceSpec = (options = {}) => {
  const projectName = normalizeProjectName(options.projectName);
  const prompt = buildGovernancePrompt({ projectName, ...options });
  return makePayload('governance', prompt, projectName, {
    lanes: ['stakeholders', 'decisionRules', 'communication', 'compliance'],
  });
};

module.exports = {
  generateProtocolSpec,
  generateGovernanceSpec,
};
