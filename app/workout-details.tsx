import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Text, Card, XStack } from "tamagui";
import { useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

interface ExerciseSet {
  reps: string;
  weight: string;
}

interface WorkoutExercises {
  [key: string]: ExerciseSet[];
}

export default function WorkoutDetailsScreen() {
  const params = useLocalSearchParams();
  // Decode the exercises parameter before parsing it
  const decodedExercises = decodeURIComponent(params.exercises as string);
  const workoutExercises: WorkoutExercises = JSON.parse(decodedExercises);

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
            {exerciseId}
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
