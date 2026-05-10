import { Alert, ToastAndroid } from "react-native";
import { deleteHistoryEntry, type HistoryEntry } from "@/db/database";
import { type SQLiteDatabase } from "expo-sqlite";

export const deleteItemHandler = async (
  db: SQLiteDatabase,
  item: HistoryEntry,
) => {
  try {
    await deleteHistoryEntry(db, item.id);
    ToastAndroid.show(`"${item.qrname}" has been deleted.`, ToastAndroid.SHORT);
    return { success: true };
  } catch (error) {
    ToastAndroid.show("Failed to delete item.", ToastAndroid.SHORT);
    console.error(error);
    return { success: false };
  }
};
