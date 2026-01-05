class PromptStore {
  constructor() {
    this.items = new Map();
    this.counter = 1;
  }

  list() {
    return Array.from(this.items.values());
  }

  add(payload) {
    const id = String(this.counter++);
    const record = {
      id,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    this.items.set(id, record);
    return record;
  }

  find(id) {
    return this.items.get(id) ?? null;
  }
}

module.exports = PromptStore;
