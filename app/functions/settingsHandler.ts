import { getSetting, migrateDbIfNeeded, upsertSetting } from "@/db/database";
import { type SQLiteDatabase } from "expo-sqlite";

export type SettingsState = {
  doubleTapExit: boolean;
  autoOpenQr: boolean;
};

const DEFAULT_SETTINGS: SettingsState = {
  doubleTapExit: true,
  autoOpenQr: false,
};

export async function loadSettings(db: SQLiteDatabase): Promise<SettingsState> {
  const [doubleTapExit, autoOpenQr] = await Promise.all([
    getSetting(db, "doubletapexit"),
    getSetting(db, "autoopenqr"),
  ]);

  return {
    doubleTapExit:
      doubleTapExit !== null
        ? doubleTapExit === "true"
        : DEFAULT_SETTINGS.doubleTapExit,
    autoOpenQr:
      autoOpenQr !== null ? autoOpenQr === "true" : DEFAULT_SETTINGS.autoOpenQr,
  };
}

export async function saveSettingsValue(
  db: SQLiteDatabase,
  settingKey: "doubletapexit" | "autoopenqr",
  value: boolean,
) {
  await upsertSetting(db, settingKey, value ? "true" : "false");
}

export async function resetAppDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    DROP TABLE IF EXISTS history;
    DROP TABLE IF EXISTS settings;
    PRAGMA user_version = 0;
  `);

  await migrateDbIfNeeded(db);

  return DEFAULT_SETTINGS;
}
