import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Text, Select } from "tamagui";
import { Stack, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, firestoreDB } from "@/database/Firebaseconfig";
import { UserInfo } from "@/types/interfaces";
import { SheetManager } from "react-native-actions-sheet";
import { deleteUser } from "firebase/auth";

// Definiere die Diät-Optionen
const DIET_OPTIONS = [
  { label: "Bulk", value: "bulking" },
  { label: "Cut", value: "cutting" },
  { label: "Maintaining", value: "maintaining" },
] as const;

export default function ProfileInformationScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "",
    firstName: "",
    lastName: "",
    height: "",
    diet: "maintaining",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(firestoreDB, "User", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserInfo({
          username: data.userName || "",
          firstName: data.firstname || "",
          lastName: data.lastname || "",
          height: data.height?.toString() || "",
          diet: data.diet || "maintaining",
        });
      }
    } catch (error) {
      console.error("Error loading user info:", error);
      Alert.alert("Error", "Failed to load user information");
    } finally {
      setLoading(false);
    }
  };

  const saveUserInfo = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      if (!userInfo.username.trim()) {
        Alert.alert("Error", "Username is required");
        return;
      }

      await updateDoc(doc(firestoreDB, "User", user.uid), {
        userName: userInfo.username,
        firstname: userInfo.firstName,
        lastname: userInfo.lastName,
        height: parseFloat(userInfo.height) || 0,
        diet: userInfo.diet,
        updatedAt: new Date(),
      });

      Alert.alert("Success", "Profile information updated successfully");
      router.back();
    } catch (error) {
      console.error("Error saving user info:", error);
      Alert.alert("Error", "Failed to save user information");
    }
  };

  const openDietSelector = () => {
    SheetManager.show("diet-selector-sheet", {
      payload: {
        selectedDiet: userInfo.diet || "",
        onSelect: (diet: string) => {
          setUserInfo((prev) => ({
            ...prev,
            diet: diet as typeof userInfo.diet,
          }));
        },
      },
    });
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) return;

              // Delete user data from Firestore
              await deleteDoc(doc(firestoreDB, "User", user.uid));

              // Delete the user authentication account
              await deleteUser(user);

              Alert.alert("Success", "Your account has been deleted");
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert(
                "Error",
                "Failed to delete account. You may need to re-authenticate first."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Profile Information",
          headerStyle: {
            backgroundColor: "#1A1A1A",
          },
          headerTintColor: "white",
          presentation: "modal",
          headerLeft: () => (
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
      <ScrollView style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={userInfo.username}
            onChangeText={(text) =>
              setUserInfo((prev) => ({ ...prev, username: text }))
            }
            placeholder="Enter username"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={userInfo.firstName}
            onChangeText={(text) =>
              setUserInfo((prev) => ({ ...prev, firstName: text }))
            }
            placeholder="Enter first name"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={userInfo.lastName}
            onChangeText={(text) =>
              setUserInfo((prev) => ({ ...prev, lastName: text }))
            }
            placeholder="Enter last name"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={userInfo.height}
            onChangeText={(text) =>
              setUserInfo((prev) => ({ ...prev, height: text }))
            }
            placeholder="Enter height in cm"
            keyboardType="numeric"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Diet Goal</Text>
          <TouchableOpacity style={styles.input} onPress={openDietSelector}>
            <Text style={{ color: "white", fontSize: 16 }}>
              {DIET_OPTIONS.find((option) => option.value === userInfo.diet)
                ?.label || "Select diet goal"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveUserInfo}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>

        {/* Delete Account Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#242424",
    padding: 15,
    borderRadius: 8,
    color: "white",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#F86E51",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectContainer: {
    backgroundColor: "#242424",
    borderRadius: 8,
    overflow: "hidden",
  },
  select: {
    color: "white",
  },
  selectTrigger: {
    backgroundColor: "#242424",
    padding: 15,
    borderRadius: 8,
  },
  selectItem: {
    backgroundColor: "#242424",
    padding: 15,
  },
  deleteButton: {
    backgroundColor: "#2A2A2A",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "bold",
  },
});
