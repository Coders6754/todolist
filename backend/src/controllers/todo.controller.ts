import { Request, Response } from 'express';
import {
  getAllTodoItems,
  processMqttMessage,
  toggleComplete,
  deleteTask
} from '../services/todo.service';
import { publishMessage } from '../utils/mqtt.util';
import dotenv from 'dotenv';

dotenv.config();
const addTopic = process.env.MQTT_TOPIC_ADD || '/add';
const useMqtt = process.env.USE_MQTT === 'true';

export const fetchAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await getAllTodoItems();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const simulateMqttMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Either publish to MQTT OR process locally, not both
    if (useMqtt) {
      // Use MQTT when explicitly enabled
      await publishMessage(addTopic, message);
      console.log('Published to MQTT:', message);
    } else {
      // Otherwise process locally
      await processMqttMessage(message);
      console.log('Processed locally:', message);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error simulating MQTT message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const handleToggleComplete = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      res.status(400).json({ error: 'Task ID is required' });
      return;
    }

    const success = await toggleComplete(taskId);

    if (success) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error toggling task completion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      res.status(400).json({ error: 'Task ID is required' });
      return;
    }

    const success = await deleteTask(taskId);

    if (success) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};