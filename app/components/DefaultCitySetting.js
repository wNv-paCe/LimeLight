import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { ChevronRight } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DefaultCitySetting({ defaultCity, setDefaultCity }) {
  const [isEditing, setIsEditing] = useState(false);

  const saveDefaultCity = async (city) => {
    setDefaultCity(city);
    await AsyncStorage.setItem("defaultCity", city); // 保存到本地存储
  };

  return (
    <View className="bg-gray-900/70  rounded-lg mb-4">
      <TouchableOpacity
        className="flex-row items-center justify-between p-4"
        onPress={() => setIsEditing(!isEditing)}
      >
        <View>
          <Text className="text-xl font-pmedium text-gray-200">
            Default City
          </Text>
          {!isEditing && (
            <Text className="text-base text-gray-200 mt-1">{defaultCity}</Text>
          )}
        </View>
        {!isEditing && <ChevronRight size={20} className="text-gray-400" />}
      </TouchableOpacity>

      {isEditing && (
        <View className="px-4 pb-4">
          <TextInput
            value={defaultCity}
            onChangeText={saveDefaultCity}
            className="border border-gray-400 rounded-lg px-3 py-2 text-gray-200"
            placeholder="Enter city name"
            placeholderTextColor="#666"
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        </View>
      )}
    </View>
  );
}
