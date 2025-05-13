"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTask = exports.handleToggleComplete = exports.simulateMqttMessage = exports.fetchAllTasks = void 0;
const todo_service_1 = require("../services/todo.service");
const mqtt_util_1 = require("../utils/mqtt.util");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const addTopic = process.env.MQTT_TOPIC_ADD || '/add';
const useMqtt = process.env.USE_MQTT === 'true';
const fetchAllTasks = async (req, res) => {
    try {
        const tasks = await (0, todo_service_1.getAllTodoItems)();
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.fetchAllTasks = fetchAllTasks;
const simulateMqttMessage = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }
        // Either publish to MQTT OR process locally, not both
        if (useMqtt) {
            // Use MQTT when explicitly enabled
            await (0, mqtt_util_1.publishMessage)(addTopic, message);
            console.log('Published to MQTT:', message);
        }
        else {
            // Otherwise process locally
            await (0, todo_service_1.processMqttMessage)(message);
            console.log('Processed locally:', message);
        }
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('Error simulating MQTT message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.simulateMqttMessage = simulateMqttMessage;
const handleToggleComplete = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!taskId) {
            res.status(400).json({ error: 'Task ID is required' });
            return;
        }
        const success = await (0, todo_service_1.toggleComplete)(taskId);
        if (success) {
            res.status(200).json({ success: true });
        }
        else {
            res.status(404).json({ error: 'Task not found' });
        }
    }
    catch (error) {
        console.error('Error toggling task completion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.handleToggleComplete = handleToggleComplete;
const removeTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!taskId) {
            res.status(400).json({ error: 'Task ID is required' });
            return;
        }
        const success = await (0, todo_service_1.deleteTask)(taskId);
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
