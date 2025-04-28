import { MongoClient, Collection, MongoClientOptions } from 'mongodb';
import dotenv from 'dotenv';
import { MongoTodoItem } from '../models/types';
import { mockTodoCollection } from './mock-mongodb.config';

dotenv.config();

// MongoDB configuration
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'assignment';
const collectionName = process.env.MONGODB_COLLECTION || 'assignment_';

// MongoDB connection options
const options: MongoClientOptions = {
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  retryWrites: true,
  w: 'majority' as const,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 1,
};

const client = new MongoClient(uri, options);

export let todoCollection: Collection<MongoTodoItem>;

export const connectMongoDB = async () => {
  try {
    // Try to connect to MongoDB Atlas first
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb+srv://')) {
      console.log('Attempting to connect to MongoDB Atlas...');
      console.log('Using URI:', process.env.MONGODB_URI.replace(/\/\/[^@]+@/, '//****:****@'));
      
      await client.connect();
      console.log('Connected to MongoDB Atlas');
      
      const db = client.db(dbName);
      todoCollection = db.collection<MongoTodoItem>(collectionName);
      
      // Verify connection by performing a simple operation
      await todoCollection.findOne({});
      console.log('MongoDB connection verified');
    } else {
      console.log('No MongoDB Atlas URI provided, using in-memory mock');
      todoCollection = mockTodoCollection as unknown as Collection<MongoTodoItem>;
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    console.log('Falling back to in-memory mock MongoDB implementation');
    todoCollection = mockTodoCollection as unknown as Collection<MongoTodoItem>;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

export default client;