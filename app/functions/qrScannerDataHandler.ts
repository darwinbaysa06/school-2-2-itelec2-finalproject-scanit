import { SQLiteDatabase } from "expo-sqlite";
import { MutableRefObject } from "react";
import {
  addHistoryEntry,
  createHistoryId,
  getNextHistoryQrName,
} from "../../db/database";

export async function handleQRScanned(
  data: string,
  db: SQLiteDatabase,
  scanLockRef: MutableRefObject<boolean>,
  setQrScannerData: (data: string) => void,
  setQrScanModalVisible: (visible: boolean) => void,
) {
  if (scanLockRef.current) {
    return;
  }

  scanLockRef.current = true;
  setQrScannerData(data);
  try {
    const qrname = await getNextHistoryQrName(db);

    await addHistoryEntry(db, {
      id: createHistoryId(),
      qrname,
      qrcontent: data,
    });
    setQrScanModalVisible(true);
  } catch (error) {
    scanLockRef.current = false;
    throw error;
  }
}
