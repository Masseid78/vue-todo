import express from 'express';
import { 
  getAllTasks, 
  getTask, 
  createTask, 
  updateTask, 
  toggleTask, 
  deleteTask, 
  deleteAllTasks 
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getAllTasks);
router.get('/:id', getTask);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/toggle', toggleTask);
router.delete('/:id', deleteTask);
router.delete('/', deleteAllTasks);

export default router; 