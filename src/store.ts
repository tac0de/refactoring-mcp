export interface StoredPrompt {
  id: string;
  createdAt: string;
  projectName: string;
  type: 'protocol' | 'governance';
  prompt: string;
  timestamp: string;
  details: Record<string, unknown>;
}

export class PromptStore {
  private items = new Map<string, StoredPrompt>();
  private counter = 1;

  list(): StoredPrompt[] {
    return Array.from(this.items.values());
  }

  add(payload: Omit<StoredPrompt, 'id' | 'createdAt'>): StoredPrompt {
    const id = String(this.counter++);
    const record: StoredPrompt = {
      id,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    this.items.set(id, record);
    return record;
  }

  find(id: string): StoredPrompt | null {
    return this.items.get(id) ?? null;
  }
}
