import type { Task, TaskResponse } from './types';
const API_URL = import.meta.env.VITE_API_URL;

console.log('API_URL', API_URL);

export async function fetchTasks(
  page: number,
  sortField?: string,
  sortOrder?: 'ASC' | 'DESC'
): Promise<TaskResponse> {
  const params = new URLSearchParams();
  params.append('page', String(page));
  if (sortField) params.append('sortField', sortField);
  if (sortOrder) params.append('sortOrder', sortOrder);

  const res = await fetch(`${API_URL}/api/tasks?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(username: string, email: string, text: string): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, text }),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}
