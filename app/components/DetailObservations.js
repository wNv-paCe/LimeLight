import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Wind, Sunrise, Droplets } from "lucide-react-native";
import { getCurrentLocation, getCityFromCoords } from "../api/location";
import { getCurrentWeather } from "../api/weather";

export default function DetailObservations() {
  const [city, setCity] = useState(null);
  const [weatherData, setWeatherData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

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
          sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          windSpeed: data.wind.speed,
          windGust: data.wind.gust || "N/A",
          humidity: data.main.humidity,
          dewPoint: calculateDewPoint(data.main.temp, data.main.humidity),
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    }
    fetchWeatherByLocation();
  }, []);

  // Helper function to calculate dew point
  const calculateDewPoint = (temperature, humidity) => {
    const a = 17.27;
    const b = 237.7;
    const alpha =
      (a * temperature) / (b + temperature) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return dewPoint.toFixed(1);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="px-4">
      <Text className="text-xl font-psemibold text-black">
        Outdoor Conditions
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mt-4"
      >
        {/* Sunrise Card */}
        <View className="w-44 h-44 bg-gray-400/30 rounded-xl p-4 mr-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Sunrise color="white" size={20} />
            <Text className="text-white text-sm">SUNRISE</Text>
          </View>
          <Text className="text-white text-2xl my-2">
            {weatherData.sunrise}
          </Text>
          <Text className="text-white text-sm my-1">
            Sunset: {weatherData.sunset}
          </Text>
        </View>

        {/* Wind Card */}
        <View className="w-44 h-44 bg-gray-400/30 rounded-xl p-4 mr-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Wind color="white" size={20} />
            <Text className="text-white text-sm">WIND</Text>
          </View>
          <View className="py-6 items-start gap-2">
            <Text className="text-white text-base">
              Wind: {weatherData.windSpeed} km/h
            </Text>
            <Text className="text-white text-base">
              Gusts: {weatherData.windGust} km/h
            </Text>
          </View>
        </View>

        {/* Humidity Card */}
        <View className="w-44 h-44 bg-gray-400/30 rounded-xl p-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Droplets color="white" size={20} />
            <Text className="text-white text-sm">HUMIDITY</Text>
          </View>
          <Text className="text-white text-4xl mb-1">
            {weatherData.humidity}%
          </Text>
          <Text className="text-white text-sm">
            The dew point is{"\n"}
            {weatherData.dewPoint}° right now.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
