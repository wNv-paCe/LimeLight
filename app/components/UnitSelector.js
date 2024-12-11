import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTemperatureUnit } from "./TemperatureUnitContext";

export default function UnitSelector() {
  const { tempUnit, toggleUnit } = useTemperatureUnit();

  return (
    <View className="bg-gray-900/70 rounded-lg p-4">
      <Text className="text-xl font-pmedium text-gray-200 mb-4">
        Temperature Unit
      </Text>
      <View className="flex-row rounded-xl overflow-hidden bg-gray-400 mb-4">
        <TouchableOpacity
          onPress={() => toggleUnit("C")}
          className={`flex-1 py-3 px-6 ${
            tempUnit === "C" ? "bg-orange-700" : ""
          }`}
        >
          <Text
            className={`text-center text-lg ${
              tempUnit === "C" ? "text-black" : "text-gray-600"
            }`}
          >
            °C
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleUnit("F")}
          className={`flex-1 py-3 px-6 ${
            tempUnit === "F" ? "bg-orange-700" : ""
          }`}
        >
          <Text
            className={`text-center text-lg ${
              tempUnit === "F" ? "text-black" : "text-gray-600"
            }`}
          >
            °F
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
