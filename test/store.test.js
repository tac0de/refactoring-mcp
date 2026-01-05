const { test } = require('node:test');
const assert = require('node:assert').strict;
const { PromptStore } = require('../src/index');

test('PromptStore adds and retrieves prompt entries', () => {
  const store = new PromptStore();
  const payload = {
    type: 'protocol',
    projectName: 'Refactoring MCP',
    prompt: 'sample prompt',
  };

  const saved = store.add(payload);
  assert.strictEqual(saved.id, '1');
  assert.strictEqual(saved.projectName, payload.projectName);
  assert.strictEqual(store.find('1'), saved);
  assert.strictEqual(store.list().length, 1);
});

test('PromptStore returns null for missing ids', () => {
  const store = new PromptStore();
  assert.strictEqual(store.find('missing'), null);
});
