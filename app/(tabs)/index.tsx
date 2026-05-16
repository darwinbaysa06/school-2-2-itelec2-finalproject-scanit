import { ScannerOverlay } from "@/app/component/ScannerOverlay";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useRef, useState } from "react";
import {
    Alert,
    BackHandler,
    Button,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";

import { browseFilesHandler } from "@/app/functions/browseFilesHandler";
import {
    handleQRScanned,
    qrContentOpenHandler,
} from "@/app/functions/qrScannerDataHandler";
import { loadSettings } from "@/app/functions/settingsHandler";
import { onShare } from "@/app/functions/shareHandler";
export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [qrScanModalVisible, setQrScanModalVisible] = useState(false);
  const [qrScannerData, setQrScannerData] = useState("");
  const [autoOpenQr, setAutoOpenQr] = useState(false);
  const scanLockRef = useRef(false);
  const db = useSQLiteContext();
  const exitTapCountRef = useRef(0);
  const exitTapTimerRef = useRef<NodeJS.Timeout | number | null>(null);

  // Set up back handler for double-tap exit - only when this screen is focused
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android" || !permission?.granted) {
        return;
      }

      // We need to get the latest setting value
      const setupBackHandler = async () => {
        const settings = await loadSettings(db);
        setAutoOpenQr(settings.autoOpenQr);

        if (!settings.doubleTapExit) {
          return;
        }

        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          () => {
            // Increment tap count
            exitTapCountRef.current += 1;

            // Clear existing timer
            if (exitTapTimerRef.current) {
              clearTimeout(exitTapTimerRef.current);
            }

            if (exitTapCountRef.current === 1) {
              // First tap - show message
              ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);

              // Set timer to reset count after 2 seconds
              exitTapTimerRef.current = setTimeout(() => {
                exitTapCountRef.current = 0;
              }, 2000);
            } else if (exitTapCountRef.current >= 2) {
              // Second tap - exit app
              if (exitTapTimerRef.current) {
                clearTimeout(exitTapTimerRef.current);
              }
              exitTapCountRef.current = 0;
              BackHandler.exitApp();
            }

            return true; // Prevent default back behavior
          },
        );

        return () => {
          backHandler.remove();
          if (exitTapTimerRef.current) {
            clearTimeout(exitTapTimerRef.current);
          }
        };
      };

      let cleanup: (() => void) | undefined;
      setupBackHandler().then((cleanupFn) => {
        cleanup = cleanupFn;
      });

      return () => {
        if (cleanup) cleanup();
        exitTapCountRef.current = 0; // Reset counter when leaving this screen
        if (exitTapTimerRef.current) {
          clearTimeout(exitTapTimerRef.current);
        }
      };
    }, [permission?.granted, db]),
  );

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleFlash() {
    setTorchEnabled((current) => !current);
  }

  function dismissQrScanModal() {
    scanLockRef.current = false;
    setQrScanModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          enableTorch={torchEnabled}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={(result) => {
            if (qrScanModalVisible || scanLockRef.current) {
              return;
            }

            handleQRScanned(
              result.raw as any,
              db,
              scanLockRef,
              setQrScannerData,
              setQrScanModalVisible,
              autoOpenQr,
            ).catch((error) => {
              Alert.alert("Could not save scan", String(error));
            });
          }}
        />
        <ScannerOverlay />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <FontAwesome size={28} name="camera" color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleFlash}>
          <FontAwesome size={28} name="flash" color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            browseFilesHandler(
              db,
              scanLockRef,
              setQrScannerData,
              setQrScanModalVisible,
              autoOpenQr,
            )
          }
        >
          <FontAwesome size={28} name="folder" color="white" />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={qrScanModalVisible}
        onRequestClose={() => {
          dismissQrScanModal();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeader}>QR Content:</Text>
            <Text>{qrScannerData}</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonOpen]}
                onPress={() => {
                  dismissQrScanModal();
                  qrContentOpenHandler(qrScannerData);
                }}
              >
                <Text style={[styles.modalButtonText]}>Open</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonShare]}
                onPress={() => {
                  dismissQrScanModal();
                  onShare(qrScannerData);
                }}
              >
                <Text style={[styles.modalButtonText]}>Share</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonClose]}
                onPress={dismissQrScanModal}
              >
                <Text style={[styles.modalButtonText]}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: "90%",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalButtonOpen: {
    backgroundColor: "#60a917",
  },
  modalButtonShare: {
    backgroundColor: "#647687",
  },
  modalButtonClose: {
    backgroundColor: "#fa6800",
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
