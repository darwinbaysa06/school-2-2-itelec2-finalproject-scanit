import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Tab() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => router.push("/(tabs)/menu/settings")}
      >
        <Text style={styles.buttonText}>App Setings</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => router.push("/(tabs)/menu/about")}
      >
        <Text style={styles.buttonText}>About the app</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => router.push("/(tabs)/menu/tutorial")}
      >
        <Text style={styles.buttonText}>Tutorials</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => router.push("https://go.dpg06.top/school-scanit-bugs")}
      >
        <Text style={styles.buttonText}>Report bugs</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    gap: 12,
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
