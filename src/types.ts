export interface Task {
  id: string;
  title: string;
  priority: number;
  done: boolean;
  createdAt: number; // epoch ms
  dueDate?: string; // ISO 8601, optional
}

export class InvalidTaskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTaskError";
  }
}
