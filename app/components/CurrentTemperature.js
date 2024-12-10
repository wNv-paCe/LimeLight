import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { getCurrentLocation, getCityFromCoords } from "../../api/location";
import { getCurrentWeather } from "../../api/weather";

export default function TemperatureDisplay() {
  const [city, setCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeatherByLocation() {
      try {
        const location = await getCurrentLocation();
        console.log("Location:", location);

        const cityName = await getCityFromCoords(
          location.latitude,
          location.longitude
        );
        setCity(cityName);

        const data = await getCurrentWeather(cityName);
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
    fetchWeatherByLocation();
  }, []);

  if (loading || !weatherData) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-blue-500">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  if (!weatherData || !city) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-red-500">
          Failed to load weather data.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row">
        <Image
          source={{
            uri: weatherData?.icon
              ? `https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`
              : null,
          }}
          style={{ width: 100, height: 100 }}
        />
        {/* Temperature Display */}
        <View className="flex-row items-center">
          <Text className="text-8xl font-semibold text-white self-end">
            {weatherData.temperature}
          </Text>
          <Text className="text-6xl font-semibold text-white self-start">
            °
          </Text>
        </View>
      </View>

      {/* Additional Weather Info */}
      <View className="ml-4">
        <Text className="text-xl font-pregular text-white">
          Feels {weatherData.feelsLike}°
        </Text>
        <Text className="text-xl font-pregular text-white">
          H:{weatherData.high}° L:{weatherData.low}°
        </Text>
      </View>
    </View>
  );
}
