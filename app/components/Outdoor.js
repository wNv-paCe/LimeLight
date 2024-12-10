import React from "react";
import { View, Text } from "react-native";
import { Wind, Sun, Heart } from "lucide-react-native";

export default function Outdoor({ weatherData, additionalData }) {
  const metrics = [
    {
      icon: Wind,
      label: "Air Quality",
      status:
        additionalData.airQuality === "N/A"
          ? "Unknown"
          : additionalData.airQuality <= 2
          ? "Low Risk"
          : additionalData.airQuality <= 4
          ? "Moderate Risk"
          : "High Risk",
      dotColor:
        additionalData.airQuality === "N/A"
          ? "bg-gray-500"
          : additionalData.airQuality <= 2
          ? "bg-blue-500"
          : additionalData.airQuality <= 4
          ? "bg-yellow-500"
          : "bg-red-500",
    },
    {
      icon: Sun,
      label: "UV",
      status:
        additionalData.uvIndex <= 2
          ? "Low"
          : additionalData.uvIndex <= 5
          ? "Moderate"
          : "High",
      dotColor:
        additionalData.uvIndex <= 2
          ? "bg-green-500"
          : additionalData.uvIndex <= 5
          ? "bg-yellow-500"
          : "bg-red-500",
    },
    {
      icon: Heart,
      label: "Health",
      status: additionalData.healthRisk || "Unknown",
      dotColor:
        additionalData.healthRisk === "Low"
          ? "bg-green-500"
          : additionalData.healthRisk === "Moderate"
          ? "bg-yellow-500"
          : "bg-red-500",
    },
  ];

  return (
    <View className="px-4 mb-4">
      <Text className="text-xl font-psemibold text-black">
        Outdoor Conditions
      </Text>
      {metrics.map((metric, index) => (
        <View
          key={index}
          className="flex-row items-center justify-between bg-gray-400/30 rounded-2xl p-4 mt-3"
        >
          <View className="flex-row items-center gap-2">
            <metric.icon size={24} color="white" />
            <Text className="text-lg text-white">{metric.label}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-lg text-white">{metric.status}</Text>
            <View className={`w-3 h-3 rounded-full ${metric.dotColor}`} />
          </View>
        </View>
      ))}
    </View>
  );
}
