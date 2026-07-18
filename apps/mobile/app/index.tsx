import { ScrollView, Text, View } from "react-native";

// Gate 0.2 token showcase — matches the web page. Same semantic tokens
// (@medsync/tokens preset), so web and mobile resolve identical values.
// No raw hex, no primitive: default palette is unavailable via the preset.

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

export default function Index() {
  return (
    <ScrollView className="bg-surface-page flex-1">
      <View className="gap-6 px-6 py-10">
        <View>
          <Text className="text-content-tertiary font-mono text-xs">[02]</Text>
          <Text className="text-content-primary mt-1 text-2xl font-semibold">
            MedSync design tokens
          </Text>
          <Text className="text-content-secondary mt-2 text-sm">
            Monochrome + teal. Red is reserved for clinical emergencies.
          </Text>
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
      </View>
    </ScrollView>
  );
}
