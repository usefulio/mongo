import { randomBytes, pseudoRandomBytes } from "crypto";
import { Collection, Db, MongoClient } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

const connect = async () => {
  if (!client) {
    // Connect to MongoDB server.
    if (!process.env.MONGO_URL) {
      throw new Error(`The "MONGO_URL" environment variable not defined`);
    }
    client = await MongoClient.connect(
      process.env.MONGO_URL,
      {
        ssl: process.env.MONGO_SSL === "true" || false,
        sslValidate: process.env.MONGO_SSL_VALIDATE === "true" || false,
      },
    );
    // Get database.
    db = client.db(process.env.MONGO_DATABASE);
  }
};

const disconnect = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};

const getDatabase = async (): Promise<Db | null> => {
  if (!client) {
    await connect();
  }
  return Promise.resolve(db);
};

const getCollection = async (
  collectionName: string,
): Promise<Collection | null> => {
  if (!client) {
    await connect();
  }
  // Get collection.
  return Promise.resolve(db && db.collection(collectionName));
};

const generateId = (charsCount: number = 17): string => {
  const CHARS: string =
    "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz";
  const digits: Array<string> = [];
  for (let i: number = 0; i < charsCount; i++) {
    let bytes: Buffer;
    try {
      bytes = randomBytes(4);
    } catch (e) {
      bytes = pseudoRandomBytes(4);
    }
    const hexString: string = bytes.toString("hex").substring(0, 8);
    const fraction: number = parseInt(hexString, 16) * 2.3283064365386963e-10;
    const index: number = Math.floor(fraction * CHARS.length);
    digits[i] = CHARS.substr(index, 1);
  }
  return digits.join("");
};

export { connect, disconnect, getDatabase, getCollection, generateId };
