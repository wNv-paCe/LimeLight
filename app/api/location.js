import * as Location from "expo-location";
import { OPENWEATHERMAP_API_KEY } from "@env";

/**
 * Request location permission and get current position.
 * @returns {Promise<object>} - { latitude, longitude }
 */
export async function getCurrentLocation() {
  try {
    // 请求位置权限
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Location permission not granted");
    }

    // 获取当前位置
    const location = await Location.getCurrentPositionAsync();
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error fetching location:", error);
    throw error;
  }
}

/**
 * Get city name from latitude and longitude using OpenWeatherMap API.
 * @param {number} latitude - Latitude of the location.
 * @param {number} longitude - Longitude of the location.
 * @returns {Promise<string>} - City name
 */
export async function getCityFromCoords(latitude, longitude) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`
    ); // 使用正确的变量名
    const data = await response.json();
    if (data && data.length > 0) {
      return data[0].name; // 返回城市名
    }
    throw new Error("Unable to fetch city name");
  } catch (error) {
    console.error("Error fetching city name:", error);
    throw error;
  }
}
