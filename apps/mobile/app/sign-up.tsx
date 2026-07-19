import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";

// Auth boundary — PLACEHOLDER, not a registration form. Onboarding ends here;
// registration is Tier 1 (depends on the identity model) and is deliberately
// not built or mocked in this milestone.
export default function SignUp() {
  const router = useRouter();
  return (
    <View className="bg-surface-page flex-1 items-center justify-center gap-3 px-8">
      <Text className="text-content-primary text-2xl font-semibold tracking-tight">
        Create your account
      </Text>
      <Text className="text-content-secondary max-w-xs text-center text-sm">
        Registration opens in the next milestone. You’ve reached the end of the
        getting-started flow.
      </Text>
      <Button title="Back" variant="ghost" onPress={() => router.back()} className="mt-2" />
    </View>
  );
}
