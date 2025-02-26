import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Text } from "tamagui";
import { fetchDataFromFirestore } from "@/database/FetchDataFromFirestore";
import { fetchCustomExercises } from "@/database/fetchCustomExercises";
import { DocumentData } from "firebase/firestore";
import { Stack, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const MUSCLE_GROUP_ORDER = ["Arms", "Chest", "Back", "Shoulder", "Legs"];

export default function ExercisesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"default" | "custom">("default");
  const [defaultExercises, setDefaultExercises] = useState<DocumentData[]>([]);
  const [customExercises, setCustomExercises] = useState<DocumentData[]>([]);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    if (activeTab === "default") {
      const result = await fetchDataFromFirestore({
        collectionName: "DefaultExercises",
      });
      setDefaultExercises(result);
    } else {
      const result = await fetchCustomExercises();
      setCustomExercises(result);
    }
  };

  // Gruppiere Übungen nach Muskelgruppen
  const groupedExercises = React.useMemo(() => {
    const exercises =
      activeTab === "default" ? defaultExercises : customExercises;
    return MUSCLE_GROUP_ORDER.reduce((acc, group) => {
      acc[group] = exercises.filter((exercise) => exercise.mainGroup === group);
      return acc;
    }, {} as Record<string, DocumentData[]>);
  }, [activeTab, defaultExercises, customExercises]);
  console.log(customExercises);

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
            onPress={() => {
              setActiveTab("default");
              loadExercises();
            }}
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
            onPress={() => {
              setActiveTab("custom");
              loadExercises();
            }}
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

        {/* Exercise List */}
        <ScrollView style={styles.scrollView}>
          {Object.entries(groupedExercises).map(([groupName, exercises]) => (
            <View key={groupName} style={styles.groupContainer}>
              <Text style={styles.groupTitle}>{groupName}</Text>
              {exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseCard}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetail}>
                    {/*                     Primary Muscle: {exercise.primaryMuscle?.join(", ")}
                     */}{" "}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  groupContainer: {
    marginBottom: 24,
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
  exerciseDetail: {
    fontSize: 14,
    color: "#888",
  },
});
