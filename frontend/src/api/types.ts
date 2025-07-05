export interface TaskInput {
  username: string;
  email: string;
  text: string;
}

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

export interface LoginResponse {
  success: boolean;
}

export interface LogoutResponse {
  success: boolean;
}

export interface MeResponse {
  isAdmin: boolean;
}

export interface ApiError {
  error: string;
}
