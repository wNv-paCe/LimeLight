import { Tabs, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const segments = useSegments();
  console.log("Current segment:", segments);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 120, // 设置导航栏高度
          position: "absolute", // 绝对定位
          borderTopWidth: 0, // 移除顶部边框
          paddingTop: 15, // 设置顶部内边距
          elevation: 0,
          backgroundColor: "#3B82F6",
        },
        tabBarLabelStyle: {
          fontSize: 14, // 设置标签文字大小
        },
        tabBarIconStyle: {
          marginBottom: 2, // 调整图标与文字的间距
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "white",
      }}
    >
      {/* Weather Tab */}
      <Tabs.Screen
        name="weather"
        options={{
          title: "Weather",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cloud" color={color} size={size} />
          ),
        }}
      />

      {/* Cities Tab */}
      <Tabs.Screen
        name="cities"
        options={{
          title: "Cities",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location" color={color} size={size} />
          ),
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Setting",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
