import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, StyleSheet } from "react-native";
import FeatherIcons from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { scale } from "react-native-size-matters";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: "rgb(48, 48, 49)",
        },
        headerStyle: {
          backgroundColor: "rgb(48, 48, 49)",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          headerTitleStyle: { fontSize: scale(18), color: "white" },
          tabBarIcon: ({ focused }) => (
            <Ionicons name="home" size={focused ? 30 : 25} color="white" />
          ),
          headerTitle: "Workout History",
        }}
      />
      <Tabs.Screen
        name="(workout)"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <Ionicons name="barbell" size={focused ? 38 : 35} color={"black"} />
            </View>
          ),
          headerShown: false,
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="weight"
        options={{
          title: "",
          headerTitleStyle: { fontSize: scale(18), color: "white" },
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name={focused ? "scale" : "scale-outline"} 
              size={focused ? 30 : 25} 
              color="white" 
            />
          ),
          headerTitle: "Weight Tracking",
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitleStyle: { fontSize: scale(18), color: "white" },
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={focused ? 30 : 25}
              color="white"
            />
          ),
          tabBarLabel: "",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
    backgroundColor: "white",
  },
  iconContainerFocused: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    /*     backgroundColor: "rgb(22, 22, 22)",
     */
    borderWidth: 1,
    borderColor: "white",
  },
  settingsIcon: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
