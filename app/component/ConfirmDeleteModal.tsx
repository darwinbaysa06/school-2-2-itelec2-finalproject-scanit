// components/ConfirmDeleteModal.tsx
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { type HistoryEntry } from "@/db/database";

interface Props {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  item: HistoryEntry;
  title?: string;
  message?: string;
}

export const ConfirmDeleteModal = ({
  isVisible,
  onConfirm,
  onCancel,
  item,
  title = "Confirm Deletion",
  message = `Are you sure you want to delete "${item.qrname}"? This action cannot be undone.`,
}: Props) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={onConfirm}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: "#DAE8FC",
    borderColor: "#6b85aa",
    borderWidth: 3,
    borderRadius: 12,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  message: { fontSize: 16, marginBottom: 20, color: "#666666" },
  buttonRow: { flexDirection: "row", justifyContent: "center" },
  button: {
    padding: 10,
    marginLeft: 10,
    backgroundColor: "#6e6767",
    borderRadius: 6,
    color: "white",
  },
  cancelText: { color: "white", fontSize: 16 },
  deleteButton: { backgroundColor: "#E51400", borderRadius: 6 },
  deleteText: { color: "white", fontWeight: "640" },
});
