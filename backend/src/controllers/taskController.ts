import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Task } from '../entity/Task';

const TASKS_PER_PAGE = 3;
const ALLOWED_SORT_FIELDS = ['id', 'username', 'email', 'text', 'status', 'isEdited'] as const;

type SortField = typeof ALLOWED_SORT_FIELDS[number];
type SortOrder = 'ASC' | 'DESC';

interface CreateTaskBody {
    username: string;
    email: string;
    text: string;
}

interface GetTasksQuery {
    page?: string;
    sortField?: string;
    sortOrder?: string;
}

interface ValidationResult {
    valid: boolean;
    error?: string;
}

const validateCreateTask = (username: unknown, email: unknown, text: unknown): ValidationResult => {

    if (!username || !email || !text) {
        return { valid: false, error: 'Missing required fields: username, email, text' };
    }

    if (typeof username !== 'string' || typeof email !== 'string' || typeof text !== 'string') {
        return { valid: false, error: 'Invalid data types' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Invalid email format' };
    }

    if (username.length < 1 || username.length > 50) {
        return { valid: false, error: 'Username must be between 1 and 50 characters' };
    }

    if (text.length < 1 || text.length > 1000) {
        return { valid: false, error: 'Text must be between 1 and 1000 characters' };
    }

    return { valid: true };
};

const validatePagination = (page: number): ValidationResult => {
    if (page < 1) {
        return { valid: false, error: 'Page must be greater than 0' };
    }
    return { valid: true };
};

const getSortParams = (sortField: unknown, sortOrder: unknown): { field: SortField; order: SortOrder } => {
    const field = (typeof sortField === 'string' && ALLOWED_SORT_FIELDS.includes(sortField as SortField))
        ? sortField as SortField
        : 'id';
    const order = (sortOrder === 'DESC' ? 'DESC' : 'ASC') as SortOrder;
    return { field, order };
};

const calculatePagination = (total: number, page: number) => {
    const totalPages = Math.ceil(total / TASKS_PER_PAGE);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    return { totalPages, hasNext, hasPrev };
};

export const createTask = async (req: Request<{}, {}, CreateTaskBody>, res: Response) => {
    try {
        const { username, email, text } = req.body;

        const validation = validateCreateTask(username, email, text);
        if (!validation.valid) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const repo = AppDataSource.getRepository(Task);
        const task = repo.create({ username, email, text });
        await repo.save(task);

        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};

export const getTasks = async (req: Request<{}, {}, {}, GetTasksQuery>, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;

        const pageValidation = validatePagination(page);
        if (!pageValidation.valid) {
            res.status(400).json({ error: pageValidation.error });
            return;
        }

        const take = TASKS_PER_PAGE;
        const skip = (page - 1) * take;
        const { field: sortField, order: sortOrder } = getSortParams(
            req.query.sortField,
            req.query.sortOrder
        );

        const repo = AppDataSource.getRepository(Task);
        const [tasks, total] = await repo.findAndCount({
            skip,
            take,
            order: { [sortField]: sortOrder },
        });

        const { totalPages, hasNext, hasPrev } = calculatePagination(total, page);

        res.json({
            tasks,
            total,
            page,
            totalPages,
            hasNext,
            hasPrev
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

interface UpdateTaskBody {
    text?: string;
    status?: boolean;
    isEdited?: boolean;
}

export const updateTask = async (
    req: Request<{ id: string }, {}, UpdateTaskBody>,
    res: Response
) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid task id' });
            return;
        }

        const { text, status } = req.body;

        const repo = AppDataSource.getRepository(Task);
        const task = await repo.findOneBy({ id });

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        let textChanged = false;

        if (text !== undefined) {
            if (typeof text !== 'string' || text.length < 1 || text.length > 1000) {
                res.status(400).json({ error: 'Invalid text' });
                return;
            }

            if (task.text !== text) {
                task.text = text;
                textChanged = true;
            }
        }

        if (status !== undefined) {
            if (typeof status !== 'boolean') {
                res.status(400).json({ error: 'Invalid status' });
                return;
            }
            task.status = status;
        }

        if (textChanged && !task.isEdited) {
            task.isEdited = true;
        }

        await repo.save(task);
        res.json(task);

    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
};
