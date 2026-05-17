import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import type { AppAlertAction } from "@/app/functions/appAlert";

interface Props {
  isVisible: boolean;
  title: string;
  message: string;
  actions: AppAlertAction[];
  onClose: () => void;
}

export const AppAlertModal = ({
  isVisible,
  title,
  message,
  actions,
  onClose,
}: Props) => {
  const visibleActions = actions.length > 0 ? actions : [{ label: "OK" }];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View
            style={[
              styles.buttonRow,
              visibleActions.length === 1 && styles.singleButtonRow,
            ]}
          >
            {visibleActions.map((action) => (
              <Pressable
                key={action.label}
                style={[
                  styles.button,
                  visibleActions.length === 1 && styles.singleButton,
                  action.variant === "destructive"
                    ? styles.destructiveButton
                    : styles.defaultButton,
                ]}
                onPress={() => {
                  onClose();
                  action.onPress?.();
                }}
              >
                <Text style={styles.buttonText}>{action.label}</Text>
              </Pressable>
            ))}
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
  singleButtonRow: {
    justifyContent: "flex-end",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  singleButton: {
    flex: 0,
    minWidth: 120,
  },
  defaultButton: {
    backgroundColor: "#647687",
  },
  destructiveButton: {
    backgroundColor: "#E51400",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
});
