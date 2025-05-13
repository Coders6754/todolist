"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDB = exports.todoCollection = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const mock_mongodb_config_1 = require("./mock-mongodb.config");
dotenv_1.default.config();
// MongoDB configuration
const dbName = process.env.MONGODB_DB || 'assignment';
const collectionName = process.env.MONGODB_COLLECTION || 'assignment_';
// MongoDB connection options
const options = {
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
const connectMongoDB = async () => {
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
            const atlasClient = new mongodb_1.MongoClient(fullUri, options);
            await atlasClient.connect();
            console.log('Connected to MongoDB Atlas');
            const db = atlasClient.db(dbName);
            exports.todoCollection = db.collection(collectionName);
            // Verify connection by performing a simple operation
            await exports.todoCollection.findOne({});
            console.log('MongoDB connection verified');
        }
        else {
            console.log('No MongoDB Atlas URI provided, using in-memory mock');
            exports.todoCollection = mock_mongodb_config_1.mockTodoCollection;
        }
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        console.log('Falling back to in-memory mock MongoDB implementation');
        exports.todoCollection = mock_mongodb_config_1.mockTodoCollection;
    }
};
exports.connectMongoDB = connectMongoDB;
// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        if (exports.todoCollection !== mock_mongodb_config_1.mockTodoCollection) {
            const client = exports.todoCollection.s.db.client;
            await client.close();
            console.log('MongoDB connection closed');
        }
        process.exit(0);
    }
    catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
});
