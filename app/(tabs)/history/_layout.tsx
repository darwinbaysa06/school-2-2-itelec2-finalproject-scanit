import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function FeedLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1ba1e2" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "History",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "App Settings",
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: "About the app",
        }}
      />
    </Stack>
  );
}
