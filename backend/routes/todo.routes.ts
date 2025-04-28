import { Router } from 'express';
import {
    fetchAllTasks,
    simulateMqttMessage,
    handleToggleComplete,
    removeTask
} from '../controllers/todo.controller';

const router = Router();

// Get all tasks
router.get('/fetchAllTasks', fetchAllTasks);

// Simulate sending a message to MQTT
router.post('/simulate-mqtt', simulateMqttMessage);

// Toggle task completion status
router.put('/tasks/:taskId/toggle', handleToggleComplete);

// Delete a task
router.delete('/tasks/:taskId', removeTask);

export default router;