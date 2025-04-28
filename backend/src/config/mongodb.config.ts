import { MongoClient, Collection } from 'mongodb';
import dotenv from 'dotenv';
import { MongoTodoItem } from '../models/types';
import { mockTodoCollection } from './mock-mongodb.config';

dotenv.config();

// If the MongoDB URI is not available or fails, use a local MongoDB instance
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'assignment';
const collectionName = process.env.MONGODB_COLLECTION || 'assignment_';

const client = new MongoClient(uri);

export let todoCollection: Collection<MongoTodoItem>;

export const connectMongoDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    todoCollection = db.collection<MongoTodoItem>(collectionName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // Try connecting to local MongoDB if the original connection fails
    if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb://localhost:27017') {
      console.log('Trying to connect to local MongoDB instance as fallback...');
      const localClient = new MongoClient('mongodb://localhost:27017');
      try {
        await localClient.connect();
        console.log('Connected to local MongoDB');
        const db = localClient.db(dbName);
        todoCollection = db.collection<MongoTodoItem>(collectionName);
      } catch (localError) {
        console.error('Failed to connect to local MongoDB:', localError);
        console.log('Using in-memory mock MongoDB implementation');
        // Type cast to Collection type for MongoDB compatibility
        todoCollection = mockTodoCollection as unknown as Collection<MongoTodoItem>;
      }
    } else {
      console.log('Using in-memory mock MongoDB implementation');
      // Type cast to Collection type for MongoDB compatibility
      todoCollection = mockTodoCollection as unknown as Collection<MongoTodoItem>;
    }
  }
};

export default client;