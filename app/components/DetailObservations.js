import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Wind, Sunrise, Droplets } from "lucide-react-native";

export default function DetailObservations({ weatherData }) {
  return (
    <View className="px-4 mb-4">
      <Text className="text-xl font-psemibold text-black">
        Detail Observations
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mt-4"
      >
        {/* Sunrise Card */}
        <View className="w-44 h-44 bg-gray-400/30 rounded-xl p-4 mr-3">
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
        <View className="w-44 h-44 bg-gray-400/30 rounded-xl p-4 mr-3">
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
