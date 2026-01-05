import type {
  GovernancePromptOptions,
  ProtocolPromptOptions,
} from './tools/promptBuilder.js';

type SectionValue = string | string[] | undefined | null;

const ALLOWED_TYPES = ['protocol', 'governance'] as const;
type PromptType = (typeof ALLOWED_TYPES)[number];

type ProtocolField = 'context' | 'inputs' | 'analysis' | 'transform' | 'verification';
type GovernanceField = 'stakeholders' | 'decisionRules' | 'communication' | 'compliance';
type RequiredField = ProtocolField | GovernanceField;

const REQUIRED_FIELDS: Record<PromptType, readonly RequiredField[]> = {
  protocol: ['context', 'inputs', 'analysis', 'transform', 'verification'],
  governance: ['stakeholders', 'decisionRules', 'communication', 'compliance'],
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const hasContent = (value: SectionValue): boolean => {
  if (Array.isArray(value)) {
    return value.some((entry) => isNonEmptyString(entry));
  }
  return isNonEmptyString(value);
};

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  type?: PromptType;
  options?: ProtocolPromptOptions | GovernancePromptOptions;
}

export function validatePromptPayload(
  payload: unknown
): ValidationResult {
  const errors: string[] = [];
  if (!payload || typeof payload !== 'object') {
    errors.push('payload must be an object');
    return { valid: false, errors };
  }

  const { type: rawType, options } = payload as {
    type?: string;
    options?: Record<string, unknown>;
  };
  const type = typeof rawType === 'string' ? rawType.trim().toLowerCase() : rawType;

  if (!type || !ALLOWED_TYPES.includes(type as PromptType)) {
    errors.push(`type must be one of: ${ALLOWED_TYPES.join(', ')}`);
  }

  if (!options || typeof options !== 'object') {
    errors.push('options must be provided and must be an object');
  }

  if (
    type &&
    ALLOWED_TYPES.includes(type as PromptType) &&
    options &&
    typeof options === 'object'
  ) {
    const required = REQUIRED_FIELDS[type as PromptType];
    const typedOptions = options as Record<string, SectionValue>;
    required.forEach((field) => {
      if (!hasContent(typedOptions[field])) {
        errors.push(
          `${field} is required and must be a non-empty string or array`
        );
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    type: type as PromptType | undefined,
    options:
      (options as ProtocolPromptOptions | GovernancePromptOptions) ?? undefined,
  };
}
