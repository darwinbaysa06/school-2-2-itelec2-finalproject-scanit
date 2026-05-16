import { scanFromURLAsync } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { SQLiteDatabase } from "expo-sqlite";
import { MutableRefObject } from "react";
import { Alert } from "react-native";

import { handleQRScanned } from "./qrScannerDataHandler";

export const browseFilesHandler = async (
  db: SQLiteDatabase,
  scanLockRef: MutableRefObject<boolean>,
  setQrScannerData: (data: string) => void,
  setQrScanModalVisible: (visible: boolean) => void,
  autoOpenQr: boolean = false,
) => {
  // No permissions request is necessary for launching the image library.
  // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
  // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
  // so the app users aren't surprised by a system dialog after picking a video.
  // See "Invoke permissions for videos" sub section for more details.
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    Alert.alert(
      "Permission required",
      "Permission to access the media library is required.",
    );
    return null;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images", "videos"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (result.canceled || !result.assets?.length) {
    return null;
  }

  try {
    const qrResults = await scanFromURLAsync(result.assets[0].uri, ["qr"]);
    console.log("QR scan results from image:", qrResults);
    if (!qrResults[0]?.raw) {
      Alert.alert("Not a valid QR, try again later");
      return null;
    }

    await handleQRScanned(
      qrResults[0].raw,
      db,
      scanLockRef,
      setQrScannerData,
      setQrScanModalVisible,
      autoOpenQr,
    );

    return qrResults[0].raw;
  } catch (error) {
    console.error("Error scanning QR from image:", error);
    Alert.alert("Not a valid QR, try again later.");
    return null;
  }
};
