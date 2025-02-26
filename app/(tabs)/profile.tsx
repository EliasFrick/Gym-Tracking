import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Button,
} from "react-native";
import { Text, YStack, XStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "@/database/Firebaseconfig";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { useUser } from "@/context/UserProvider";

export default function ProfileScreen() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const user = auth.currentUser;

  // Get user data and context methods
  const {
    userData,
    loading,
    error,
    refreshUserData,
    updateProfileImage,
    deleteProfileImage,
  } = useUser();

  useEffect(() => {
    // Whenever userData changes, sync local states
    if (userData) {
      setUsername(userData.userName ?? "");
      setProfileImage(userData.profileImage || null);
    }
  }, [userData]);

  const menuItems = [
    ...(userData?.prime
      ? [
          {
            icon: "analytics-outline",
            title: "AI Results",
            onPress: () => router.push("/(modals)/ai-results"),
          },
        ]
      : []),
    {
      icon: "barbell",
      title: "My Exercises",
      onPress: () => router.push("/(modals)/exercises"),
    },
    {
      icon: "person-outline",
      title: "Profile Information",
      onPress: () => router.push("/(modals)/profile-information"),
    },
    // You can add more menu items here...
  ];

  /**
   * Prompt user to pick an image and upload it via the UserProvider
   */
  const pickImage = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to access your photos"
        );
        return;
      }

      // Launch the Image Picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const localUri = result.assets[0].uri;
        // Use our context method to upload & update Firestore
        await updateProfileImage(localUri);
        // Force a data refresh or rely on local state
        refreshUserData();
      }
    } catch (err) {
      console.error("Error picking image:", err);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  /**
   * Delete the user's profile image from Firebase
   */
  const handleDeleteImage = async () => {
    Alert.alert(
      "Delete Image",
      "Are you sure you want to delete your profile picture?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteProfileImage();
            setProfileImage(null);
            refreshUserData();
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <View style={styles.container}>
      <YStack space="$4" padding="$4">
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("@/assets/Avatar.jpeg")
              }
              style={styles.avatar}
            />
            <View style={styles.editIconContainer}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>
            {loading ? "Loading..." : username || "No username"}
          </Text>
        </View>

        {/* Delete button (only if user has a profile image) */}
        {/* {profileImage ? (
          <Button
            title="Delete Profile Picture"
            onPress={handleDeleteImage}
            color="#FF6B6B"
          />
        ) : null} */}

        <YStack space="$3" style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
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

          <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
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
  avatarContainer: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#FF6B6B",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1A1A1A",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
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
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderBottomColor: "#333",
  },
});
