import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PromptStore } from '../src/index.js';

test('PromptStore adds and retrieves prompt entries', () => {
  const store = new PromptStore();
  const payload = {
    type: 'protocol' as const,
    projectName: 'Refactoring MCP',
    prompt: 'sample prompt',
    timestamp: new Date().toISOString(),
    details: { lanes: ['context'] },
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
