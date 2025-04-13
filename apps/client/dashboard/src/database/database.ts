import { type Profile } from "@monyfox/common-data";

export interface Database {
  init(): Promise<void>;
  profiles: DatabaseStore<Profile>;
}

export interface DatabaseStore<T> {
  getAll(): Promise<T[]>;
  upsert(item: T): Promise<void>;
  delete(id: string): Promise<void>;
}
