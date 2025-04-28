import { MongoClient, Collection, MongoClientOptions } from 'mongodb';
import dotenv from 'dotenv';
import { MongoTodoItem } from '../models/types';
import { mockTodoCollection } from './mock-mongodb.config';

dotenv.config();

// MongoDB configuration
const dbName = process.env.MONGODB_DB || 'assignment';
const collectionName = process.env.MONGODB_COLLECTION || 'assignment_';

// MongoDB connection options
const options: MongoClientOptions = {
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 1,
  directConnection: false,
  replicaSet: 'atlas-9mpbwv-shard-0',
};

export let todoCollection: Collection<MongoTodoItem>;

export const connectMongoDB = async () => {
  try {
    // Try to connect to MongoDB Atlas first
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb+srv://')) {
      console.log('Attempting to connect to MongoDB Atlas...');
      
      // Construct the full URI with database name and options
      const baseUri = process.env.MONGODB_URI.endsWith('/') 
        ? process.env.MONGODB_URI.slice(0, -1)
        : process.env.MONGODB_URI;
      
      const fullUri = `${baseUri}/${dbName}?retryWrites=true&w=majority`;
      console.log('Using URI:', fullUri.replace(/\/\/[^@]+@/, '//****:****@'));
      
      const atlasClient = new MongoClient(fullUri, options);
      await atlasClient.connect();
      console.log('Connected to MongoDB Atlas');
      
      const db = atlasClient.db(dbName);
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
    if (todoCollection !== mockTodoCollection) {
      const client = (todoCollection as any).s.db.client;
      await client.close();
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});