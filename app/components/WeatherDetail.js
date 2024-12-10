import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { getCurrentLocation, getCityFromCoords } from "../../api/location";
import {
  getCurrentWeather,
  getAirQuality,
  getUVIndex,
  getHourlyWeather,
  getWeeklyWeather,
} from "../../api/weather";
import DetailObservations from "./DetailObservations";
import Outdoor from "./Outdoor";
import Hourly from "./Hourly";
import DailyForecast from "./DailyForecast";
import WeeklyForecast from "./WeeklyForecast";

export default function WeatherDetail() {
  const [city, setCity] = useState(null);
  const [weatherData, setWeatherData] = React.useState(null);
  const [additionalData, setAdditionalData] = React.useState(null);
  const [hourlyData, setHourlyData] = React.useState(null);
  const [weeklyData, setWeeklyData] = React.useState(null);
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

        // Fetch weather data
        const currentWeather = await getCurrentWeather(cityName);
        // Fetch additional data (air quality, UV index)
        const airQuality = await getAirQuality(
          location.latitude,
          location.longitude
        );
        const uvIndex = await getUVIndex(location.latitude, location.longitude);
        const hourly = await getHourlyWeather(cityName);
        const weekly = await getWeeklyWeather(cityName);

        setHourlyData(hourly);
        setWeeklyData(weekly);

        setWeatherData({
          sunrise: new Date(
            currentWeather.sys.sunrise * 1000
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sunset: new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
          windSpeed: currentWeather.wind.speed,
          windGust: currentWeather.wind.gust || "N/A",
          humidity: currentWeather.main.humidity,
          dewPoint: calculateDewPoint(
            currentWeather.main.temp,
            currentWeather.main.humidity
          ),
          temperature: currentWeather.main.temp,
        });

        setAdditionalData({
          airQuality: airQuality?.list?.[0]?.main?.aqi ?? "N/A",
          uvIndex: uvIndex.value,
          healthRisk: calculateHealthRisk(
            airQuality?.list?.[0]?.main?.aqi ?? 0,
            uvIndex.value
          ),
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

  // Helper function to calculate health risk
  const calculateHealthRisk = (airQuality, uvIndex) => {
    if (airQuality <= 2 && uvIndex <= 2) return "Low";
    if (airQuality <= 3 || uvIndex <= 5) return "Moderate";
    return "High";
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!weatherData || !city || !additionalData || !hourlyData || !weeklyData) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-red-500">
          Failed to load weather data.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="mt-4">
      <DetailObservations weatherData={weatherData} />
      <Outdoor weatherData={weatherData} additionalData={additionalData} />
      <Hourly hourlyData={hourlyData} />
      <DailyForecast hourlyData={hourlyData} />
      <WeeklyForecast weeklyData={weeklyData} />
    </ScrollView>
  );
}
