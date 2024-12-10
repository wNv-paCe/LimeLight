import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { Cloud } from "lucide-react-native";

// OpenWeatherMap API icons
function getWeatherIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export default function DailyForecast({ hourlyData }) {
  if (!hourlyData) {
    return <Text className="text-gray-500">Loading hourly forecast...</Text>;
  }

  // 动态添加 period 字段到每个数据项
  const mappedData = hourlyData.map((item) => {
    const timeParts = item.time.match(/(\d+)(?::\d+)?\s*(AM|PM)/i);
    if (!timeParts) {
      console.error("Invalid time format:", item.time);
      return { ...item, period: "Unknown" };
    }

    // 解析时间并确定时间段
    let hours = parseInt(timeParts[1], 10);
    const isPM = timeParts[2].toUpperCase() === "PM";
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    let period = "Unknown";
    if (hours >= 0 && hours < 6) {
      period = "Night";
    } else if (hours >= 6 && hours < 12) {
      period = "Morn";
    } else if (hours >= 12 && hours < 18) {
      period = "Aft";
    } else {
      period = "Eve";
    }

    return { ...item, period };
  });

  const ForecastCard = ({ data }) => {
    const weatherIconUrl = getWeatherIcon(data.icon);
    return (
      <View className="w-20 bg-gray-400/30 rounded-xl p-4 gap-1 items-center">
        <Text className="text-white text-base mb-2">{data.period}</Text>
        <Image
          source={{ uri: weatherIconUrl }}
          style={{ width: 40, height: 40 }}
          className="mb-2"
        />
        <Text className="text-white text-2xl mb-1">{data.temp}°</Text>
        <Text className="text-white text-sm mb-2">Feels {data.feelsLike}°</Text>
        <View className="flex-row items-center">
          <Cloud size={16} color="white" />
          <Text className="text-white text-sm ml-1">{data.precipitation}%</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="px-4 mb-4">
      <Text className="text-xl font-psemibold text-black">Daily Forecast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
      >
        {mappedData.slice(0, 10).map((data, index) => (
          <View key={index} className="mr-1">
            <ForecastCard data={data} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
