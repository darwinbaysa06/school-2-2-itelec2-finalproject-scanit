import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function DetailsScreen() {
  const navigation: any = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "How to reset the app?" });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How to Reset App?</Text>
      <Text style={styles.textContent}>
        1. Open the app and navigate to the Menu tab.
        {"\n"}
        2. Open Settings menu and find the Reset App option.
        {"\n"}
        3. Tap on the Reset App option to initiate the reset process.
        {"\n"}
        4. Confirm the reset action when prompted to permanently clear all app
        data and restore the app to its default settings.
        {"\n"}
        5. After confirming, the app will reset and entries will be cleared from
        the history.
        {"\n"}
        6. You can start using the app again with a fresh slate, and all
        previous scan entries will be removed from the history.
      </Text>
      <Text style={styles.subtitle}>
        Please note that resetting the app will permanently delete all your scan
        entries and cannot be undone. Make sure to back up any important data
        before proceeding with the reset.
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
