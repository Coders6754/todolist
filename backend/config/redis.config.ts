import * as redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: redis.RedisClientType | null = null;

// Only create Redis client if REDIS_ENABLED is true
if (process.env.REDIS_ENABLED === 'true') {
  if (process.env.REDIS_URL) {
    // Use the full Redis URL if provided
    redisClient = redis.createClient({
      url: process.env.REDIS_URL,
      socket: {
        tls: process.env.REDIS_TLS === 'true',
        rejectUnauthorized: false
      }
    });
  } else {
    // Fallback to individual connection parameters
    redisClient = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        tls: process.env.REDIS_TLS === 'true',
        rejectUnauthorized: false
      },
      username: process.env.REDIS_USERNAME || 'default',
      password: process.env.REDIS_PASSWORD || ''
    });
  }

  redisClient.on('error', (err) => {
    console.error('Redis error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });
}

export const connectRedis = async () => {
  if (redisClient) {
    await redisClient.connect();
  } else {
    console.log('Redis is disabled, skipping connection');
  }
};

export default redisClient;