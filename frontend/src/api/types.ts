export interface Task {
  id: number;
  username: string;
  email: string;
  text: string;
  status: boolean;
  isEdited: boolean;
}

export interface TaskResponse {
  tasks: Task[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
