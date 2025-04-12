import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { DatabaseIDBImpl } from "./database-idb";
import { type Profile } from "@monyfox/common-data";

const testProfile: Profile = {
  id: "1",
  user: "Test User",
  data: {
    encrypted: false,
    data: {
      accounts: [],
      assetSymbols: [],
      transactions: [],
      lastUpdated: "",
    },
  },
  schemaVersion: "1",
};

describe("initialized", () => {
  const client = new DatabaseIDBImpl();
  const dbName = "test-db";

  beforeEach(async () => {
    await client.init(dbName);
  });

  afterEach(async () => {
    indexedDB.deleteDatabase(dbName);
  });

  test("should initialize the database", async () => {
    expect(client).toBeDefined();
  });

  test("should get profiles", async () => {
    const profiles = await client.getProfiles();
    expect(profiles).toEqual([]);
  });

  test("should add a profile", async () => {
    await client.saveProfile(testProfile);
    const profiles = await client.getProfiles();
    expect(profiles).toEqual([testProfile]);
  });

  test("should update a profile", async () => {
    await client.saveProfile(testProfile);
    const updatedProfile: Profile = {
      ...testProfile,
      user: "Updated User",
    };
    await client.saveProfile(updatedProfile);
    const profiles = await client.getProfiles();
    expect(profiles).toEqual([updatedProfile]);
  });

  test("should delete a profile", async () => {
    await client.saveProfile(testProfile);

    let profiles = await client.getProfiles();
    expect(profiles).toEqual([testProfile]);

    await client.deleteProfile(testProfile.id);

    profiles = await client.getProfiles();
    expect(profiles).toEqual([]);
  });
});

describe("uninitialized", () => {
  const client = new DatabaseIDBImpl();

  test("should throw an error when getting profiles", async () => {
    await expect(client.getProfiles()).rejects.toThrow(
      "Database not initialized",
    );
  });

  test("should throw an error when saving a profile", async () => {
    await expect(client.saveProfile(testProfile)).rejects.toThrow(
      "Database not initialized",
    );
  });

  test("should throw an error when deleting a profile", async () => {
    await expect(client.deleteProfile(testProfile.id)).rejects.toThrow(
      "Database not initialized",
    );
  });
});
