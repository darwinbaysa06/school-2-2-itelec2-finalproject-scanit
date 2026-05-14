import { getSetting, upsertSetting } from "@/db/database";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";

export default function Tab() {
  const router = useRouter();
  const [option_doubleTapExit, setOption_doubleTapExit] = useState(true);
  const [option_autoQROpen, setOption_autoQROpen] = useState(false);
  const db = useSQLiteContext();

  useEffect(() => {
    if (!db) return;

    getSetting(db, "doubletapexit")
      .then((v) => {
        if (v !== null) setOption_doubleTapExit(v === "true");
      })
      .catch((e) => console.warn("Error loading doubletapexit", e));

    getSetting(db, "autoopenqr")
      .then((v) => {
        if (v !== null) setOption_autoQROpen(v === "true");
      })
      .catch((e) => console.warn("Error loading autoopenqr", e));
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
            upsertSetting(db, "doubletapexit", val ? "true" : "false").catch(
              (e) => {
                Alert.alert("Error", "Could not save setting");
                console.warn(e);
              },
            );
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
            upsertSetting(db, "autoopenqr", val ? "true" : "false").catch(
              (e) => {
                Alert.alert("Error", "Could not save setting");
                console.warn(e);
              },
            );
          }}
        />
      </View>
      <Pressable
        style={[styles.optionRow, { paddingVertical: 20 }]}
        onPress={() => {
          if (!db) return;
          // reset known settings to defaults
          Promise.all([
            upsertSetting(db, "doubletapexit", "true"),
            upsertSetting(db, "autoopenqr", "false"),
          ])
            .then(() => {
              setOption_doubleTapExit(true);
              setOption_autoQROpen(false);
              Alert.alert("Reset", "Settings reset to defaults");
            })
            .catch((e) => {
              Alert.alert("Error", "Could not reset settings");
              console.warn(e);
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
