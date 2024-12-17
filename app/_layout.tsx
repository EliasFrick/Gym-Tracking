import { AuthenticationProvider } from "@/context/AuthenticationProvider";
import { Slot, Stack } from "expo-router";

export default function Layout() {
  return (
    <AuthenticationProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
          name="(auth)/register"
          options={{
            headerShown: false,
          }}
        /> */}
      </Stack>
    </AuthenticationProvider>
  );
}
