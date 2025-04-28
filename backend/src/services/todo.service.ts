import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { publishMessage } from '../utils/mqtt.util';
import dotenv from 'dotenv';
import { todoCollection } from '../config/mongodb.config';
import { MongoTodoItem } from '../models/types';

dotenv.config();
const addTopic = process.env.MQTT_TOPIC_ADD || '/add';

export const getAllTodoItems = async (): Promise<MongoTodoItem[]> => {
  try {
    const items = await todoCollection.find().toArray();
    return items;
  } catch (error) {
    console.error('Error getting todo items from MongoDB:', error);
    return [];
  }
};

export const processMqttMessage = async (message: string): Promise<boolean> => {
  try {
    const todoText = message.trim();
    if (!todoText) return false;
    
    const newTodo: MongoTodoItem = {
      id: uuidv4(),
      text: todoText,
      completed: false,
      createdAt: new Date()
    };
    
    await todoCollection.insertOne(newTodo);
    return true;
  } catch (error) {
    console.error('Error processing MQTT message:', error);
    return false;
  }
};

export const toggleComplete = async (taskId: string): Promise<boolean> => {
  try {
    const item = await todoCollection.find().toArray().then(items => 
      items.find(item => item.id === taskId)
    );
    
    if (!item) return false;
    
    const updatedItem = { ...item, completed: !item.completed };
    
    // For the mock implementation, this is a bit hacky but should work
    await deleteTask(taskId);
    await todoCollection.insertOne(updatedItem);
    
    return true;
  } catch (error) {
    console.error('Error toggling task completion:', error);
    return false;
  }
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    const items = await todoCollection.find().toArray();
    const filteredItems = items.filter(item => item.id !== taskId);
    
    // Clear collection and reinsert (for mock implementation compatibility)
    const newItems = await todoCollection.find().toArray();
    for (const item of newItems) {
      await todoCollection.deleteOne({ id: item.id });
    }
    
    if (filteredItems.length > 0) {
      await todoCollection.insertMany(filteredItems);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};

// Controller functions below - keeping for backward compatibility
export const fetchAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await getAllTodoItems();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// export const simulateMqttMessage = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { message } = req.body;
//     if (!message) {
//       res.status(400).json({ error: 'Message is required' });
//       return;
//     }
    
//     // Either publish to MQTT OR process locally, not both
//     if (process.env.USE_MQTT === 'true') {
//       // Use MQTT when explicitly enabled
//       await publishMessage(addTopic, message);
//     } else {
//       // Otherwise process locally
//       await processMqttMessage(message);
//     }
    
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error('Error simulating MQTT message:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

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