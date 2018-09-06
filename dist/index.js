"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const mongodb_1 = require("mongodb");
let client = null;
let db = null;
const connect = async () => {
    if (!client) {
        // Connect to MongoDB server.
        if (!process.env.MONGO_URL) {
            throw new Error(`The "MONGO_URL" environment variable not defined`);
        }
        client = await mongodb_1.MongoClient.connect(process.env.MONGO_URL, {
            ssl: process.env.MONGO_SSL === "true" || false,
            sslValidate: process.env.MONGO_SSL_VALIDATE === "true" || false,
        });
        // Get database.
        db = client.db(process.env.MONGO_DATABASE);
    }
};
exports.connect = connect;
const disconnect = async () => {
    if (client) {
        await client.close();
        client = null;
        db = null;
    }
};
exports.disconnect = disconnect;
const getDatabase = async () => {
    if (!client) {
        await connect();
    }
    return Promise.resolve(db);
};
exports.getDatabase = getDatabase;
const getCollection = async (collectionName) => {
    if (!client) {
        await connect();
    }
    // Get collection.
    return Promise.resolve(db && db.collection(collectionName));
};
exports.getCollection = getCollection;
const generateId = (charsCount = 17) => {
    const CHARS = "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz";
    const digits = [];
    for (let i = 0; i < charsCount; i++) {
        let bytes;
        try {
            bytes = crypto_1.randomBytes(4);
        }
        catch (e) {
            bytes = crypto_1.pseudoRandomBytes(4);
        }
        const hexString = bytes.toString("hex").substring(0, 8);
        const fraction = parseInt(hexString, 16) * 2.3283064365386963e-10;
        const index = Math.floor(fraction * CHARS.length);
        digits[i] = CHARS.substr(index, 1);
    }
    return digits.join("");
};
exports.generateId = generateId;
