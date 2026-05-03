import { Image, StyleSheet, Text, View } from "react-native";

export default function DetailsScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../../assets/images/icon.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>How to Scan a QR Code</Text>
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
    justifyContent: "center",
    alignItems: "center",
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
});
