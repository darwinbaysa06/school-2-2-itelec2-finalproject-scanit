import { type SQLiteDatabase } from "expo-sqlite";

export type HistoryEntry = {
  id: string;
  qrname: string;
  qrcontent: string;
  created_at: string;
  updated_at: string;
};

export function createHistoryId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );

  let currentDbVersion = result?.user_version ?? 0;
  console.log("Current DB version:", currentDbVersion);
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  // Initial database setup
  if (currentDbVersion === 0) {
    console.log("Migrating to version 1");
    await db.execAsync(`
            PRAGMA journal_mode = 'wal';
            CREATE TABLE IF NOT EXISTS history (
                id TEXT PRIMARY KEY,
                qrname TEXT NOT NULL DEFAULT '',
                qrcontent TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            );
        `);

    currentDbVersion = 1;
  }

  // Update database version
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
