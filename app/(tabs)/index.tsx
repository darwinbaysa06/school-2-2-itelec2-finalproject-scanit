import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
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

  const onShare = async (shareContent: string) => {
    try {
      const result = await Share.share({
        message: shareContent,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

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
  function handleQRScanned(data: string) {
    // Implement QR code handling logic here soon.
    setQrScannerData(data);
    setQrScanModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        enableTorch={torchEnabled}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={(result) => handleQRScanned(result.data)}
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
                  router.push(qrScannerData);
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
