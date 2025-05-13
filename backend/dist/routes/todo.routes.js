"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_controller_1 = require("../controllers/todo.controller");
const router = (0, express_1.Router)();
// Get all tasks
router.get('/fetchAllTasks', todo_controller_1.fetchAllTasks);
// Simulate sending a message to MQTT
router.post('/simulate-mqtt', todo_controller_1.simulateMqttMessage);
// Toggle task completion status
router.put('/tasks/:taskId/toggle', todo_controller_1.handleToggleComplete);
// Delete a task
router.delete('/tasks/:taskId', todo_controller_1.removeTask);
exports.default = router;
