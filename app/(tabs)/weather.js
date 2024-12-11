import {
  View,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useRef } from "react";
import TemperatureDisplay from "../components/CurrentTemperature";
import WeatherDetail from "../components/WeatherDetail";

const NAVBAR_HEIGHT = 120;
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const WEATHER_CONTAINER_HEIGHT = SCREEN_HEIGHT * 0.65;
const SCROLLVIEW_HEIGHT = WEATHER_CONTAINER_HEIGHT - NAVBAR_HEIGHT - 20;

export default function Weather() {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-blue-500">
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <SafeAreaView className="flex-1 items-center">
          {/* Current Temperature */}
          <View className="my-20">
            <TemperatureDisplay />
          </View>

          {/* Weather Details */}
          <View
            className="absolute left-0 right-0 bottom-0 bg-orange-500/80 rounded-t-3xl overflow-hidden"
            style={{ height: WEATHER_CONTAINER_HEIGHT }}
          >
            <View style={{ height: SCROLLVIEW_HEIGHT, marginTop: 20 }}>
              <ScrollView
                className="flex px-3"
                contentContainerStyle={{
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: false }
                )}
              >
                <WeatherDetail />
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}
