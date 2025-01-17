import { AuthenticationProvider } from "@/context/AuthenticationProvider";
import { Stack } from "expo-router";
import { createTamagui, TamaguiProvider, View } from "tamagui";
import defaultConfig from "@tamagui/config/v3";
import { PortalProvider } from "@tamagui/portal";
import { AppConfigProvider } from "@/context/AppConfigProvider";

const config = createTamagui(defaultConfig);

export default function Layout() {
  return (
    <TamaguiProvider config={config}>
      <PortalProvider shouldAddRootHost>
        <AppConfigProvider>
          <AuthenticationProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                headerStyle: {
                  backgroundColor: "#f4511e",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(auth)"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </AuthenticationProvider>
        </AppConfigProvider>
      </PortalProvider>
    </TamaguiProvider>
  );
}
