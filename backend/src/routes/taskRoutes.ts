import { Router } from 'express';
import { createTask, getTasks } from '../controller/taskController';

const router = Router();

router.get('/tasks', getTasks);
router.post('/tasks', createTask);

export default router;
