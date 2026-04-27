import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Tab() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feature coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
