import { Collection, Db } from "mongodb";
declare const connect: () => Promise<void>;
declare const disconnect: () => Promise<void>;
declare const getDatabase: () => Promise<Db | null>;
declare const getCollection: (collectionName: string) => Promise<Collection<any> | null>;
declare const generateId: (charsCount?: number) => string;
export { connect, disconnect, getDatabase, getCollection, generateId };
