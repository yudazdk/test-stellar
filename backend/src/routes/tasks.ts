import express from 'express';
import { getTasks, createTask, updateTask, deleteTask, getTaskById } from '../controllers/taskController';
import { authenticate } from '../middleware/auth';
import { validateTaskCreate, validateTaskUpdate, validateTaskIdParam } from '../middleware/validateTask';

const router = express.Router();

router.get('/', authenticate, getTasks);
router.get('/:id', authenticate, getTaskById);
router.post('/', authenticate, validateTaskCreate, createTask);
router.put('/:id', authenticate, validateTaskIdParam, validateTaskUpdate, updateTask);
router.delete('/:id', authenticate, deleteTask);

export default router;

