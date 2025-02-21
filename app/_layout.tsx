import { AuthenticationProvider } from "@/context/AuthenticationProvider";
import { Stack } from "expo-router";
import { createTamagui, TamaguiProvider, View } from "tamagui";
import defaultConfig from "@tamagui/config/v3";
import { PortalProvider } from "@tamagui/portal";
import { AppConfigProvider } from "@/context/AppConfigProvider";
import { SheetProvider } from "react-native-actions-sheet";
import "@/components/ReactNative ActionSheet Library/sheets";
import { ApplicationProvider } from "@/context/ApplicationProvider";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const config = createTamagui(defaultConfig);

export default function RootLayout() {
  const router = useRouter();

  return (
    <TamaguiProvider config={config}>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <PortalProvider>
        <SheetProvider>
          <AppConfigProvider>
            <ApplicationProvider>
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
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(auth)"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="workout-details"
                    options={{
                      presentation: "modal",
                      headerStyle: {
                        backgroundColor: "rgb(48, 48, 49)",
                      },
                      headerTintColor: "white",
                      headerTitle: "Workout Details",
                      headerShown: true,
                      gestureEnabled: true,
                      gestureDirection: "horizontal",
                      headerRight: () => (
                        <AntDesign
                          name="close"
                          size={24}
                          color="white"
                          style={{ marginLeft: 10 }}
                          onPress={() => router.back()}
                        />
                      ),
                    }}
                  />
                </Stack>
              </AuthenticationProvider>
            </ApplicationProvider>
          </AppConfigProvider>
        </SheetProvider>
      </PortalProvider>
      </GestureHandlerRootView>
    </TamaguiProvider>
  );
}
