import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  // Reorder: history (1), index (0), menu (2)
  const order = [1, 0, 2];

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#1ba1e2",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 10,
      }}
    >
      {order.map((index) => {
        const route = state.routes[index];
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{
              alignItems: "center",
              justifyContent: "center",
              ...(index === 0 && {
                marginTop: -20,
                backgroundColor: "green",
                width: 80,
                height: 80,
                borderRadius: 50,
                borderColor: "#fff",
                borderWidth: 2,
              }),
              ...(!(index === 0) && {
                paddingVertical: 8,
                paddingHorizontal: 12,
                minWidth: 50,
              }),
            }}
          >
            {options.tabBarIcon?.(
              index === 0
                ? {
                    focused: isFocused,
                    color: "#000",
                    size: 30,
                  }
                : {
                    focused: isFocused,
                    color: isFocused ? "#000" : "#fff",
                    size: 24,
                  },
            )}
            {
              <Text
                style={{
                  fontSize: index === 0 ? 9 : 10,
                  fontWeight: "600",
                  marginTop: index === 0 ? 2 : 4,
                  color: index === 0 ? "#000" : isFocused ? "#000" : "#fff",
                }}
              >
                {typeof options.tabBarLabel === "string"
                  ? options.tabBarLabel
                  : route.name}
              </Text>
            }
          </Pressable>
        );
      })}
    </View>
  );
}
