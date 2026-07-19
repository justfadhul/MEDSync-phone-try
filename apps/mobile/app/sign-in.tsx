import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";

// Auth boundary — PLACEHOLDER, not a form. The onboarding flow links here but
// sign-in/registration is Tier 1 (depends on the identity model) and is not
// built in this milestone. No fields, no mock — just an honest boundary.
export default function SignIn() {
  const router = useRouter();
  return (
    <View className="bg-surface-page flex-1 items-center justify-center gap-3 px-8">
      <Text className="text-content-primary text-2xl font-semibold tracking-tight">Sign in</Text>
      <Text className="text-content-secondary max-w-xs text-center text-sm">
        Accounts arrive in the next milestone. This is where you’ll sign in.
      </Text>
      <Button title="Back" variant="ghost" onPress={() => router.back()} className="mt-2" />
    </View>
  );
}
