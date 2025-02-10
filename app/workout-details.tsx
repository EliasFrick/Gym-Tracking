// WorkoutDetailsScreen.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Text, Card, XStack } from "tamagui";
import { useLocalSearchParams } from "expo-router";
import { query, collection, where, getDocs } from "firebase/firestore";
import { firestoreDB } from "@/database/Firebaseconfig";

const { width } = Dimensions.get("window");

interface ExerciseSet {
  reps: string;
  weight: string;
}

interface WorkoutExercises {
  [key: string]: ExerciseSet[];
}

/**
 * Given an exercise id, this function queries the DefaultExercises
 * collection to find a document where the "id" field matches.
 * It returns the document's "name" field if found,
 * otherwise it returns "name not found".
 */
async function getExerciseName(exerciseId: string): Promise<string> {
  try {
    const q = query(
      collection(firestoreDB, "DefaultExercises"),
      where("id", "==", exerciseId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnapshot = querySnapshot.docs[0];
      const data = docSnapshot.data();
      return data?.name || "name not found";
    }
    return "name not found";
  } catch (error) {
    console.error("Error fetching exercise name for id", exerciseId, error);
    return "name not found";
  }
}

export default function WorkoutDetailsScreen() {
  const params = useLocalSearchParams();
  const decodedExercises = decodeURIComponent(params.exercises as string);
  const workoutExercises: WorkoutExercises = JSON.parse(decodedExercises);
  const [exerciseNames, setExerciseNames] = useState<{ [key: string]: string }>(
    {}
  );

  // Fetch exercise names from DefaultExercises collection based on the exercise ids
  useEffect(() => {
    async function fetchExerciseNames() {
      const exerciseIds = Object.keys(workoutExercises);
      const names: { [key: string]: string } = {};
      await Promise.all(
        exerciseIds.map(async (exerciseId) => {
          const name = await getExerciseName(exerciseId);
          names[exerciseId] = name;
        })
      );
      setExerciseNames(names);
    }
    fetchExerciseNames();
  }, [workoutExercises]);

  const renderExerciseCard = (exerciseId: string, sets: ExerciseSet[]) => {
    return (
      <Card
        key={exerciseId}
        elevate
        size="$4"
        width={width * 0.9}
        margin={10}
        backgroundColor="$background"
      >
        <Card.Header padded>
          <Text
            color="$color"
            fontSize={18}
            fontWeight="bold"
            marginBottom={10}
          >
            {exerciseNames[exerciseId] || exerciseId}
          </Text>
          {sets.map((set, index) => (
            <View key={index} style={styles.setContainer}>
              <Text color="$color12" fontSize={16}>
                Set {index + 1}
              </Text>
              <XStack gap={20} marginTop={5}>
                <Text color="$color12" fontSize={14}>
                  {set.reps} reps
                </Text>
                <Text color="$color12" fontSize={14}>
                  {set.weight} kg
                </Text>
              </XStack>
            </View>
          ))}
        </Card.Header>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{params.workoutId}</Text>
        <Text style={styles.date}>
          {new Date(params.date as string).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        {Object.entries(workoutExercises).map(([exerciseId, sets]) =>
          renderExerciseCard(exerciseId, sets)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  setContainer: {
    marginVertical: 5,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
});
