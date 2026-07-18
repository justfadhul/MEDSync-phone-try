import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// Light theme only. Dark mode is deliberately NOT enabled for MedSync clinical
// surfaces (see packages/tokens dark-mode flag + design system §3.3).
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
