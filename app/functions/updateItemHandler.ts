import { ToastAndroid } from "react-native";
import { updateHistoryEntry, type HistoryEntry } from "@/db/database";
import { type SQLiteDatabase } from "expo-sqlite";

export const updateItemHandler = async (
  db: SQLiteDatabase,
  item: HistoryEntry,
) => {
  try {
    await updateHistoryEntry(db, item);
    ToastAndroid.show(`"${item.qrname}" has been updated.`, ToastAndroid.SHORT);
    return { success: true };
  } catch (error) {
    ToastAndroid.show("Failed to update item.", ToastAndroid.SHORT);
    console.error(error);
    return { success: false };
  }
};
