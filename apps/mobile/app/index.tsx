import { useCallback } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import Svg, { Path } from "react-native-svg";
import Animated, { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";
import { tokens } from "@medsync/tokens";

// Welcome / splash — mobile, teal brand, styled to the onboarding reference
// (IMG_8303): a tilted photo collage over a soft teal blob, centred headline +
// support line, and a circular arrow "go" button paired with a quiet sign-in.
// Photos are illustrative brand imagery. Light only; no clinical status colours.
const BRAND = tokens["brand-primary"];
const ON_BRAND = tokens["content-on-brand"];
const INK = tokens["content-primary"];

const DOCTOR = require("../assets/welcome/portrait-1.jpg");
const NURSE = require("../assets/welcome/portrait-2.jpg");

const cardShadow = {
  shadowColor: INK,
  shadowOpacity: 0.22,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 12 },
  elevation: 10,
};

// Rounded, clipped photo (RN Image borderRadius doesn't always clip on web, so
// wrap in an overflow-hidden view; shadow sits on an outer view, not clipped).
function Photo({
  source, w, h, rotate, shadow, style,
}: {
  source: number; w: number; h: number; rotate: string; shadow?: boolean;
  style?: object;
}) {
  return (
    <View style={[{ width: w, height: h, borderRadius: 30, transform: [{ rotate }] }, shadow ? cardShadow : null, style]}>
      <View style={{ width: "100%", height: "100%", borderRadius: 30, overflow: "hidden" }}>
        <Image source={source} resizeMode="cover" style={{ width: "100%", height: "100%" }} accessibilityLabel="Illustrative portrait of Uganda's medical community" />
      </View>
    </View>
  );
}

function Mark() {
  return (
    <View className="flex-row items-center gap-2">
      <View className="bg-brand-primary h-8 w-8 items-center justify-center rounded-lg">
        <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={ON_BRAND} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M3 12h4l2 5 4-12 2 7h6" />
        </Svg>
      </View>
      <Text className="text-content-primary text-lg font-semibold tracking-tight">MedSync</Text>
    </View>
  );
}

// Circular "go" button — soft teal ring around a solid teal core with a white
// chevron, matching the reference's next control.
function CircleGo({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Get started" hitSlop={10} className="active:opacity-90">
      <View className="bg-brand-subtle h-[72px] w-[72px] items-center justify-center rounded-full">
        <View className="bg-brand-primary h-14 w-14 items-center justify-center rounded-full" style={cardShadow}>
          <Svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke={ON_BRAND} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M9 6l6 6-6 6" />
          </Svg>
        </View>
      </View>
    </Pressable>
  );
}

export default function Welcome() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const onLayout = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);
  const rise = (delay: number) => (reduce ? undefined : FadeInDown.delay(delay).duration(500));

  return (
    <View className="bg-surface-page flex-1 px-7 pb-12 pt-16" onLayout={onLayout}>
      {/* brand — top left */}
      <Animated.View entering={reduce ? undefined : FadeIn.duration(400)}>
        <Mark />
      </Animated.View>

      {/* tilted photo collage over a soft teal blob (inline alignment — NativeWind
          flex/align classes are unreliable on reanimated Animated.View here) */}
      <Animated.View entering={rise(150)} style={{ height: 300, marginTop: 24, alignItems: "center", justifyContent: "center" }}>
        <View className="bg-brand-subtle absolute rounded-[52px]" style={{ width: 264, height: 264, transform: [{ rotate: "10deg" }] }} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Photo source={DOCTOR} w={140} h={190} rotate="-7deg" style={{ marginRight: -30, marginTop: 26, zIndex: 1 }} />
          <Photo source={NURSE} w={154} h={210} rotate="6deg" shadow style={{ marginLeft: -30, zIndex: 2 }} />
        </View>
      </Animated.View>

      {/* message — centred */}
      <Animated.View entering={rise(280)} style={{ marginTop: 32, alignItems: "center" }}>
        <Text className="text-content-primary text-center text-[26px] font-bold leading-[1.15] tracking-tight">
          A digital hospital that{"\n"}doesn&rsquo;t stop at the gate.
        </Text>
        <Text className="text-content-secondary mt-3 max-w-[300px] text-center text-[15px] leading-6">
          One record for the whole hospital — that stays open after the patient
          goes home.
        </Text>
        <View className="border-line-subtle mt-5 flex-row items-center gap-2 rounded-full border px-4 py-1.5">
          <View className="bg-brand-primary h-1.5 w-1.5 rounded-full" />
          <Text className="text-content-tertiary text-xs font-medium">Now onboarding founding hospitals · Kampala</Text>
        </View>
      </Animated.View>

      {/* doors — quiet sign-in + circular go. Inline flexDirection guarantees the
          row layout regardless of NativeWind on the animated view. */}
      <Animated.View entering={rise(420)} style={{ marginTop: "auto", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Pressable onPress={() => router.push("/sign-in")} accessibilityRole="button" hitSlop={10} className="active:opacity-70">
          <Text className="text-content-tertiary text-xs">Already registered?</Text>
          <Text className="text-content-primary mt-0.5 text-base font-semibold">Sign in</Text>
        </Pressable>
        <CircleGo onPress={() => router.push("/onboarding")} />
      </Animated.View>
    </View>
  );
}
