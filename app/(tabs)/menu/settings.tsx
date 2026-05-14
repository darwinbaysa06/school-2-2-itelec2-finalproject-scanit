import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

export default function Tab() {
  const router = useRouter();
  const [option_doubleTapExit, setOption_doubleTapExit] = useState(true);
  const [option_autoQROpen, setOption_autoQROpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.optionRow}>
        <Text>Double Tap to Exit</Text>
        <Switch
          value={option_doubleTapExit}
          onValueChange={setOption_doubleTapExit}
        />
      </View>
      <View style={styles.optionRow}>
        <Text>Auto Open QR Scanner</Text>
        <Switch
          value={option_autoQROpen}
          onValueChange={setOption_autoQROpen}
        />
      </View>
      <Pressable style={[styles.optionRow, { paddingVertical: 20 }]}>
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
