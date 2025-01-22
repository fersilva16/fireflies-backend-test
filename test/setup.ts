import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeAll, beforeEach, afterAll } from 'vitest';

interface GlobalThis {
  __MONGOD__?: MongoMemoryServer;
}

declare const globalThis: GlobalThis;

beforeAll(async () => {
  const mongod = await MongoMemoryServer.create();

  globalThis.__MONGOD__ = mongod;

  await mongoose.connect(mongod.getUri());
});

beforeEach(async () => {
  for (const connection of mongoose.connections) {
    if (connection.db) {
      await connection.db.dropDatabase();
    }
  }
});

afterAll(async () => {
  if (globalThis.__MONGOD__) {
    await globalThis.__MONGOD__.stop();
  }
});
