import { type Profile } from "@monyfox/common-data";
import { type Database } from "./database";

const DB_NAME = "monyfox";
const DB_STORE_NAME = "profiles";
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
      request.onerror = this.logAndReject(
        "Error opening database",
        reject,
        request,
      );
      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore(DB_STORE_NAME, { keyPath: "id" });
      };
    });
  }

  async getProfiles(): Promise<Profile[]> {
    return new Promise<Profile[]>((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(DB_STORE_NAME, "readonly");
      const objectStore = transaction.objectStore(DB_STORE_NAME);
      const request = objectStore.getAll();
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = this.logAndReject(
        "Error getting profile",
        reject,
        request,
      );
    });
  }

  async saveProfile(profile: Profile): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(DB_STORE_NAME, "readwrite");
      const objectStore = transaction.objectStore(DB_STORE_NAME);
      const request = objectStore.put(profile);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = this.logAndReject(
        "Error saving profile",
        reject,
        request,
      );
    });
  }

  async deleteProfile(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(DB_STORE_NAME, "readwrite");
      const objectStore = transaction.objectStore(DB_STORE_NAME);
      const request = objectStore.delete(id);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = this.logAndReject(
        "Error deleting profile",
        reject,
        request,
      );
    });
  }

  private logAndReject =
    (message: string, reject: (reason?: any) => void, request: IDBRequest) =>
    () => {
      console.error(message, request.error);
      reject(request.error);
    };
}
