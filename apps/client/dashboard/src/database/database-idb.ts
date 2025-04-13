import { type Profile } from "@monyfox/common-data";
import { DatabaseStore, type Database } from "./database";

const DB_NAME = "monyfox";
const DB_STORE_NAMES = {
  profiles: "profiles",
} as const;
const DB_VERSION = 1;

export class DatabaseIDBImpl implements Database {
  private db: IDBDatabase | null = null;

  async init(dbName: string = DB_NAME): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(dbName, DB_VERSION);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onerror = logAndReject("Error opening database", reject, request);
      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore(DB_STORE_NAMES.profiles, { keyPath: "id" });
      };
    });
  }

  public readonly profiles = new DatabaseStoreIDBImpl<Profile>(
    () => this.db,
    DB_STORE_NAMES.profiles,
  );
}

class DatabaseStoreIDBImpl<T> implements DatabaseStore<T> {
  private getDb: () => IDBDatabase | null = () => null;
  private storeName: string;

  constructor(getDb: () => IDBDatabase | null, storeName: string) {
    this.getDb = getDb;
    this.storeName = storeName;
  }

  async getAll(): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      const db = this.getDb();
      if (!db) {
        reject("Database not initialized");
        return;
      }

      const transaction = db.transaction(this.storeName, "readonly");
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = logAndReject(
        `Error getting data from ${this.storeName}`,
        reject,
        request,
      );
    });
  }

  upsert(item: T): Promise<void> {
    const db = this.getDb();
    return new Promise<void>((resolve, reject) => {
      if (!db) {
        reject("Database not initialized");
        return;
      }

      const transaction = db.transaction(this.storeName, "readwrite");
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.put(item);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = logAndReject(
        `Error upserting data to ${this.storeName}`,
        reject,
        request,
      );
    });
  }
  delete(id: string): Promise<void> {
    const db = this.getDb();
    return new Promise<void>((resolve, reject) => {
      if (!db) {
        reject("Database not initialized");
        return;
      }

      const transaction = db.transaction(this.storeName, "readwrite");
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(id);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = logAndReject(
        `Error deleting data from ${this.storeName}`,
        reject,
        request,
      );
    });
  }
}

const logAndReject =
  (message: string, reject: (reason?: any) => void, request: IDBRequest) =>
  () => {
    console.error(message, request.error);
    reject(request.error);
  };
