import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  isVisible: boolean;
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
  onCancel: () => void;
  cancelLabel?: string;
  actionButtonColor?: string;
}

export const ActionAlertModal = ({
  isVisible,
  title,
  message,
  actionLabel,
  onAction,
  onCancel,
  cancelLabel = "Cancel",
  actionButtonColor = "#fa6800",
}: Props) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              style={[styles.button, { backgroundColor: actionButtonColor }]}
              onPress={onAction}
            >
              <Text style={styles.buttonText}>{actionLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  container: {
    width: "90%",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#a7b7de",
    backgroundColor: "#d9e7fb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#102033",
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    color: "#24364a",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#647687",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
});
