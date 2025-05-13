"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const mongodb_config_1 = require("./config/mongodb.config");
const redis_config_1 = require("./config/redis.config");
const mqtt_config_1 = require("./config/mqtt.config");
dotenv_1.default.config();
const PORT = process.env.PORT || 3001;
// Initialize connections
const initializeConnections = async () => {
    try {
        // Connect to Redis
        try {
            await (0, redis_config_1.connectRedis)();
        }
        catch (redisError) {
            console.error('Warning: Redis connection failed, some features may not work properly:', redisError);
        }
        // Connect to MongoDB - will use fallbacks if needed
        try {
            await (0, mongodb_config_1.connectMongoDB)();
        }
        catch (mongoError) {
            console.error('Warning: All MongoDB connection attempts failed, using limited functionality:', mongoError);
        }
        // Connect to MQTT broker
        try {
            (0, mqtt_config_1.connectMqtt)();
        }
        catch (mqttError) {
            console.error('Warning: MQTT connection failed, message processing will not work:', mqttError);
        }
    }
    catch (error) {
        console.error('Failed to initialize connections:', error);
    }
};
// Initialize connections when the server starts
initializeConnections();
// Start the server
if (process.env.NODE_ENV !== 'production') {
    app_1.default.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
// Export the Express app for Vercel
exports.default = app_1.default;
