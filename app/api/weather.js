import axios from "axios";
import { OPENWEATHERMAP_API_KEY } from "@env";

const BASE_URL = "https://api.openweathermap.org/data/2.5/";
const GEOCODING_URL = "http://api.openweathermap.org/geo/1.0/";

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
 * Fetch city name by latitude and longitude
 * @param {number} latitude - Latitude of the location
 * @param {number} longitude - Longitude of the location
 * @returns {Promise<string>} - City name
 */
export async function getCityFromCoords(latitude, longitude) {
  try {
    const response = await axios.get(`${GEOCODING_URL}reverse`, {
      params: {
        lat: latitude,
        lon: longitude,
        limit: 1,
        appid: OPENWEATHERMAP_API_KEY,
      },
    });
    if (response.data && response.data.length > 0) {
      return response.data[0].name; // 返回城市名
    }
    throw new Error("No city found for the given coordinates.");
  } catch (error) {
    console.error("Error fetching city name from coordinates:", error);
    throw error;
  }
}
