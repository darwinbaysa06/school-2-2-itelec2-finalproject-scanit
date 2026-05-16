import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { migrateDbIfNeeded } from "../../db/database";
import { CustomTabBar } from "../component/CustomTabBar";

export default function TabLayout() {
  return (
    <SQLiteProvider databaseName="myapp.db" onInit={migrateDbIfNeeded}>
      <Tabs
        initialRouteName="index"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1ba1e2",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Scan It!",
            tabBarLabel: "Scan",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={30} name="qrcode" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            headerShown: false,
            title: "History",
            tabBarLabel: "History",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="list" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            headerShown: false,
            title: "Menu",
            tabBarLabel: "Menu",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="bars" color={color} />
            ),
          }}
        />
      </Tabs>
    </SQLiteProvider>
  );
}
