// Expo config as JS so the splash background comes from the SINGLE token source
// (@medsync/tokens) rather than a hardcoded hex — the same value the Welcome
// screen paints, which is what makes the splash → welcome handoff seamless.
const preset = require("@medsync/tokens/preset");
const surfacePrimary = preset.theme.colors.surface.primary;

/** @type {import('@expo/config').ExpoConfig} */
module.exports = {
  name: "MedSync",
  slug: "medsync",
  version: "0.1.0",
  orientation: "portrait",
  scheme: "medsync",
  userInterfaceStyle: "light", // light only — clinical-first (no dark, no toggle)
  newArchEnabled: true,
  icon: "./assets/logo.png",
  ios: { supportsTablet: true, bundleIdentifier: "com.medsync.app" },
  android: {
    package: "com.medsync.app",
    adaptiveIcon: { foregroundImage: "./assets/logo.png", backgroundColor: surfacePrimary },
  },
  web: { bundler: "metro", output: "static", favicon: "./assets/logo.png" },
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-splash-screen",
      {
        // Logo centred on the surface-primary background. The Welcome screen
        // renders the SAME asset at the SAME width (120), centred, so the logo
        // does not jump across the handoff.
        image: "./assets/logo.png",
        imageWidth: 120,
        resizeMode: "contain",
        backgroundColor: surfacePrimary,
      },
    ],
  ],
  experiments: { typedRoutes: true },
};
