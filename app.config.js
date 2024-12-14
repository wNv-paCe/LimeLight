import "dotenv/config";

export default {
  expo: {
    name: "Observatory",
    scheme: "observatory",
    slug: "observatory",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    icon: "./assets/icon/icon-ios.png",
    splash: {
      image: "./assets/splash/splash-ios.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      icon: "./assets/icon/icon-ios.png",
      splash: {
        image: "./assets/splash/splash-ios.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "We need your location to show the weather in your area.",
      },
      bundleIdentifier: "com.charlie.observatory", // iOS 包名
    },
    android: {
      icon: "./assets/icon/icon-android.png",
      splash: {
        image: "./assets/splash/splash-android.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: ["ACCESS_FINE_LOCATION"],
      package: "com.charlie.observatory", // Android 包名
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-router"],
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "6226322a-5490-4e0f-854f-0059559bb362",
      },
    },
  },
};
