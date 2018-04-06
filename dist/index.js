"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateId = exports.getCollection = exports.getDatabase = exports.disconnect = exports.connect = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _mongodb = require("mongodb");

let client;
let db;
/**
 * Connects to database using info defined in environment variables (MONGO_URL,
 * MONGO_DATABASE, MONGO_SSL, MONGO_SSL_VALIDATE).
 *
 * @async
 * @function connect
 */

const connect = async () => {
  if (!client) {
    // Connect to MongoDB server.
    client = await _mongodb.MongoClient.connect(process.env.MONGO_URL, {
      ssl: process.env.MONGO_SSL === "true" || false,
      sslValidate: process.env.MONGO_SSL_VALIDATE === "true" || false
    }); // Get database.

    db = client.db(process.env.MONGO_DATABASE);
  }
};
/**
 * Disconnects from database.
 *
 * @async
 * @function disconnect
 */


exports.connect = connect;

const disconnect = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};
/**
 * Disconnects from database.
 *
 * @function getDatabase
 * @return {Db} MongoDB instance of the Db class.
 */


exports.disconnect = disconnect;

const getDatabase = () => {
  if (!client) {
    throw new Error("Not connected to database");
  }

  return db;
};
/**
 * Gets collection.
 *
 * @function getCollection
 * @return {Collection<TSchema>} MongoDB instance of the Collection class.
 */


exports.getDatabase = getDatabase;

const getCollection = collectionName => {
  if (!client) {
    throw new Error("Not connected to database");
  } // Get collection.


  return db.collection(collectionName);
};
/**
 * Generates Mongo ID string compatible with Meteor Mongo IDs.
 *
 * @function generateId
 * @param {number} charsCount - Length of the Mongo ID string.
 * @return {string} Mongo ID string compatible with Meteor Mongo ID.
 */


exports.getCollection = getCollection;

const generateId = (charsCount = 17) => {
  const CHARS = "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz";
  const digits = [];

  for (let i = 0; i < charsCount; i++) {
    let bytes;

    try {
      bytes = _crypto.default.randomBytes(4);
    } catch (e) {
      bytes = _crypto.default.pseudoRandomBytes(4);
    }

    const hexString = bytes.toString("hex").substring(0, 8);
    const fraction = parseInt(hexString, 16) * 2.3283064365386963e-10;
    const index = Math.floor(fraction * CHARS.length);
    digits[i] = CHARS.substr(index, 1);
  }

  return digits.join("");
};

exports.generateId = generateId;