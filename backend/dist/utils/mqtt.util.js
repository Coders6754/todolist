"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishMessage = exports.getMqttClient = void 0;
const mqtt = __importStar(require("mqtt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mqttBroker = process.env.MQTT_BROKER || 'mqtt://broker.emqx.io:1883';
let mqttClient = null;
const getMqttClient = () => {
    if (!mqttClient) {
        mqttClient = mqtt.connect(mqttBroker);
        mqttClient.on('connect', () => {
            console.log('MQTT publisher connected to broker');
        });
        mqttClient.on('error', (error) => {
            console.error('MQTT publisher error:', error);
        });
    }
    return mqttClient;
};
exports.getMqttClient = getMqttClient;
const publishMessage = (topic, message) => {
    return new Promise((resolve, reject) => {
        const client = (0, exports.getMqttClient)();
        client.publish(topic, message, {}, (error) => {
            if (error) {
                console.error(`Error publishing to ${topic}:`, error);
                reject(error);
            }
            else {
                console.log(`Published to ${topic}: ${message}`);
                resolve();
            }
        });
    });
};
exports.publishMessage = publishMessage;
