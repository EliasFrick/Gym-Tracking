import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useState, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { AddDropOver } from "@/components/ui/AddDropOver";

export default function WorkoutLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  /* useLayoutEffect(() => {
    console.log("Setting header options");
    navigation.setOptions({
      headerTitle: "Start Training",
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
          <AddDropOver />
        </View>
      ),
      headerStyle: {
        backgroundColor: "#F86E51",
      },
      headerTintColor: "#fff",
    });
  }, [navigation]); */

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
          headerTitle: "Start Training",
          headerRight: () => (
            <View style={{ marginRight: 10 }}>
              <AddDropOver />
            </View>
          ),
          headerStyle: {
            backgroundColor: "#F86E51",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen name="createOwnPlan" options={{ headerShown: true }} />
    </Stack>
  );
}
