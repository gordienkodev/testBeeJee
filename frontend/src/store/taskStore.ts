import { create } from 'zustand';
import { fetchTasks, createTask, updateTask } from '@/api/tasks';
import type { Task, TaskResponse } from '@/api/types';

interface FormData {
  username: string;
  email: string;
  text: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  text?: string;
}

interface TaskStoreState {
  data: TaskResponse | null;
  loading: boolean;
  error: string | null;
  page: number;
  sortField: 'username' | 'email' | 'status' | '';
  sortOrder: 'ASC' | 'DESC';
  success: boolean;
  formData: FormData;
  formErrors: FormErrors;

  fetch: (options?: {
    page?: number;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) => Promise<void>;
  setPage: (page: number) => void;
  setSortField: (field: 'username' | 'email' | 'status') => void;
  toggleSortOrder: () => void;
  updateTaskInStore: (task: Task) => Promise<void>;
  createTaskInStore: (taskData: Omit<Task, 'id'>) => Promise<void>;
  clearSuccess: () => void;

  setFormField: (field: keyof FormData, value: string) => void;
  setFormError: (field: keyof FormErrors, error: string) => void;
  removeFormError: (field: keyof FormErrors) => void;
  clearForm: () => void;
  validateForm: () => boolean;
}

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  page: 1,
  sortField: '',
  sortOrder: 'DESC',
  success: false,

  formData: {
    username: '',
    email: '',
    text: '',
  },
  formErrors: {},

  fetch: async (options = {}) => {
    const state = get();
    const page = options.page ?? state.page;
    const sortField = (options.sortField ?? state.sortField) as 'username' | 'email' | 'status';
    const sortOrder = options.sortOrder ?? state.sortOrder;

    set({ loading: true, error: null });

    try {
      const data = await fetchTasks(page, sortField, sortOrder);
      set({ data, page, sortField, sortOrder });
    } catch (e) {
      if (e instanceof Error) {
        set({ error: e.message, data: null });
      }
    } finally {
      set({ loading: false });
    }
  },

  setPage: (page) => {
    set({ page });
    get().fetch({ page });
  },

  setSortField: (field) => {
    const currentPage = get().page;
    set({ sortField: field, sortOrder: 'ASC' });
    get().fetch({ sortField: field, sortOrder: 'ASC', page: currentPage });
  },

  toggleSortOrder: () => {
    const current = get().sortOrder;
    const currentPage = get().page;
    const newOrder = current === 'ASC' ? 'DESC' : 'ASC';
    set({ sortOrder: newOrder });
    get().fetch({ sortOrder: newOrder, page: currentPage });
  },

  updateTaskInStore: async (task) => {
    try {
      await updateTask(task.id, { text: task.text, status: task.status });
      await get().fetch();
    } catch (e) {
      console.error(e);
    }
  },

  createTaskInStore: async (taskData) => {
    set({ loading: true, error: null, success: false });
    try {
      await createTask(taskData);
      set({ page: 1 });
      await get().fetch({ page: 1 });
      set({ success: true });
    } catch (e) {
      if (e instanceof Error) set({ error: e.message, success: false });
    } finally {
      set({ loading: false });
    }
  },

  clearSuccess: () => {
    set({ success: false });
  },

  setFormField: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    }));
  },

  setFormError: (field, error) => {
    set((state) => ({
      formErrors: { ...state.formErrors, [field]: error },
    }));
  },

  removeFormError: (field) => {
    set((state) => {
      const newErrors = { ...state.formErrors };
      delete newErrors[field];
      return { formErrors: newErrors };
    });
  },

  clearForm: () => {
    set({
      formData: { username: '', email: '', text: '' },
      formErrors: {},
    });
  },

  validateForm: () => {
    const { formData } = get();
    const errors: FormErrors = {};

    if (!formData.username.trim()) errors.username = 'Имя обязательно';
    if (!formData.email.trim()) {
      errors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email не валиден';
    }
    if (!formData.text.trim()) errors.text = 'Текст задачи обязателен';

    set({ formErrors: errors });
    return Object.keys(errors).length === 0;
  },
}));
