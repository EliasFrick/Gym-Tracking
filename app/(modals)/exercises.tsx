import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  FlatList,
  RefreshControl,
} from "react-native";
import { Text } from "tamagui";
import { fetchDataFromFirestore } from "@/database/FetchDataFromFirestore";
import { fetchCustomExercises } from "@/database/fetchCustomExercises";
import { collection, deleteDoc, doc, DocumentData } from "firebase/firestore";
import { Stack, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { firestoreDB } from "@/database/Firebaseconfig";
import { useUser } from "@/context/UserProvider";
import { Swipeable } from "react-native-gesture-handler";
// If you're using Expo Router, you may need a different focus hook.
// This import is from React Navigation:
import { useFocusEffect } from "@react-navigation/native";
import { SheetManager } from "react-native-actions-sheet";

const { width, height } = Dimensions.get("window");
const MUSCLE_GROUP_ORDER = ["Arms", "Chest", "Back", "Shoulder", "Legs"];

/**
 * A separate component for each exercise row.
 * This allows us to safely use hooks (like useRef) at the top level.
 */
function ExerciseItem({
  item,
  deleteExerciseById,
  loadExercises,
}: {
  item: DocumentData;
  deleteExerciseById: (id: string) => Promise<void>;
  loadExercises: () => Promise<void>;
}) {
  const swipeableRef = React.useRef<Swipeable>(null);

  const handleDelete = () => {
    Alert.alert(
      "Delete Exercise",
      "Do you want to delete this Exercise?",
      [
        {
          text: "Cancel",
          onPress: () => swipeableRef.current?.close(),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await deleteExerciseById(item.id);
            swipeableRef.current?.close();
            loadExercises();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => (
        <TouchableOpacity style={styles.deleteContainer} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
      onSwipeableRightOpen={handleDelete}
    >
      <View style={styles.exerciseCard}>
        <Text style={styles.exerciseName}>{item.name}</Text>
      </View>
    </Swipeable>
  );
}

export default function ExercisesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"default" | "custom">("default");
  const [defaultExercises, setDefaultExercises] = useState<DocumentData[]>([]);
  const [customExercises, setCustomExercises] = useState<DocumentData[]>([]);
  const { userData } = useUser();
  const [refreshing, setRefreshing] = useState(false);

  const loadExercises = async () => {
    try {
      if (activeTab === "default") {
        const result = await fetchDataFromFirestore({
          collectionName: "DefaultExercises",
        });
        setDefaultExercises(result);
      } else {
        const result = await fetchCustomExercises();
        setCustomExercises(result);
      }
    } catch (error) {
      console.log("Error loading exercises:", error);
    }
  };

  // Refresh exercises automatically when the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadExercises();
    }, [activeTab])
  );

  // Gruppiere Übungen nach Muskelgruppen
  const groupedExercises = React.useMemo(() => {
    const exercises =
      activeTab === "default" ? defaultExercises : customExercises;
    return MUSCLE_GROUP_ORDER.reduce((acc, group) => {
      acc[group] = exercises.filter((exercise) => exercise.mainGroup === group);
      return acc;
    }, {} as Record<string, DocumentData[]>);
  }, [activeTab, defaultExercises, customExercises]);

  const deleteExerciseById = async (id: string) => {
    try {
      const usersCollection = collection(firestoreDB, "User");
      const userRef = doc(usersCollection, userData?.uId);
      const exerciseRef = collection(userRef, "Exercises");
      const exericseDocRef = doc(exerciseRef, id);

      await deleteDoc(exericseDocRef);
      alert("Workout deleted successfully!");
    } catch (error) {
      console.error("Error deleting Exercise:", error);
      alert("Error deleting Exercise. Please try again.");
    }
  };

  const renderExerciseItem = ({ item }: { item: DocumentData }) => {
    return (
      <ExerciseItem
        item={item}
        deleteExerciseById={deleteExerciseById}
        loadExercises={loadExercises}
      />
    );
  };

  const openExerciseActionSheet = () => {
    SheetManager.show("add-exercise-modal-sheet");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExercises();
    setRefreshing(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <AntDesign name="arrowleft" size={24} color="#F86E51" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Exercises</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "default" && styles.activeTab]}
            onPress={() => setActiveTab("default")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "default" && styles.activeTabText,
              ]}
            >
              Default Exercises
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "custom" && styles.activeTab]}
            onPress={() => setActiveTab("custom")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "custom" && styles.activeTabText,
              ]}
            >
              My Exercises
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === "default" ? (
          <></>
        ) : (
          <View style={styles.addButtonContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                openExerciseActionSheet();
              }}
            >
              <Text style={styles.addButtonText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Exercise List */}
        <FlatList
          data={Object.entries(groupedExercises)}
          keyExtractor={(item) => item[0]}
          renderItem={({ item: [groupName, exercises] }) => (
            <View style={styles.groupContainer}>
              <Text style={styles.groupTitle}>{groupName}</Text>
              <FlatList
                data={exercises}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderExerciseItem}
              />
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  headerContainer: {
    backgroundColor: "#242424",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    marginTop: height * 0.05,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 16,
  },
  addButtonContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  addButton: {
    backgroundColor: "#F86E51",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    paddingTop: 20,
    backgroundColor: "#242424",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#F86E51",
  },
  tabText: {
    fontSize: 16,
    color: "#888",
  },
  activeTabText: {
    color: "#F86E51",
    fontWeight: "bold",
  },
  groupContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F86E51",
    marginBottom: 12,
  },
  exerciseCard: {
    backgroundColor: "#242424",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    marginBottom: 4,
  },
  deleteContainer: {
    backgroundColor: "#F86E51",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    paddingHorizontal: 20,
    height: height * 0.063,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});
