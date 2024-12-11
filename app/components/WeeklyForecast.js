import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { Cloud } from "lucide-react-native";
import { useTemperatureUnit } from "./TemperatureUnitContext";

// OpenWeatherMap API icons
function getWeatherIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export default function WeeklyForecast({ weeklyData }) {
  const { tempUnit } = useTemperatureUnit(); // Get the temperature unit

  if (!weeklyData || weeklyData.length === 0) {
    return (
      <View className="px-4">
        <Text className="text-xl text-gray-500">No data available</Text>
      </View>
    );
  }

  // Convert temperature to the selected unit
  const convertTemperature = (tempInCelsius) => {
    return tempUnit === "F"
      ? Math.round((tempInCelsius * 9) / 5 + 32) // Convert to Fahrenheit
      : Math.round(tempInCelsius); // Keep it in Celsius
  };

  const ForecastCard = ({ data }) => {
    const weatherIconUrl = getWeatherIcon(data.icon);
    return (
      <View className="w-20 bg-gray-400/30 rounded-xl p-4 gap-1 items-center">
        <View className="items-center mb-2">
          <Text className="text-white text-base">
            {new Date(data.date).toLocaleDateString("en-US", {
              weekday: "short",
            })}
          </Text>
          <Text className="text-white text-sm">
            {new Date(data.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
        <Image
          source={{ uri: weatherIconUrl }}
          style={{ width: 40, height: 40 }}
          className="mb-2"
        />
        <Text className="text-white text-2xl mb-1">
          {convertTemperature(data.maxTemp)}°
        </Text>
        <Text className="text-white text-sm mb-2">
          Night {convertTemperature(data.minTemp)}°
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
      <Text className="text-xl font-psemibold text-black">Weekly Forecast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
      >
        {weeklyData.slice(0, 10).map((data, index) => (
          <View key={index} className="mr-1">
            <ForecastCard key={index} data={data} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
