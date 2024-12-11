import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { Cloud } from "lucide-react-native";
import { useTemperatureUnit } from "./TemperatureUnitContext";

// OpenWeatherMap API icons
function getWeatherIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export default function Hourly({ hourlyData }) {
  const { tempUnit } = useTemperatureUnit(); // Get the temperature unit

  if (!hourlyData) {
    return <Text className="text-gray-500">Loading hourly data...</Text>;
  }

  const limitedData = hourlyData.slice(0, 10);

  // Convert temperature to Celsius or Fahrenheit
  const convertTemperature = (tempInCelsius) => {
    return tempUnit === "F"
      ? Math.round((tempInCelsius * 9) / 5 + 32) // Celsius to Fahrenheit
      : Math.round(tempInCelsius); // Celsius
  };

  const HourlyItem = ({ data }) => {
    const weatherIconUrl = getWeatherIcon(data.icon);

    return (
      <View className="w-20 items-center py-4 gap-2 bg-gray-400/30 rounded-xl">
        <Text className="text-white text-base mb-2">{data.time}</Text>
        <Image
          source={{ uri: weatherIconUrl }}
          style={{ width: 40, height: 40 }}
          className="mb-2"
        />
        <Text className="text-white text-2xl mb-1">
          {convertTemperature(data.temp)}°
        </Text>
        <Text className="text-white text-sm mb-2">
          Feels {convertTemperature(data.feelsLike)}°
        </Text>
        <View className="flex-row items-center">
          <Cloud size={16} color="white" />
          <Text className="text-white text-sm ml-1">{data.precipitation}%</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="px-4 mb-4">
      <Text className="text-xl font-psemibold text-black">Hourly</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
      >
        {limitedData.map((data, index) => (
          <View key={index} className="mr-1">
            <HourlyItem key={index} data={data} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
