import React, { useState } from "react";
import { View, Text } from "react-native";
import UnitSelector from "../components/UnitSelector";
import DefaultCitySetting from "../components/DefaultCitySetting";

export default function Settings() {
  const [tempUnit, setTempUnit] = useState("C");
  const [defaultCity, setDefaultCity] = useState("Calgary");

  return (
    <View className="flex-1 bg-blue-500/80">
      <View className="p-8 mt-20">
        <Text className="text-3xl font-psemibold mb-8 text-white">Setting</Text>
      </View>
      <View className="p-8">
        <DefaultCitySetting
          defaultCity={defaultCity}
          setDefaultCity={setDefaultCity}
        />
        <UnitSelector tempUnit={tempUnit} setTempUnit={setTempUnit} />
      </View>
    </View>
  );
}
