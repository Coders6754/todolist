"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTask = exports.fetchAllTasks = exports.deleteTask = exports.toggleComplete = exports.processMqttMessage = exports.getAllTodoItems = void 0;
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_config_1 = require("../config/mongodb.config");
dotenv_1.default.config();
const addTopic = process.env.MQTT_TOPIC_ADD || '/add';
const getAllTodoItems = async () => {
    try {
        const items = await mongodb_config_1.todoCollection.find().toArray();
        return items;
    }
    catch (error) {
        console.error('Error getting todo items from MongoDB:', error);
        return [];
    }
};
exports.getAllTodoItems = getAllTodoItems;
const processMqttMessage = async (message) => {
    try {
        const todoText = message.trim();
        if (!todoText)
            return false;
        const newTodo = {
            id: (0, uuid_1.v4)(),
            text: todoText,
            completed: false,
            createdAt: new Date()
        };
        await mongodb_config_1.todoCollection.insertOne(newTodo);
        return true;
    }
    catch (error) {
        console.error('Error processing MQTT message:', error);
        return false;
    }
};
exports.processMqttMessage = processMqttMessage;
const toggleComplete = async (taskId) => {
    try {
        const item = await mongodb_config_1.todoCollection.find().toArray().then(items => items.find(item => item.id === taskId));
        if (!item)
            return false;
        const updatedItem = { ...item, completed: !item.completed };
        // For the mock implementation, this is a bit hacky but should work
        await (0, exports.deleteTask)(taskId);
        await mongodb_config_1.todoCollection.insertOne(updatedItem);
        return true;
    }
    catch (error) {
        console.error('Error toggling task completion:', error);
        return false;
    }
};
exports.toggleComplete = toggleComplete;
const deleteTask = async (taskId) => {
    try {
        const items = await mongodb_config_1.todoCollection.find().toArray();
        const filteredItems = items.filter(item => item.id !== taskId);
        // Clear collection and reinsert (for mock implementation compatibility)
        const newItems = await mongodb_config_1.todoCollection.find().toArray();
        for (const item of newItems) {
            await mongodb_config_1.todoCollection.deleteOne({ id: item.id });
        }
        if (filteredItems.length > 0) {
            await mongodb_config_1.todoCollection.insertMany(filteredItems);
        }
        return true;
    }
    catch (error) {
        console.error('Error deleting task:', error);
        return false;
    }
};
exports.deleteTask = deleteTask;
// Controller functions below - keeping for backward compatibility
const fetchAllTasks = async (req, res) => {
    try {
        const tasks = await (0, exports.getAllTodoItems)();
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.fetchAllTasks = fetchAllTasks;
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
const removeTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!taskId) {
            res.status(400).json({ error: 'Task ID is required' });
            return;
        }
        const success = await (0, exports.deleteTask)(taskId);
        if (success) {
            res.status(200).json({ success: true });
        }
        else {
            res.status(404).json({ error: 'Task not found' });
        }
    }
    catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.removeTask = removeTask;
