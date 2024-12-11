import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TemperatureUnitContext = createContext();

export const useTemperatureUnit = () => useContext(TemperatureUnitContext);

export const TemperatureUnitProvider = ({ children }) => {
  const [tempUnit, setTempUnit] = useState("C"); // 默认摄氏度

  useEffect(() => {
    const loadUnit = async () => {
      try {
        const savedUnit = await AsyncStorage.getItem("tempUnit");
        if (savedUnit) {
          setTempUnit(savedUnit);
        }
      } catch (error) {
        console.error("Error loading temperature unit:", error);
      }
    };
    loadUnit();
  }, []);

  const toggleUnit = async (unit) => {
    try {
      setTempUnit(unit);
      await AsyncStorage.setItem("tempUnit", unit);
    } catch (error) {
      console.error("Failed to save temperature unit:", error);
    }
  };

  return (
    <TemperatureUnitContext.Provider value={{ tempUnit, toggleUnit }}>
      {children}
    </TemperatureUnitContext.Provider>
  );
};
