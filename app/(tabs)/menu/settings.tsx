import {
  loadSettings,
  resetAppDatabase,
  saveSettingsValue,
} from "@/app/functions/settingsHandler";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { showAppAlert, showAppConfirm } from "../../functions/appAlert";

export default function Tab() {
  const [option_doubleTapExit, setOption_doubleTapExit] = useState(true);
  const [option_autoQROpen, setOption_autoQROpen] = useState(false);
  const db = useSQLiteContext();

  useEffect(() => {
    if (!db) return;

    loadSettings(db)
      .then(({ doubleTapExit, autoOpenQr }) => {
        setOption_doubleTapExit(doubleTapExit);
        setOption_autoQROpen(autoOpenQr);
      })
      .catch((e) => console.warn("Error loading settings", e));
  }, [db]);

  return (
    <View style={styles.container}>
      <View style={styles.optionRow}>
        <Text>Double Tap to Exit</Text>
        <Switch
          value={option_doubleTapExit}
          onValueChange={(val) => {
            setOption_doubleTapExit(val);
            if (!db) return;
            saveSettingsValue(db, "doubletapexit", val).catch((e) => {
              showAppAlert("Error", "Could not save setting");
              console.warn(e);
            });
          }}
        />
      </View>
      <View style={styles.optionRow}>
        <Text>Auto Open QR Scanner</Text>
        <Switch
          value={option_autoQROpen}
          onValueChange={(val) => {
            setOption_autoQROpen(val);
            if (!db) return;
            saveSettingsValue(db, "autoopenqr", val).catch((e) => {
              showAppAlert("Error", "Could not save setting");
              console.warn(e);
            });
          }}
        />
      </View>
      <Pressable
        style={[styles.optionRow, { paddingVertical: 20 }]}
        onPress={() => {
          if (!db) return;
          showAppConfirm({
            title: "Reset app",
            message:
              "This will delete all history and settings and restore defaults. Continue?",
            confirmLabel: "Reset",
            onConfirm: async () => {
              try {
                const defaults = await resetAppDatabase(db);

                setOption_doubleTapExit(defaults.doubleTapExit);
                setOption_autoQROpen(defaults.autoOpenQr);

                showAppAlert("Reset", "App has been reset.");
              } catch (e) {
                console.warn("Reset failed", e);
                showAppAlert("Error", "Could not reset database");
              }
            },
          });
        }}
      >
        <Text>Reset app</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    gap: 12,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 1,
    backgroundColor: "#dae8fc",
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 8,
    borderColor: "#399ee0",
    borderWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#dae8fc",
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 8,
    borderColor: "#399ee0",
    borderWidth: 1,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
});
