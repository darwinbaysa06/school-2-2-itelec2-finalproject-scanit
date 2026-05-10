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

export function updateHistoryEntry(db: SQLiteDatabase, entry: HistoryEntry) {
  return db.runAsync(
    `
      UPDATE history
      SET qrname = ?, qrcontent = ?, updated_at = datetime('now')
      WHERE id = ?
    `,
    [entry.qrname, entry.qrcontent, entry.id],
  );
}

export function deleteHistoryEntry(db: SQLiteDatabase, id: string) {
  return db.runAsync(
    `
      DELETE FROM history
      WHERE id = ?
    `,
    [id],
  );
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
export async function addHistoryEntry(
  db: SQLiteDatabase,
  entry: Pick<HistoryEntry, "id" | "qrname" | "qrcontent">,
) {
  await db.runAsync(
    `
      INSERT INTO history (id, qrname, qrcontent)
      VALUES (?, ?, ?)
    `,
    [entry.id, entry.qrname, entry.qrcontent],
  );
}

export async function getHistoryEntries(db: SQLiteDatabase) {
  return db.getAllAsync<HistoryEntry>(`
    SELECT id, qrname, qrcontent, created_at, updated_at
    FROM history
    ORDER BY created_at DESC
  `);
}

export async function getHistoryEntryById(db: SQLiteDatabase, id: string) {
  return db.getFirstAsync<HistoryEntry>(
    `
      SELECT id, qrname, qrcontent, created_at, updated_at
      FROM history
      WHERE id = ?
      LIMIT 1
    `,
    [id],
  );
}
