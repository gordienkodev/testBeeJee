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

interface TaskEditData {
  text: string;
  status: boolean;
  isUpdating: boolean;
  error: string | null;
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
  editingTasks: Record<string, TaskEditData>;

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

  initializeTaskEdit: (taskId: number, task: Task) => void;
  updateTaskEditText: (taskId: number, text: string) => void;
  updateTaskEditStatus: (taskId: number, status: boolean) => void;
  setTaskEditError: (taskId: number, error: string | null) => void;
  setTaskEditUpdating: (taskId: number, isUpdating: boolean) => void;
  saveTaskEdit: (
    taskId: number,
    updateTaskFn: (id: number, data: { text: string; status: boolean }) => Promise<void>
  ) => Promise<{ success: boolean; unauthorized?: boolean }>;
  getTaskEditData: (taskId: number) => TaskEditData | null;
}

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  page: 1,
  sortField: '',
  sortOrder: 'DESC',
  success: false,
  editingTasks: {},

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

  initializeTaskEdit: (taskId, task) => {
    set((state) => ({
      editingTasks: {
        ...state.editingTasks,
        [taskId]: {
          text: task.text,
          status: task.status,
          isUpdating: false,
          error: null,
        },
      },
    }));
  },

  updateTaskEditText: (taskId, text) => {
    set((state) => ({
      editingTasks: {
        ...state.editingTasks,
        [taskId]: {
          ...state.editingTasks[taskId],
          text,
        },
      },
    }));
  },

  updateTaskEditStatus: (taskId, status) => {
    set((state) => ({
      editingTasks: {
        ...state.editingTasks,
        [taskId]: {
          ...state.editingTasks[taskId],
          status,
        },
      },
    }));
  },

  setTaskEditError: (taskId, error) => {
    set((state) => ({
      editingTasks: {
        ...state.editingTasks,
        [taskId]: {
          ...state.editingTasks[taskId],
          error,
        },
      },
    }));
  },

  setTaskEditUpdating: (taskId, isUpdating) => {
    set((state) => ({
      editingTasks: {
        ...state.editingTasks,
        [taskId]: {
          ...state.editingTasks[taskId],
          isUpdating,
        },
      },
    }));
  },

  saveTaskEdit: async (taskId, updateTaskFn) => {
    const state = get();
    const editData = state.editingTasks[taskId];

    if (!editData) {
      return { success: false };
    }

    set((state) => ({
      editingTasks: {
        ...state.editingTasks,
        [taskId]: {
          ...state.editingTasks[taskId],
          isUpdating: true,
          error: null,
        },
      },
    }));

    try {
      await updateTaskFn(taskId, { text: editData.text, status: editData.status });
      await get().fetch();
      return { success: true };
    } catch (error) {
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        return { success: false, unauthorized: true };
      } else {
        set((state) => ({
          editingTasks: {
            ...state.editingTasks,
            [taskId]: {
              ...state.editingTasks[taskId],
              error: 'Не удалось сохранить изменения',
            },
          },
        }));
        console.error('Ошибка при сохранении:', error);
        return { success: false };
      }
    } finally {
      set((state) => ({
        editingTasks: {
          ...state.editingTasks,
          [taskId]: {
            ...state.editingTasks[taskId],
            isUpdating: false,
          },
        },
      }));
    }
  },

  getTaskEditData: (taskId) => {
    const state = get();
    return state.editingTasks[taskId] || null;
  },
}));
