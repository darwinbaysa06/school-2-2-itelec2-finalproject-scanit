import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function DetailsScreen() {
  const navigation: any = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "How to delete scan entries?" });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How to Delete Scan Entries?</Text>
      <Text style={styles.textContent}>
        1. Open the history or scan entries section in the app.
        {"\n"}
        2. Locate the specific scan entry you wish to delete.
        {"\n"}
        3. Tap on the edit entry button (or tap the delete icon if available) to
        reveal the delete option.
        {"\n"}
        4. Confirm the deletion when prompted to permanently remove the scan
        entry from your history.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  link: {
    color: "#3b82f6",
    textDecorationLine: "underline",
    padding: 0,
    margin: 0,
  },
  logo: {
    width: 128,
    height: 128,
  },
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 24,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
  },
  textContent: {
    fontSize: 16,
    color: "#374151",
    textAlign: "left",
    marginTop: 16,
  },
});
