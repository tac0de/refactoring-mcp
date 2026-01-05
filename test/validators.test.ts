import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validatePromptPayload } from '../src/validators.js';

test('validatePromptPayload rejects unsupported type', () => {
  const result = validatePromptPayload({ type: 'unknown', options: {} });
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.some((msg) => msg.includes('type must be one of')));
});

test('validatePromptPayload rejects missing options', () => {
  const result = validatePromptPayload({ type: 'protocol' });
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.some((msg) => msg.includes('options must be provided')));
});

test('validatePromptPayload accepts complete protocol payload', () => {
  const payload = {
    type: 'protocol',
    options: {
      projectName: 'Refactoring MCP',
      context: 'Legacy code',
      inputs: ['src'],
      analysis: ['review'],
      transform: ['refactor'],
      verification: ['test'],
    },
  };
  const result = validatePromptPayload(payload);
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.type, 'protocol');
});
