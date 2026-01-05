const ALLOWED_TYPES = ['protocol', 'governance'];
const REQUIRED_FIELDS = {
  protocol: ['context', 'inputs', 'analysis', 'transform', 'verification'],
  governance: ['stakeholders', 'decisionRules', 'communication', 'compliance'],
};

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const hasContent = (value) => {
  if (Array.isArray(value)) {
    return value.some((entry) => isNonEmptyString(entry));
  }
  return isNonEmptyString(value);
};

function validatePromptPayload(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    errors.push('payload must be an object');
    return { valid: false, errors };
  }

  const { type: rawType, options } = payload;
  const type =
    typeof rawType === 'string' ? rawType.trim().toLowerCase() : rawType;

  if (!type || !ALLOWED_TYPES.includes(type)) {
    errors.push(`type must be one of: ${ALLOWED_TYPES.join(', ')}`);
  }

  if (!options || typeof options !== 'object') {
    errors.push('options must be provided and must be an object');
  }

  if (type && REQUIRED_FIELDS[type] && options && typeof options === 'object') {
    REQUIRED_FIELDS[type].forEach((field) => {
      if (!hasContent(options[field])) {
        errors.push(`${field} is required and must be a non-empty string or array`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    type,
    options,
  };
}

module.exports = { validatePromptPayload };
