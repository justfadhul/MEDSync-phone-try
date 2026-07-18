/** Expo SDK 54 + NativeWind v4 + Reanimated v4 (worklets). */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // react-native-worklets plugin must be listed last (Reanimated v4).
    plugins: ["react-native-worklets/plugin"],
  };
};
