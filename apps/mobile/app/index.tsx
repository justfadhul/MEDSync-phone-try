import { useCallback } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";
import { Button } from "@/components/ui/button";

// Welcome — the animated hand-off target from the native splash. Background is
// surface-primary and the logo sits DEAD CENTRE at width 120, exactly as the
// splash renders it (see app.config.js), so the logo does not jump. The logo is
// absolutely centred (never moves); only the tagline + buttons block reveals,
// and only when the OS isn't in reduce-motion. Brand blue on neutrals; no
// status colours; light only.
const LOGO = require("../assets/logo.png");

export default function Welcome() {
  const router = useRouter();
  const reduce = useReducedMotion();

  // Reveal the app only once this screen has laid out — no flash on hand-off.
  const onLayout = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <View className="bg-surface-primary flex-1" onLayout={onLayout}>
      {/* logo, dead centre — identical to the splash position (no jump) */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill} className="items-center justify-center">
        <Image source={LOGO} style={{ width: 120, height: 120 }} resizeMode="contain" accessibilityLabel="MedSync" />
      </View>

      {/* tagline + actions, pinned to the bottom */}
      <View className="flex-1 justify-end px-6 pb-12">
        <Animated.View entering={reduce ? undefined : FadeInDown.delay(300).duration(500)} className="gap-3">
          <View className="mb-2 items-center">
            <Text className="text-content-primary text-xl font-semibold tracking-tight">MedSync</Text>
            <Text className="text-content-secondary mt-1 text-sm">Care that continues.</Text>
          </View>
          <Button title="Get started" onPress={() => router.push("/onboarding")} />
          <Button title="I already have an account" variant="ghost" onPress={() => router.push("/sign-in")} />
        </Animated.View>
      </View>
    </View>
  );
}
