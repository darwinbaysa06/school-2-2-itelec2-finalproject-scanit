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
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#1ba1e2", // Your desired background color
        },
      }}
    >
      <Tabs.Screen
        name="history"
        options={{
          headerShown: false,
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
          tabBarLabel: "Scan",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: -33.3, // Adjust this value to move the label up or down
          },
          tabBarIconStyle: {
            marginTop: -30, // Adjust this value to move the icon up or down
            backgroundColor: "green",
            width: 80,
            height: 80,
            borderRadius: 100,
            borderColor: "#fff",
            borderWidth: 1,
            paddingBottom: 14.5,
          },
          tabBarIcon: ({ color }) => (
            <FontAwesome size={30} name="qrcode" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          headerShown: false,
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="bars" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
