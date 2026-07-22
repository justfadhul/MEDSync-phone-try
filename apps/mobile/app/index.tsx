import { useCallback } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import Svg, { Path } from "react-native-svg";
import Animated, { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";
import { tokens } from "@medsync/tokens";

// Welcome / splash — the mobile counterpart of the web welcome screen, in the
// teal brand. A staggered portrait cluster of Uganda's medical community over a
// soft teal blob, one headline, an honest onboarding note (no fabricated
// count), and the two doors. Photos are illustrative brand imagery. Light only;
// no clinical status colours. System font + weights (Poppins on RN is a
// separate follow-up — it needs per-weight family loading).
const BRAND = tokens["brand-primary"];
const ON_BRAND = tokens["content-on-brand"];

const PORTRAITS = [
  { src: require("../assets/welcome/portrait-1.jpg"), w: 96, h: 150, mt: 22, ml: 0, z: 1 },
  { src: require("../assets/welcome/portrait-2.jpg"), w: 100, h: 178, mt: 0, ml: -14, z: 2 },
  { src: require("../assets/welcome/portrait-3.jpg"), w: 96, h: 138, mt: 40, ml: -14, z: 1 },
];

function Mark() {
  return (
    <View className="bg-brand-primary h-8 w-8 items-center justify-center rounded-lg">
      <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={ON_BRAND} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M3 12h4l2 5 4-12 2 7h6" />
      </Svg>
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
    <View className="bg-surface-page flex-1 px-6 pb-10 pt-16" onLayout={onLayout}>
      {/* brand */}
      <Animated.View entering={reduce ? undefined : FadeIn.duration(400)} className="flex-row items-center gap-2">
        <Mark />
        <Text className="text-content-primary text-lg font-semibold tracking-tight">MedSync</Text>
      </Animated.View>
      <View className="bg-brand-accent mt-3 h-1 w-14 rounded-full" />

      {/* pictorial cluster over a soft teal blob */}
      <Animated.View entering={rise(150)} className="mt-8 items-center justify-center">
        <View
          className="bg-brand-subtle absolute h-56 w-64 rounded-[36px]"
          style={{ transform: [{ rotate: "6deg" }] }}
        />
        <View className="flex-row items-start justify-center py-4">
          {PORTRAITS.map((p, i) => (
            <Image
              key={i}
              source={p.src}
              accessibilityLabel="Illustrative portrait of Uganda's medical community"
              resizeMode="cover"
              style={{ width: p.w, height: p.h, marginTop: p.mt, marginLeft: p.ml, borderRadius: 18, zIndex: p.z }}
            />
          ))}
        </View>
      </Animated.View>

      {/* message */}
      <Animated.View entering={rise(260)} className="mt-6">
        <Text className="text-content-primary text-[28px] font-bold leading-[1.1] tracking-tight">
          A digital hospital that doesn&rsquo;t stop at the gate.
        </Text>
        <Text className="text-content-secondary mt-3 text-[15px] leading-6">
          One record for the whole hospital — that stays open after the patient
          goes home.
        </Text>
      </Animated.View>

      {/* honest onboarding note — no fabricated count */}
      <Animated.View entering={rise(360)} className="border-line-subtle mt-5 flex-row items-center gap-3 self-start rounded-2xl border px-4 py-3">
        <View className="bg-brand-subtle h-8 w-8 items-center justify-center rounded-xl">
          <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={BRAND} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" />
            <Path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
          </Svg>
        </View>
        <Text className="text-content-secondary text-[13px]">
          <Text className="text-content-primary font-semibold">Now onboarding founding hospitals</Text>
          {"\n"}Kampala first — the founding cohort is open.
        </Text>
      </Animated.View>

      {/* doors */}
      <Animated.View entering={rise(460)} className="mt-auto gap-3">
        <Pressable
          onPress={() => router.push("/onboarding")}
          accessibilityRole="button"
          accessibilityLabel="Get started"
          className="bg-brand-primary h-14 flex-row items-center justify-center gap-2 rounded-full active:opacity-90"
        >
          <Text className="text-content-on-brand text-base font-semibold">Get started</Text>
          <Svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke={ON_BRAND} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M5 12h14M13 6l6 6-6 6" />
          </Svg>
        </Pressable>
        <Pressable
          onPress={() => router.push("/sign-in")}
          accessibilityRole="button"
          accessibilityLabel="I already have an account"
          className="h-11 items-center justify-center active:opacity-70"
        >
          <Text className="text-content-secondary text-[15px] font-medium">I already have an account</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
