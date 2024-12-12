import * as Location from "expo-location";
import axios from "axios";
import Constants from "expo-constants";

const GEO_URL = "https://api.openweathermap.org/geo/1.0/";
const API_KEY = Constants.expoConfig.extra.OPENWEATHERMAP_API_KEY;

if (!API_KEY) {
  console.error("OpenWeatherMap API key is not set in app.config.js");
}

/**
 * Request location permission and get current position.
 * @returns {Promise<object>} - { latitude, longitude }
 */
export async function getCurrentLocation() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Location permission not granted");
    }

    const location = await Location.getCurrentPositionAsync();
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error fetching location:", error.message);
    throw new Error("Failed to get current location");
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
    const response = await axios.get(`${GEO_URL}reverse`, {
      params: {
        lat: latitude,
        lon: longitude,
        limit: 1,
        appid: API_KEY,
      },
    });

    if (response.data && response.data.length > 0) {
      return response.data[0].name;
    }
    throw new Error("Unable to fetch city name");
  } catch (error) {
    console.error(
      "Error fetching city name:",
      error.response?.data || error.message
    );
    throw new Error("Failed to get city name from coordinates");
  }
}

/**
 * Fetch city suggestions based on search input
 * @param {string} query - Search query for the city
 * @returns {Promise<object[]>} - List of suggested cities
 */
export async function getCitySuggestions(query) {
  try {
    const response = await axios.get(`${GEO_URL}direct`, {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY,
      },
    });
    return response.data.map((city) => ({
      name: city.name,
      province: city.state || city.country,
      lat: city.lat,
      lon: city.lon,
    }));
  } catch (error) {
    console.error(
      "Error fetching city suggestions:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch city suggestions");
  }
}
