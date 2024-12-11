import React from "react";
import { View, TextInput } from "react-native";

export default function SearchBar({ searchText, onInput }) {
  return (
    <View className="flex-row items-center bg-gray-300/50 rounded-lg overflow-hidden mx-8 mt-8 mb-6">
      <TextInput
        className="flex-1 px-4 py-4 text-base text-gray-700"
        placeholder="Search for a city"
        placeholderTextColor="#666"
        value={searchText} // 绑定输入值
        onChangeText={onInput} // 监听输入变化
        textAlignVertical="center" // 垂直居中对齐
      />
    </View>
  );
}
