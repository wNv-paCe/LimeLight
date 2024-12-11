import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view"; // 引入 SwipeListView
import { Cloud } from "lucide-react-native";
import { getCurrentWeather } from "../../api/weather";
import { useTemperatureUnit } from "./TemperatureUnitContext";

export default function CityItem({
  cityName,
  provinceName,
  onRemoveCity,
  onPress,
}) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { tempUnit } = useTemperatureUnit();

  useEffect(() => {
    async function fetchWeather() {
      try {
        setError(false); // 重置错误状态
        const data = await getCurrentWeather(cityName); // 获取所有数据
        // 提取所需字段
        const extractedWeather = {
          temp: Math.round(data.main?.temp) ?? "--",
          icon: data.weather?.[0]?.icon ?? null,
          description: data.weather?.[0]?.description ?? "N/A",
        };
        setWeather(extractedWeather); // 保存提取后的天气数据
      } catch (error) {
        console.error("Error fetching weather:", error);
        setError(true); // 设置错误状态
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [cityName]);

  const getWeatherIconUrl = (icon) =>
    `https://openweathermap.org/img/wn/${icon}@2x.png`;

  // Convert temperature to Fahrenheit if the unit is set to F
  const convertTemperature = (tempInCelsius) => {
    return tempUnit === "F"
      ? Math.round((tempInCelsius * 9) / 5 + 32) // 摄氏度 -> 华氏度
      : Math.round(tempInCelsius); // 保持摄氏度
  };

  return (
    <SwipeListView
      data={[{ key: `${cityName}-${provinceName}`, cityName, provinceName }]} // 单项数据结构
      className="mb-3"
      renderItem={(data) => (
        <TouchableOpacity
          onPress={() => onPress(data.item.cityName)}
          activeOpacity={1}
        >
          <View
            className="flex-row justify-between items-center mx-8 px-4 py-6 bg-blue-500 rounded-lg"
            style={{ height: 80 }} // 设置固定高度
          >
            {/* 左侧：城市名和省份 */}
            <View>
              <Text className="text-gray-800 text-xl font-bold">
                {data.item.cityName}
              </Text>
              <Text className="text-gray-700 text-base">
                {data.item.provinceName}
              </Text>
            </View>

            {/* 右侧：天气图标和温度 */}
            <View className="flex-row items-center">
              {loading ? (
                <ActivityIndicator size="small" color="#666" />
              ) : error ? (
                <Cloud size={40} color="#666" />
              ) : (
                <Image
                  source={{ uri: getWeatherIconUrl(weather?.icon) }}
                  style={{ width: 40, height: 40 }}
                />
              )}
              <Text className="text-gray-800 text-3xl font-bold">
                {error
                  ? "--"
                  : weather?.temp
                  ? convertTemperature(weather.temp)
                  : "--"}{" "}
                °
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      renderHiddenItem={(data) => (
        <View
          className="flex-row justify-end items-center rounded-lg"
          style={{
            height: 80, // 保持与 renderItem 的高度一致
          }}
        >
          <TouchableOpacity
            onPress={() => onRemoveCity(data.item.cityName)}
            className="justify-center items-center mr-8 bg-red-600 rounded-lg"
            style={{
              height: 80,
              width: 80,
            }}
          >
            <Text className="text-white text-lg font-pmedium">Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      leftOpenValue={0} // 向左滑动
      rightOpenValue={-85} // 向右滑动时显示删除按钮
      disableRightSwipe={true} // 禁用右滑
      swipeToOpenPercent={1} // 只需滑动 5% 的距离即可触发
      swipeToClosePercent={50} // 关闭滑动视图只需滑动 50%
      stopLeftSwipe={0} // 限制左滑距离
      stopRightSwipe={-100} // 限制右滑最大距离
    />
  );
}
