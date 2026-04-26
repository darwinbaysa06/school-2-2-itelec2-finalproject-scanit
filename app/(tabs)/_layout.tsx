import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1ba1e2", // Your desired background color
        },
        headerTintColor: "#fff", // Color for the title and back button
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "blue",
      }}
    >
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="list" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Scan It!",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="qrcode" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="bars" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
