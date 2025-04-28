import * as redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  },
  username: process.env.REDIS_USERNAME || 'default',
  password: process.env.REDIS_PASSWORD || ''
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

export const connectRedis = async () => {
  await redisClient.connect();
};

export default redisClient;