import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import SearchBar from "./SearchBar";
import CityList from "./CityList";
import { getCitySuggestions } from "../../api/location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CityListContainer({ onCityPress }) {
  const [cities, setCities] = useState([]); // 用于保存城市列表
  const [filteredCities, setFilteredCities] = useState([]); // 用于保存过滤后的城市列表
  const [searchText, setSearchText] = useState("");

  // load cities from storage
  useEffect(() => {
    async function loadSavedCities() {
      try {
        const savedCities = await AsyncStorage.getItem("savedCities");
        if (savedCities) {
          setCities(JSON.parse(savedCities));
        }
      } catch (error) {
        console.error("Error loading saved cities:", error);
      }
    }
    loadSavedCities();
  }, []);

  // save cities to storage
  const saveCitiesToStorage = async (cities) => {
    try {
      await AsyncStorage.setItem("savedCities", JSON.stringify(cities));
    } catch (error) {
      console.error("Error saving cities:", error);
    }
  };

  // add city
  const addCity = (cityName, provinceName) => {
    if (
      !cityName ||
      cities.some(
        (city) =>
          city.cityName === cityName && city.provinceName === provinceName
      )
    )
      return; // 防止重复添加
    const updatedCities = [...cities, { cityName, provinceName }];
    setCities(updatedCities); // Update cities
    saveCitiesToStorage(updatedCities); // Save to storage
    setSearchText(""); // Clear search text
    setFilteredCities([]); // Clear filtered cities
  };

  // delete city
  const removeCity = (cityName) => {
    const updatedCities = cities.filter((city) => city.cityName !== cityName);
    setCities(updatedCities); // Update cities
    saveCitiesToStorage(updatedCities); // Save to storage
  };

  // handle search input
  const handleSearchInput = async (input) => {
    setSearchText(input);
    if (input.trim() === "") {
      setFilteredCities([]);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const suggestions = await getCitySuggestions(input, { signal });
      setFilteredCities(suggestions);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      setFilteredCities([]);
    }
  };

  const handleCityPress = (cityName) => {
    if (onCityPress) {
      onCityPress(cityName);
    }
  };

  return (
    <View className="flex-1">
      <SearchBar
        searchText={searchText}
        onInput={handleSearchInput} // 传递输入处理函数
      />

      {/* 动态搜索建议 */}
      {filteredCities.length > 0 && (
        <View className="bg-gray-200/50 rounded-lg mx-8 mb-2 p-4">
          {filteredCities.map((city, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => addCity(city.name, city.province)} // 点击建议添加城市
            >
              <Text className="text-gray-800 text-lg">
                {city.name}, {city.province}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 城市列表 */}
      {cities.length > 0 ? (
        <CityList
          cities={cities}
          onRemoveCity={removeCity}
          onCityPress={handleCityPress}
        />
      ) : (
        <View className="items-center mt-10">
          <Text className="text-gray-500 text-lg">No cities added yet.</Text>
        </View>
      )}
    </View>
  );
}
