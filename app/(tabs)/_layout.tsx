import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, StyleSheet } from "react-native";
import FeatherIcons from "@expo/vector-icons/Feather";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: "#F86E51",
        },
        headerStyle: {
          backgroundColor: "#F86E51",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              name="house.fill"
              size={focused ? 35 : 29}
              color={"black"}
            />
          ),
          headerTitle: "Training",
        }}
      />
      <Tabs.Screen
        name="(workout)"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}
            >
              <Ionicons
                name="barbell"
                size={focused ? 38 : 35}
                color={"black"}
              />
            </View>
          ),
          headerShown: false,
          tabBarLabel: "",
          headerTitle: "Training",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.settingsIcon]}>
              <FeatherIcons
                name="settings"
                size={focused ? 33 : 29}
                color={"black"}
              />
            </View>
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
    borderRadius: 35, // Macht den Hintergrund rund
    backgroundColor: "#F86E51", // Roter Hintergrund, wenn aktiv
  },
  iconContainerFocused: {
    width: 70,
    height: 70,
    backgroundColor: "#F86E51", // Roter Hintergrund, wenn aktiv
  },
  settingsIcon: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
