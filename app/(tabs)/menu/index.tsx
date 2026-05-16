import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
export default function Tab() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => router.push("/(tabs)/menu/settings")}
      >
        <FontAwesome6 size={20} name="gear" color="black" />
        <Text style={styles.buttonText}>App Settings</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => router.push("/(tabs)/menu/about")}
      >
        <FontAwesome6 size={20} name="circle-info" color="black" />
        <Text style={styles.buttonText}>About the app</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => router.push("/(tabs)/menu/tutorial")}
      >
        <FontAwesome6 size={20} name="graduation-cap" color="black" />
        <Text style={styles.buttonText}>Tutorials</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => {
          Linking.openURL("https://go.dpg06.top/school-scanit-bugs").catch(
            () => {},
          );
        }}
      >
        <FontAwesome6 size={20} name="bug" color="black" />
        <Text style={styles.buttonText}>Report bugs</Text>
        <FontAwesome6
          size={16}
          name="arrow-up-right-from-square"
          color="black"
        />
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
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
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
