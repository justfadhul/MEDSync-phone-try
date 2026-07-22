import { useCallback } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";
import { tokens } from "@medsync/tokens";

// Welcome / splash — mobile, teal brand, styled to the onboarding references.
// A tilted photo collage over a soft teal blob, centred headline + support line,
// and a "Get started" pill (trailing arrow badge, IMG_8298 "Continue" style)
// with a quiet sign-in beneath. IMPORTANT layout rule: reanimated Animated.View
// does NOT reliably apply flex / margin styles on native, so every Animated.View
// here is used ONLY for the fade — all real layout lives on plain <View>s, and a
// plain flex-1 spacer (not margin-auto) pins the footer to the bottom.
const ON_BRAND = tokens["content-on-brand"];
const INK = tokens["content-primary"];
const WHITE_20 = "rgba(255,255,255,0.2)";
const GRAD: [string, string] = [tokens["brand-grad-from"], tokens["brand-grad-to"]];

// Teal-tinted drop shadow for the primary button (matches the reference float).
const btnShadow = {
  shadowColor: tokens["brand-cta"],
  shadowOpacity: 0.45,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 12 },
  elevation: 12,
};

const DOCTOR = require("../assets/welcome/portrait-1.jpg");
const NURSE = require("../assets/welcome/portrait-2.jpg");

const cardShadow = {
  shadowColor: INK,
  shadowOpacity: 0.22,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 12 },
  elevation: 10,
};

// Rounded, clipped photo (RN Image borderRadius doesn't always clip, so wrap in
// an overflow-hidden view; shadow sits on the outer view, not clipped).
function Photo({
  source, w, h, rotate, shadow, style,
}: {
  source: number; w: number; h: number; rotate: string; shadow?: boolean; style?: object;
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

      {/* tilted photo collage over a soft teal blob */}
      <Animated.View entering={rise(150)}>
        <View style={{ height: 300, marginTop: 24, alignItems: "center", justifyContent: "center" }}>
          <View className="bg-brand-subtle absolute rounded-[52px]" style={{ width: 264, height: 264, transform: [{ rotate: "10deg" }] }} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Photo source={DOCTOR} w={140} h={190} rotate="-7deg" style={{ marginRight: -30, marginTop: 26, zIndex: 1 }} />
            <Photo source={NURSE} w={154} h={210} rotate="6deg" shadow style={{ marginLeft: -30, zIndex: 2 }} />
          </View>
        </View>
      </Animated.View>

      {/* message — centred */}
      <Animated.View entering={rise(280)}>
        <View style={{ marginTop: 32, alignItems: "center" }}>
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
        </View>
      </Animated.View>

      {/* plain flex spacer pins the footer to the bottom (reliable on native) */}
      <View style={{ flex: 1 }} />

      {/* footer — primary pill + quiet sign-in */}
      <Animated.View entering={rise(440)}>
        <Pressable
          onPress={() => router.push("/onboarding")}
          accessibilityRole="button"
          accessibilityLabel="Get started"
          className="active:opacity-90"
          style={{ borderRadius: 9999, backgroundColor: GRAD[1], ...btnShadow }}
        >
          <LinearGradient
            colors={GRAD}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ height: 56, borderRadius: 9999, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}
          >
            <Text className="text-content-on-brand text-base font-semibold">Get started</Text>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: WHITE_20, alignItems: "center", justifyContent: "center" }}>
              <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={ON_BRAND} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M5 12h14M13 6l6 6-6 6" />
              </Svg>
            </View>
          </LinearGradient>
        </Pressable>

        <Pressable onPress={() => router.push("/sign-in")} accessibilityRole="button" hitSlop={8} className="mt-4 items-center active:opacity-70">
          <Text className="text-content-secondary text-sm">
            Already have an account? <Text className="text-content-primary font-semibold">Sign in</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
