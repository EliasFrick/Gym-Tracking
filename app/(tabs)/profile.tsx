import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text, YStack, XStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "@/database/Firebaseconfig";
import { useRouter } from "expo-router";

const menuItems = [
  {
    icon: "time-outline",
    title: "Workout History",
    route: "/(tabs)/index",
  },
  {
    icon: "person-outline",
    title: "Personal Data",
    route: "/personal-data",
  },
  {
    icon: "settings-outline",
    title: "Settings",
    route: "/settings",
  },
  {
    icon: "shield-outline",
    title: "Privacy Policy",
    route: "/privacy",
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleMenuItemPress = (route: string) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <YStack space="$4" padding="$4">
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={require("@/assets/Avatar.jpeg")}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.displayName || "User"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Menu Items */}
        <YStack space="$3" style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.route)}
            >
              <XStack space="$3" alignItems="center">
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon as any} size={24} color="#FF6B6B" />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </XStack>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}

          {/* Logout Button */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <XStack space="$3" alignItems="center">
              <View style={styles.iconContainer}>
                <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
              </View>
              <Text style={styles.menuText}>Log out</Text>
            </XStack>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </YStack>
      </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  menuContainer: {
    backgroundColor: "#242424",
    borderRadius: 15,
    padding: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    color: "white",
  },
});
