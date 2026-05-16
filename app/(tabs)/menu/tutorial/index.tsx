import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const tutorialLinks = [
  {
    label: "How to scan QR code?",
    href: "/(tabs)/menu/tutorial/tutorial-scanqr",
  },
  {
    label: "How to delete scan entries?",
    href: "/(tabs)/menu/tutorial/tutorial-deleteentries",
  },
  {
    label: "How to share scan entries?",
    href: "/(tabs)/menu/tutorial/tutorial-shareentries",
  },
  {
    label: "How to reset the app?",
    href: "/(tabs)/menu/tutorial/tutorial-resetapp",
  },
] as const;

export default function Tab() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {tutorialLinks.map((item) => (
        <Pressable
          key={item.label}
          style={styles.button}
          onPress={() => router.push(item.href)}
        >
          <Text style={styles.buttonText}>{item.label}</Text>
        </Pressable>
      ))}
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
