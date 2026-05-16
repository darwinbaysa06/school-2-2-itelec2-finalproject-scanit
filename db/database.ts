import { type SQLiteDatabase } from "expo-sqlite";

export type HistoryEntry = {
  id: string;
  qrname: string;
  qrcontent: string;
  created_at: string;
  updated_at: string;
};

export type SettingEntry = {
  setting_key: string;
  setting_value: string;
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
      SET qrname = ?, qrcontent = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
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
  const DATABASE_VERSION = 4;

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
              created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
              updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
            );
        `);

    currentDbVersion = 1;
  }

  // Add settings table
  if (currentDbVersion === 1) {
    console.log("Migrating to version 2");
    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS settings (
                setting_key TEXT PRIMARY KEY,
                setting_value TEXT NOT NULL DEFAULT '',
              created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
              updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
            );
            INSERT INTO settings (setting_key, setting_value) VALUES ('doubletapexit', 'true');
            INSERT INTO settings (setting_key, setting_value) VALUES ('autoopenqr', 'false');
        `);

    currentDbVersion = 2;
  }

  // Backfill timestamp columns for older settings tables
  if (currentDbVersion === 2) {
    console.log("Migrating to version 3");
    const settingsColumns = await db.getAllAsync<{ name: string }>(
      "PRAGMA table_info(settings)",
    );
    const columnNames = new Set(settingsColumns.map((column) => column.name));

    if (!columnNames.has("created_at")) {
      await db.execAsync("ALTER TABLE settings ADD COLUMN created_at TEXT;");
    }

    if (!columnNames.has("updated_at")) {
      await db.execAsync("ALTER TABLE settings ADD COLUMN updated_at TEXT;");
    }

    await db.execAsync(`
            UPDATE settings
            SET
          created_at = COALESCE(created_at, strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
          updated_at = COALESCE(updated_at, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));
        `);

    currentDbVersion = 3;
  }

  // Normalize existing timestamps to explicit ISO-8601 UTC strings.
  if (currentDbVersion === 3) {
    console.log("Migrating to version 4");
    await db.execAsync(`
        UPDATE history
        SET
          created_at = CASE
            WHEN created_at IS NULL OR TRIM(created_at) = '' THEN strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
            WHEN created_at LIKE '%Z' OR created_at LIKE '%+__:__' OR created_at LIKE '%-__:__' THEN REPLACE(created_at, ' ', 'T')
            ELSE REPLACE(created_at, ' ', 'T') || 'Z'
          END,
          updated_at = CASE
            WHEN updated_at IS NULL OR TRIM(updated_at) = '' THEN strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
            WHEN updated_at LIKE '%Z' OR updated_at LIKE '%+__:__' OR updated_at LIKE '%-__:__' THEN REPLACE(updated_at, ' ', 'T')
            ELSE REPLACE(updated_at, ' ', 'T') || 'Z'
          END;

        UPDATE settings
        SET
          created_at = CASE
            WHEN created_at IS NULL OR TRIM(created_at) = '' THEN strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
            WHEN created_at LIKE '%Z' OR created_at LIKE '%+__:__' OR created_at LIKE '%-__:__' THEN REPLACE(created_at, ' ', 'T')
            ELSE REPLACE(created_at, ' ', 'T') || 'Z'
          END,
          updated_at = CASE
            WHEN updated_at IS NULL OR TRIM(updated_at) = '' THEN strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
            WHEN updated_at LIKE '%Z' OR updated_at LIKE '%+__:__' OR updated_at LIKE '%-__:__' THEN REPLACE(updated_at, ' ', 'T')
            ELSE REPLACE(updated_at, ' ', 'T') || 'Z'
          END;
      `);

    currentDbVersion = 4;
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

export async function getNextHistoryQrName(db: SQLiteDatabase) {
  const result = await db.getFirstAsync<{ next_index: number }>(`
    SELECT COALESCE(MAX(rowid), 0) + 1 AS next_index
    FROM history
  `);

  return `QR Code ${result?.next_index ?? 1}`;
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

export async function upsertSetting(
  db: SQLiteDatabase,
  settingKey: string,
  settingValue: string,
) {
  await db.runAsync(
    `
      INSERT INTO settings (setting_key, setting_value)
      VALUES (?, ?)
      ON CONFLICT(setting_key)
      DO UPDATE SET
        setting_value = excluded.setting_value,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    `,
    [settingKey, settingValue],
  );
}

export async function getSetting(db: SQLiteDatabase, settingKey: string) {
  const result = await db.getFirstAsync<{ setting_value: string }>(
    `
      SELECT setting_value
      FROM settings
      WHERE setting_key = ?
      LIMIT 1
    `,
    [settingKey],
  );

  return result?.setting_value ?? null;
}

export async function getSettings(db: SQLiteDatabase) {
  return db.getAllAsync<SettingEntry>(`
    SELECT setting_key, setting_value, created_at, updated_at
    FROM settings
    ORDER BY setting_key ASC
  `);
}
