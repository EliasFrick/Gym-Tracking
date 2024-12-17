import { AuthenticationProvider } from "@/context/AuthenticationProvider";
import { Slot, Stack } from "expo-router";

export default function Layout() {
  return (
    <AuthenticationProvider>
      {/* <Slot /> */}
      <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

    </AuthenticationProvider>
  );
}
