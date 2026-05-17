import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect, useState, type ReactNode } from "react";
import { migrateDbIfNeeded } from "../../db/database";
import { AppAlertModal } from "../component/AppAlertModal";
import { CustomTabBar } from "../component/CustomTabBar";
import {
  registerAppAlertController,
  type AppAlertConfig,
} from "../functions/appAlert";

function TabsWithAlertHost({ children }: { children: ReactNode }) {
  const [alertConfig, setAlertConfig] = useState<AppAlertConfig | null>(null);

  useEffect(() => {
    registerAppAlertController((nextConfig) => {
      setAlertConfig(nextConfig);
    });

    return () => {
      registerAppAlertController(null);
    };
  }, []);

  return (
    <>
      {children}
      <AppAlertModal
        isVisible={alertConfig !== null}
        title={alertConfig?.title ?? ""}
        message={alertConfig?.message ?? ""}
        actions={alertConfig?.actions ?? []}
        onClose={() => setAlertConfig(null)}
      />
    </>
  );
}

export default function TabLayout() {
  return (
    <SQLiteProvider databaseName="myapp.db" onInit={migrateDbIfNeeded}>
      <TabsWithAlertHost>
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
      </TabsWithAlertHost>
    </SQLiteProvider>
  );
}
