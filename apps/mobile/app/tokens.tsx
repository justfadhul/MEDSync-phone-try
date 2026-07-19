import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";

// Design-token showcase (dev reference). Same semantic tokens (@medsync/tokens
// preset) as web, so web and mobile resolve identical values. No raw hex, no
// primitive: the default palette is unavailable via the preset.

function Swatch({ label, className }: { label: string; className: string }) {
  return (
    <View className="border-line-subtle overflow-hidden rounded-md border">
      <View className={`h-12 ${className}`} />
      <Text className="text-content-secondary bg-surface-primary px-2 py-1 font-mono text-xs">
        {label}
      </Text>
    </View>
  );
}

export default function Tokens() {
  return (
    <ScrollView className="bg-surface-page flex-1">
      <View className="gap-6 px-6 py-10">
        <View>
          <Text className="text-content-tertiary font-mono text-xs">Tokens</Text>
          <Text className="text-content-primary mt-1 text-2xl font-semibold">
            MedSync design tokens
          </Text>
          <Text className="text-content-secondary mt-2 text-sm">
            Monochrome + blue, with a soft pastel wayfinding set. Red is reserved
            for clinical emergencies.
          </Text>
          <Link
            href="/dashboard"
            className="text-brand-primary mt-3 text-sm font-semibold"
          >
            View ward dashboard →
          </Link>
        </View>

        <View className="gap-3">
          <Text className="text-content-primary text-sm font-semibold">
            Surfaces
          </Text>
          <Swatch label="surface-primary" className="bg-surface-primary" />
          <Swatch label="surface-secondary" className="bg-surface-secondary" />
          <Swatch label="surface-inverse" className="bg-surface-inverse" />
        </View>

        <View className="gap-3">
          <Text className="text-content-primary text-sm font-semibold">
            Brand
          </Text>
          <Swatch label="brand-primary" className="bg-brand-primary" />
          <Swatch label="brand-cta" className="bg-brand-cta" />
        </View>

        <View className="gap-3">
          <Text className="text-content-primary text-sm font-semibold">
            Clinical status
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <Swatch label="stable" className="bg-status-stable" />
            <Swatch label="critical" className="bg-status-critical" />
            <Swatch label="caution" className="bg-status-caution" />
            <Swatch label="admitted" className="bg-status-admitted" />
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-content-primary text-sm font-semibold">
            Wayfinding pastels
          </Text>
          <Text className="text-content-tertiary text-xs">
            Decorative surface tints only — never a clinical signal.
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <Swatch label="tint-rose" className="bg-tint-rose" />
            <Swatch label="tint-peach" className="bg-tint-peach" />
            <Swatch label="tint-lavender" className="bg-tint-lavender" />
            <Swatch label="tint-mint" className="bg-tint-mint" />
            <Swatch label="tint-coral" className="bg-tint-coral" />
            <Swatch label="tint-sky" className="bg-tint-sky" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
