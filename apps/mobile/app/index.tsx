import { Text, View } from "react-native";

// Gate 0.1 placeholder screen. No clinical surface is built in Phase 0.
// Styling here is intentionally minimal; Gate 0.2 wires semantic tokens.
export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg font-semibold text-gray-900">MedSync</Text>
      <Text className="mt-2 text-sm text-gray-500">Platform foundation</Text>
    </View>
  );
}
