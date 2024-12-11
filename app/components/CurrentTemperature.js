import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentLocation, getCityFromCoords } from "../../api/location";
import { getCurrentWeather } from "../../api/weather";
import { useTemperatureUnit } from "./TemperatureUnitContext";

export default function TemperatureDisplay({ cityName }) {
  const { tempUnit } = useTemperatureUnit(); // 获取温度单位
  const [city, setCity] = useState(cityName || null); // 优先使用传递的 cityName
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Convert temperature to the selected unit
  const convertTemperature = (tempInCelsius) => {
    return tempUnit === "F"
      ? Math.round((tempInCelsius * 9) / 5 + 32) // Convert to Fahrenheit
      : tempInCelsius; // Default to Celsius
  };

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);

        let currentCity = cityName; // Default to the passed cityName

        if (!cityName) {
          // If no cityName is passed, get the current location
          try {
            const location = await getCurrentLocation();
            console.log("Location:", location);

            currentCity = await getCityFromCoords(
              location.latitude,
              location.longitude
            );
          } catch (locationError) {
            console.warn("Location unavailable:", locationError);

            // If location is unavailable, use the default city
            const defaultCity = await AsyncStorage.getItem("defaultCity");
            currentCity = defaultCity || "Default City"; // Use "Default City" if no default is set
          }

          setCity(currentCity); // Update the city
        }

        // 获取天气数据
        const data = await getCurrentWeather(currentCity);
        setWeatherData({
          temperature: Math.round(data?.main?.temp ?? 0),
          feelsLike: Math.round(data?.main?.feels_like ?? 0),
          high: Math.round(data?.main?.temp_max ?? 0),
          low: Math.round(data?.main?.temp_min ?? 0),
          icon: data?.weather?.[0]?.icon ?? "01d",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    }

    fetchWeather();
  }, [cityName]); // 监听 cityName 的变化

  // 加载状态
  if (loading || !weatherData) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-blue-500">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  // 如果天气数据加载失败
  if (!weatherData || !city) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-red-500">
          Failed to load weather data.
        </Text>
      </View>
    );
  }

  // 天气数据成功加载
  return (
    <View>
      {/* 城市名称 */}
      <View className="items-center mb-4">
        <Text className="text-white text-3xl font-bold">{city}</Text>
      </View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row">
          <Image
            source={{
              uri: weatherData?.icon
                ? `https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`
                : null,
            }}
            style={{ width: 80, height: 80 }}
          />
          {/* 温度显示 */}
          <View className="flex-row items-center">
            <Text className="text-8xl font-semibold text-white self-end">
              {convertTemperature(weatherData.temperature)}
            </Text>
            <Text className="text-6xl font-semibold text-white self-start">
              °
            </Text>
          </View>
        </View>

        {/* 其他天气信息 */}
        <View className="ml-4">
          <Text className="text-xl font-pregular text-white">
            Feels {convertTemperature(weatherData.feelsLike)}°
          </Text>
          <Text className="text-xl font-pregular text-white">
            H:{convertTemperature(weatherData.high)}° L:
            {convertTemperature(weatherData.low)}°
          </Text>
        </View>
      </View>
    </View>
  );
}
