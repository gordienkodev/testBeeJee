import { Router } from 'express';
import { createTask, getTasks, updateTask } from '../controllers/taskController';

const router = Router();

router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.patch('/tasks/:id', updateTask);

export default router;
