import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export default function WeatherDetail({ cityName }) {
  const [city, setCity] = useState(cityName || null);
  const [weatherData, setWeatherData] = useState(null);
  const [additionalData, setAdditionalData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeatherData() {
      try {
        setLoading(true);

        let currentCity = cityName;
        let location = null;

        // 如果没有传递 cityName，则尝试获取地理位置
        if (!cityName) {
          try {
            location = await getCurrentLocation();
            currentCity = await getCityFromCoords(
              location.latitude,
              location.longitude
            );
          } catch (locationError) {
            console.warn("Location unavailable:", locationError);

            // 如果地理位置不可用，尝试获取默认城市
            const defaultCity = await AsyncStorage.getItem("defaultCity");
            currentCity = defaultCity || "Default City"; // 默认城市
          }

          setCity(currentCity);
        }

        // 获取天气数据
        const currentWeather = await getCurrentWeather(currentCity);
        const airQuality = await getAirQuality(
          location ? location.latitude : currentWeather.coord.lat,
          location ? location.longitude : currentWeather.coord.lon
        );
        const uvIndex = await getUVIndex(
          location ? location.latitude : currentWeather.coord.lat,
          location ? location.longitude : currentWeather.coord.lon
        );
        const hourly = await getHourlyWeather(currentCity);
        const weekly = await getWeeklyWeather(currentCity);

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

    fetchWeatherData();
  }, [cityName]);

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
