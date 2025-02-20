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
import { auth, storage } from "@/database/Firebaseconfig";
import { router, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firestoreDB } from "@/database/Firebaseconfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, doc, getDoc } from "firebase/firestore"; // updateDoc falls du auch Firestore updaten möchtest
import { LineGraph } from "react-native-graph";

const menuItems = [
  {
    icon: "analytics-outline",
    title: "AI Results",
    onPress: () => router.push("/(modals)/ai-results"),
  },
  /* {
    icon: "person-outline",
    title: "Personal Data",
    route: "/personal-data",
  },
  {
    icon: "settings-outline",
    title: "Settings",
    route: "/settings",
  }, */
];

export default function ProfileScreen() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const user = auth.currentUser;
  const [inputText, setInputText] = useState("Hey Gemini mein name ist Elias");
  const [responseText, setResponseText] = useState("gg");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Lade gespeichertes Profilbild
        const savedImage = await AsyncStorage.getItem("profileImage");
        if (savedImage) {
          setProfileImage(savedImage);
        }

        // Versuche zuerst den Username aus dem LocalStorage zu laden
        const cachedUsername = await AsyncStorage.getItem("userName");
        if (cachedUsername) {
          setUsername(cachedUsername);
        }

        // Wenn online, aktualisiere den Username aus Firestore
        if (user) {
          const userDoc = await getDoc(doc(firestoreDB, "User", user.uid));
          if (userDoc.exists()) {
            const firestoreUsername = userDoc.data().userName;
            setUsername(firestoreUsername);
            // Speichere den aktuellen Username im LocalStorage
            await AsyncStorage.setItem("userName", firestoreUsername);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, [user]);

  const pickImage = async () => {
    try {
      // Frage nach Erlaubnis
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to access your photos"
        );
        return;
      }

      // Starte den ImagePicker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const localUri = result.assets[0].uri;

        try {
          // Speichere das Bild im LocalStorage
          await AsyncStorage.setItem("profileImage", localUri);
          setProfileImage(localUri);

          // Optional: Wenn online, auch in Firebase speichern
          if (user) {
            const firebaseUrl = await uploadImageToFirebase(localUri);
            if (firebaseUrl) {
              await updateDoc(doc(firestoreDB, "User", user.uid), {
                profileImage: firebaseUrl,
              });
            }
          }
        } catch (error) {
          console.error("Error saving image:", error);
          Alert.alert("Error", "Failed to save image");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

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

  const uploadImageToFirebase = async (uri: string): Promise<string | null> => {
    if (!user) return null;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePhotos/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image to Firebase:", error);
      return null;
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
          <Text style={styles.name}>{username || "Loading..."}</Text>
        </View>
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
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomColor: "#333",
  },
});
