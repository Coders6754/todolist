import dotenv from 'dotenv';
import app from './app';
import { connectMongoDB } from './config/mongodb.config';
import { connectRedis } from './config/redis.config';
import { connectMqtt } from './config/mqtt.config';

dotenv.config();

// Initialize connections
const initializeConnections = async () => {
  try {
    // Connect to Redis
    try {
      await connectRedis();
    } catch (redisError) {
      console.error('Warning: Redis connection failed, some features may not work properly:', redisError);
    }

    // Connect to MongoDB - will use fallbacks if needed
    try {
      await connectMongoDB();
    } catch (mongoError) {
      console.error('Warning: All MongoDB connection attempts failed, using limited functionality:', mongoError);
    }

    // Connect to MQTT broker
    try {
      connectMqtt();
    } catch (mqttError) {
      console.error('Warning: MQTT connection failed, message processing will not work:', mqttError);
    }
  } catch (error) {
    console.error('Failed to initialize connections:', error);
  }
};

// Initialize connections when the serverless function starts
initializeConnections();

// Export the Express app for Vercel
export default app;