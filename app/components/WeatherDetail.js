import React from "react";
import { ScrollView } from "react-native";
import DetailObservations from "./DetailObservations";
import Outdoor from "./Outdoor";
import Hourly from "./Hourly";
import SevenDays from "./SevenDays";
import FourteenDays from "./FourteenDays";

export default function WeatherDetail() {
  return (
    <ScrollView className="mt-4">
      <DetailObservations />
      <Outdoor />
      <Hourly />
      <SevenDays />
      <FourteenDays />
    </ScrollView>
  );
}
