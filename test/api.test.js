const { test } = require('node:test');
const { strict: assert } = require('node:assert');
const {
  generateProtocolSpec,
  generateGovernanceSpec,
} = require('../src/api');

test('protocol spec includes each requested section', () => {
  const spec = generateProtocolSpec({
    projectName: 'Refactoring MCP',
    context: 'Legacy modules share a monolithic config.',
    inputs: ['src/', 'package.json'],
    analysis: ['Identify hotspots', 'List dependencies that rely on shared state'],
    transform: ['Introduce service layer', 'Migrate utilities into isolated modules'],
    verification: ['Run npm test', 'Validate linting'],
  });

  assert.equal(spec.type, 'protocol');
  assert.match(spec.prompt, /Context:/);
  assert.match(spec.prompt, /Input Schema:/);
  assert.match(spec.prompt, /1\. Identify hotspots/);
  assert.match(spec.prompt, /Verification:/);
});

test('governance spec structures communication rules', () => {
  const spec = generateGovernanceSpec({
    projectName: 'Refactoring MCP',
    stakeholders: ['Platform team maintains runtime code.', 'Docs team owns guides.'],
    decisionRules: ['Minor updates auto-approve after peer review.', 'Breaking changes require cross-team sync.'],
    communication: ['Slack channel #refactor-mcp', 'Weekly sync note in Notion'],
    compliance: ['Run DepShield', 'Security team approves before merge'],
  });

  assert.equal(spec.type, 'governance');
  assert.match(spec.prompt, /Stakeholders:/);
  assert.match(spec.prompt, /Compliance Checks:/);
  assert.match(spec.prompt, /1\. Platform team maintains runtime code\./);
});
