import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import CityListContainer from "../components/CityListContainer";
import TemperatureDisplay from "../components/CurrentTemperature";
import WeatherDetail from "../components/WeatherDetail";

export default function Cities() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCityPress = (cityName) => {
    setSelectedCity(cityName);
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-500/80">
      <View className="flex-1">
        {/* 城市列表 */}
        <CityListContainer onCityPress={handleCityPress} />
      </View>

      {/* 模态视图 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // 返回关闭模态框
      >
        <View className="flex-1 bg-blue-500">
          <SafeAreaView className="flex-1 items-center">
            {/* 当前温度显示 */}
            <View className="my-20">
              <TemperatureDisplay cityName={selectedCity} />
            </View>

            {/* 天气详情 */}
            <View
              className="absolute left-0 right-0 bottom-0 bg-orange-500/65 rounded-t-3xl overflow-hidden"
              style={{ height: "70%" }}
            >
              <ScrollView
                className="flex px-3"
                contentContainerStyle={{
                  paddingTop: 20,
                  paddingBottom: 20,
                }}
              >
                <WeatherDetail cityName={selectedCity} />
              </ScrollView>
            </View>

            {/* 关闭按钮 */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute bottom-10 bg-red-500 px-6 py-3 rounded-full"
            >
              <Text className="text-white text-lg font-bold">Close</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
