import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Href, router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import {
  Alert,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { addHistoryEntry, createHistoryId } from "../../db/database";
import { onShare } from "@/app/functions/shareHandler";
export default function App() {
  const db = useSQLiteContext();
  const [facing, setFacing] = useState<CameraType>("back");
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [qrScanModalVisible, setQrScanModalVisible] = useState(false);
  const [qrScannerData, setQrScannerData] = useState("");

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
  function browseFiles() {
    // Implement file browsing logic here soon.
    ToastAndroid.show("Feature coming soon!", ToastAndroid.SHORT);
  }
  async function handleQRScanned(data: string) {
    setQrScannerData(data);
    await addHistoryEntry(db, {
      id: createHistoryId(),
      qrname: "QR Code",
      qrcontent: data,
    });
    setQrScanModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        enableTorch={torchEnabled}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={(result) => {
          if (qrScanModalVisible) {
            return;
          }

          handleQRScanned(result.data).catch((error) => {
            Alert.alert("Could not save scan", String(error));
          });
        }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <FontAwesome size={28} name="camera" color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleFlash}>
          <FontAwesome size={28} name="flash" color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={browseFiles}>
          <FontAwesome size={28} name="folder" color="white" />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={qrScanModalVisible}
        onRequestClose={() => {
          setQrScanModalVisible(false);
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
                  router.push(qrScannerData as Href);
                  setQrScanModalVisible(false);
                }}
              >
                <Text style={[styles.modalButtonText]}>Open</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonShare]}
                onPress={() => {
                  setQrScanModalVisible(false);
                  onShare(qrScannerData);
                }}
              >
                <Text style={[styles.modalButtonText]}>Share</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonClose]}
                onPress={() => setQrScanModalVisible(false)}
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
