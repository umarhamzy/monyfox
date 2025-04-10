import { type Profile } from "@monyfox/common-data";
import { type Database } from "./database";

const DB_NAME = "monyfox";
const DB_STORE_NAME = "profiles";
const DB_VERSION = 1;

export class DatabaseIDBImpl implements Database {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onerror = () => {
        reject(request.error);
      };
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
      request.onerror = () => {
        console.error("Error getting profiles", request.error);
        reject(request.error);
      };
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
      request.onerror = () => {
        console.error("Error saving profile", request.error);
        reject(request.error);
      };
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
      request.onerror = () => {
        console.error("Error deleting profile", request.error);
        reject(request.error);
      };
    });
  }
}
