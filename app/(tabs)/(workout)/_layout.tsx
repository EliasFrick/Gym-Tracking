import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
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
        name="index"
        options={{
          headerStyle: {
            backgroundColor: "#F86E51",
          },
          headerTintColor: "black",
        }}
      />
    </Stack>
  );
}
