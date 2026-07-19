import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

// Keep the native splash up until the first screen paints, so the hand-off to
// the Welcome screen (identical background + logo position) has no flash. The
// Welcome screen calls SplashScreen.hideAsync() once it has laid out.
// Light theme only — dark is deliberately not enabled for MedSync clinical
// surfaces (see @medsync/tokens flags + design system §6).
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
