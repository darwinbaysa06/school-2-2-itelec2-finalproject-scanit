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
        name="item/[id]"
        options={{
          title: "Scan Details",
        }}
      />
    </Stack>
  );
}
