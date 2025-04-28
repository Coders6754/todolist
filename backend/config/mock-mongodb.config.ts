import { Collection, FindCursor, WithId, InsertManyResult, Document } from 'mongodb';
import { MongoTodoItem } from '../models/types';

// In-memory storage for MongoDB
let inMemoryStorage: MongoTodoItem[] = [];

// Create a simple mock FindCursor
class MockFindCursor<T> {
  private documents: T[];

  constructor(docs: T[]) {
    this.documents = [...docs];
  }

  async toArray(): Promise<T[]> {
    return [...this.documents];
  }

  // Basic implementation of required FindCursor methods
  clone(): FindCursor<WithId<T>> {
    return this as unknown as FindCursor<WithId<T>>;
  }

  map(): FindCursor<WithId<T>> {
    return this as unknown as FindCursor<WithId<T>>;
  }

  count(): Promise<number> {
    return Promise.resolve(this.documents.length);
  }

  explain(): Promise<Document> {
    return Promise.resolve({} as Document);
  }
}

// Mock Collection implementation that doesn't extend the actual Collection type
export class MockCollection {
  find(): FindCursor<WithId<MongoTodoItem>> {
    const cursor = new MockFindCursor<MongoTodoItem>(inMemoryStorage);
    return cursor as unknown as FindCursor<WithId<MongoTodoItem>>;
  }

  async insertMany(items: MongoTodoItem[]): Promise<InsertManyResult<MongoTodoItem>> {
    inMemoryStorage = [...inMemoryStorage, ...items];
    
    // Create insertedIds object as required by MongoDB types
    const insertedIds: Record<number, string> = {};
    items.forEach((item, index) => {
      insertedIds[index] = item.id;
    });
    
    return { 
      acknowledged: true, 
      insertedCount: items.length,
      insertedIds
    };
  }

  async insertOne(item: MongoTodoItem) {
    inMemoryStorage.push(item);
    return { 
      acknowledged: true, 
      insertedId: item.id 
    };
  }
}

// Mock collection instance
export const mockTodoCollection = new MockCollection(); 