import axios from "axios";
import { OPENWEATHERMAP_API_KEY } from "@env";

const BASE_URL = "https://api.openweathermap.org/data/2.5/";

/**
 * Fetch current weather data by city name
 * @param {string} cityName - Name of the city
 * @returns {Promise<object>} - Weather data
 */
export async function getCurrentWeather(cityName) {
  try {
    const response = await axios.get(`${BASE_URL}weather`, {
      params: {
        q: cityName,
        units: "metric",
        appid: OPENWEATHERMAP_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

/**
 * Fetch weather forecast data by city name
 * @param {string} cityName - Name of the city
 * @returns {Promise<object>} - Weather forecast data
 */
export async function getWeatherForecast(cityName) {
  try {
    const response = await axios.get(`${BASE_URL}forecast`, {
      params: {
        q: cityName,
        units: "metric",
        appid: OPENWEATHERMAP_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    throw error;
  }
}

/**
 * Get air quality data for a given location
 * @param {number} latitude - Latitude of the location
 * @param {number} longitude - Longitude of the location
 * @returns {Promise<object>} - Air quality data
 */
export async function getAirQuality(latitude, longitude) {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: OPENWEATHERMAP_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    throw error;
  }
}

/**
 * Get UV index for a given location
 * @param {number} latitude - Latitude of the location
 * @param {number} longitude - Longitude of the location
 * @returns {Promise<object>} - UV index data
 */
export async function getUVIndex(latitude, longitude) {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/uvi`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: OPENWEATHERMAP_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching UV index data:", error);
    throw error;
  }
}

/**
 * Get hourly weather data (3-hour intervals) for a given location
 * @param {string} cityName - Name of the city
 * @returns {Promise<object[]>} - Hourly weather data
 */
export async function getHourlyWeather(cityName) {
  try {
    const response = await axios.get(`${BASE_URL}forecast`, {
      params: {
        q: cityName,
        units: "metric",
        appid: OPENWEATHERMAP_API_KEY,
      },
    });

    // 提取 3 小时间隔的天气数据
    const hourlyData = response.data.list.map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        hour12: true,
      }),
      temp: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      precipitation: Math.round((item.pop || 0) * 100), // 降水概率
      icon: item.weather[0].icon, // 天气图标代码
    }));

    return hourlyData;
  } catch (error) {
    console.error("Error fetching hourly weather data:", error);
    throw error;
  }
}

/**
 * Get weekly weather forecast data for a given location
 * @param {cityName} cityName - Name of the city
 * @returns {Promise<object[]>} - Weekly weather forecast data
 */
export async function getWeeklyWeather(cityName) {
  try {
    const response = await axios.get(`${BASE_URL}forecast`, {
      params: {
        q: cityName,
        units: "metric",
        appid: OPENWEATHERMAP_API_KEY,
      },
    });

    // 分组数据，提取每天的最高温、最低温和天气图标
    const groupedData = {};
    response.data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toISOString().split("T")[0]; // 提取日期
      if (!groupedData[date]) {
        groupedData[date] = {
          maxTemp: item.main.temp,
          minTemp: item.main.temp,
          precipitation: item.pop || 0,
          icon: item.weather[0].icon,
        };
      } else {
        groupedData[date].maxTemp = Math.max(
          groupedData[date].maxTemp,
          item.main.temp
        );
        groupedData[date].minTemp = Math.min(
          groupedData[date].minTemp,
          item.main.temp
        );
        groupedData[date].precipitation += item.pop || 0;
      }
    });

    // 转换为数组格式
    const weeklyData = Object.keys(groupedData).map((date) => ({
      date,
      maxTemp: Math.round(groupedData[date].maxTemp),
      minTemp: Math.round(groupedData[date].minTemp),
      precipitation: Math.round(groupedData[date].precipitation * 100), // 转换为百分比
      icon: groupedData[date].icon,
    }));

    return weeklyData;
  } catch (error) {
    console.error("Error fetching weekly weather data:", error);
    throw error;
  }
}
