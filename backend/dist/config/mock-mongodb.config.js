"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockTodoCollection = exports.MockCollection = void 0;
// In-memory storage for MongoDB
let inMemoryStorage = [];
// Create a simple mock FindCursor
class MockFindCursor {
    constructor(docs) {
        this.documents = [...docs];
    }
    async toArray() {
        return [...this.documents];
    }
    // Basic implementation of required FindCursor methods
    clone() {
        return this;
    }
    map() {
        return this;
    }
    count() {
        return Promise.resolve(this.documents.length);
    }
    explain() {
        return Promise.resolve({});
    }
}
// Mock Collection implementation that doesn't extend the actual Collection type
class MockCollection {
    find() {
        const cursor = new MockFindCursor(inMemoryStorage);
        return cursor;
    }
    async insertMany(items) {
        inMemoryStorage = [...inMemoryStorage, ...items];
        // Create insertedIds object as required by MongoDB types
        const insertedIds = {};
        items.forEach((item, index) => {
            insertedIds[index] = item.id;
        });
        return {
            acknowledged: true,
            insertedCount: items.length,
            insertedIds
        };
    }
    async insertOne(item) {
        inMemoryStorage.push(item);
        return {
            acknowledged: true,
            insertedId: item.id
        };
    }
}
exports.MockCollection = MockCollection;
// Mock collection instance
exports.mockTodoCollection = new MockCollection();
