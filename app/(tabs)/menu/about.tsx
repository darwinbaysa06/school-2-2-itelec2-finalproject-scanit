import { Link } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function DetailsScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/icon.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Scan It!</Text>
      <Text style={styles.subtitle}>v.0.0.2-alpha (______)</Text>
      <Text style={styles.subtitle}>
        Powered by React Native
        {"\n"}
        Made with 💖 by Darwin Baysa (dp)
        {"\n"}
        {"\n"}A school project made for IT Elective 2
      </Text>
      <View>
        <Link href="https://go.dpg06.top/school-scanit-source" withAnchor>
          <Text style={styles.link}>Source Code 🔗</Text>
        </Link>
        <Link href="https://go.dpg06.top/school-scanit-bugs" withAnchor>
          <Text style={styles.link}>Report Bugs 🔗</Text>
        </Link>
        <Link href="https://go.dpg06.top/school-scanit-homepage" withAnchor>
          <Text style={styles.link}>Homepage 🔗</Text>
        </Link>
      </View>
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
