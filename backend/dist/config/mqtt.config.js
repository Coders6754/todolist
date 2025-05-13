"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMqtt = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const dotenv_1 = __importDefault(require("dotenv"));
const todo_service_1 = require("../services/todo.service");
dotenv_1.default.config();
const mqttConfig = {
    host: process.env.MQTT_BROKER_URL || 'localhost',
    port: parseInt(process.env.MQTT_PORT || '8883'),
    protocol: 'mqtts',
    rejectUnauthorized: false
};
const addTopic = process.env.MQTT_TOPIC_ADD || '/add';
const connectMqtt = () => {
    const client = mqtt_1.default.connect({
        ...mqttConfig,
        clientId: `mqtt_${Math.random().toString(16).slice(2, 10)}`,
    });
    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe(addTopic, (err) => {
            if (err) {
                console.error('Error subscribing to topic:', err);
            }
            else {
                console.log(`Subscribed to ${addTopic}`);
            }
        });
    });
    client.on('message', async (topic, message) => {
        console.log(`Received message on ${topic}: ${message.toString()}`);
        if (topic === addTopic) {
            try {
                await (0, todo_service_1.processMqttMessage)(message.toString());
            }
            catch (error) {
                console.error('Error processing MQTT message:', error);
            }
        }
    });
    client.on('error', (error) => {
        console.error('MQTT error:', error);
    });
    return client;
};
exports.connectMqtt = connectMqtt;
