import React, { useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import UnitSelector from "../components/UnitSelector";
import DefaultCitySetting from "../components/DefaultCitySetting";

export default function Settings() {
  const [tempUnit, setTempUnit] = useState("C");
  const [defaultCity, setDefaultCity] = useState("Calgary");

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-blue-500/80">
        {/* 标题部分 */}
        <View className="p-8 mt-10">
          <Text className="text-3xl font-psemibold text-gray-900">Setting</Text>
        </View>

        {/* 设置选项部分 */}
        <View className="flex-1 p-8">
          <DefaultCitySetting
            defaultCity={defaultCity}
            setDefaultCity={setDefaultCity}
          />
          <UnitSelector tempUnit={tempUnit} setTempUnit={setTempUnit} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
