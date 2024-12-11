import React from "react";
import { FlatList, View, Text } from "react-native";
import CityItem from "./CityItem";

export default function CityList({ cities, onRemoveCity, onCityPress }) {
  return (
    <FlatList
      data={cities}
      keyExtractor={(item) => `${item.cityName}-${item.provinceName}`}
      renderItem={({ item }) => (
        <CityItem
          cityName={item.cityName}
          provinceName={item.provinceName}
          onRemoveCity={() => onRemoveCity(item.cityName)}
          onPress={() => onCityPress(item.cityName)}
        />
      )}
      ListEmptyComponent={
        <View className="items-center mt-10">
          <Text className="text-gray-500 text-lg">No cities found.</Text>
        </View>
      }
    />
  );
}
