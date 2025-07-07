import type { Task, TaskInput, TaskResponse } from './types';

const API_URL = import.meta.env.VITE_API_URL;

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

export async function createTask(task: TaskInput): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    const status = res.status;
    const statusText = res.statusText;
    const text = await res.text();

    console.error('Server error:', {
      status,
      statusText,
      responseBody: text,
    });

    let message = `Request failed with status ${status}`;

    try {
      if (text) {
        const data = JSON.parse(text);
        message = data?.error || message;
      }
    } catch {
      if (text) {
        message += `: ${text}`;
      }
    }

    throw new Error(message);
  }

  return res.json();
}

export async function updateTask(
  id: number,
  data: { text: string; status: boolean }
): Promise<void> {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(`Ошибка: ${res.status}`);
  }
}
