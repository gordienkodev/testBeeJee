export interface Task {
  id: number;
  username: string;
  email: string;
  text: string;
  completed: boolean;
}

export interface TaskResponse {
  tasks: Task[];
  total: number;
}
