import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useState, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { PopOverAddExercises } from "@/components/ui/PopOverAddExercises";

export default function WorkoutLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

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
