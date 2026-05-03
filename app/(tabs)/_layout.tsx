import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { migrateDbIfNeeded } from "../../db/database";

export default function TabLayout() {
  return (
    <SQLiteProvider databaseName="myapp.db" onInit={migrateDbIfNeeded}>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1ba1e2",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: "#1ba1e2",
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
              marginTop: -33.3,
            },
            tabBarIconStyle: {
              marginTop: -30,
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
    </SQLiteProvider>
  );
}
