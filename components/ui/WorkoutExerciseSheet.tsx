import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import ActionSheet, {
  SheetProps,
  ActionSheetProps,
} from "react-native-actions-sheet";
import { Dimensions } from "react-native";
import { XStack, Button } from "tamagui";
import { ChevronLeft, ChevronRight, Plus } from "@tamagui/lucide-icons";
import { AppplicationContext } from "@/context/ApplicationProvider";
import { WorkoutExercise } from "@/types/interfaces";

const { width, height } = Dimensions.get("window");

interface ExerciseSet {
  reps: string;
  weight: string;
}

interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

type WorkoutExerciseSheetProps = ActionSheetProps & {
  payload?: {
    workoutId: string;
    currentWorkout: WorkoutExercise[];
  };
};

export const WorkoutExerciseSheet = (props: WorkoutExerciseSheetProps) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutLog, setWorkoutLog] = useState<{
    [key: string]: ExerciseSet[];
  }>({});

  useEffect(() => {
    if (!props.payload?.currentWorkout) {
      console.log("No workout data available");
      return;
    }

    try {
      const exercisesList = props.payload.currentWorkout.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        sets: [{ reps: "", weight: "" }],
      }));
      setExercises(exercisesList);

      // Initialize workout log
      const initialLog = exercisesList.reduce((acc, exercise) => {
        acc[exercise.id] = [{ reps: "", weight: "" }];
        return acc;
      }, {} as { [key: string]: ExerciseSet[] });
      setWorkoutLog(initialLog);
    } catch (error) {
      console.error("Error processing exercises:", error);
    }
  }, [props.payload?.currentWorkout]);

  const currentExercise = exercises[currentExerciseIndex];

  const handleNavigate = (direction: "prev" | "next") => {
    if (direction === "prev" && currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
    } else if (
      direction === "next" &&
      currentExerciseIndex < exercises.length - 1
    ) {
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  };

  const handleSetChange = (
    exerciseId: string,
    setIndex: number,
    field: "reps" | "weight",
    value: string
  ) => {
    setWorkoutLog((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map((set, idx) =>
        idx === setIndex ? { ...set, [field]: value } : set
      ),
    }));
  };

  const addSet = (exerciseId: string) => {
    setWorkoutLog((prev) => ({
      ...prev,
      [exerciseId]: [...prev[exerciseId], { reps: "", weight: "" }],
    }));
  };

  const saveWorkout = () => {
    const workoutData = {
      workoutId: props.payload?.workoutId,
      date: new Date().toISOString(),
      exercises: workoutLog,
    };
    console.log("Workout Data:", workoutData);
  };

  return (
    <ActionSheet
      containerStyle={styles.container}
      gestureEnabled={true}
      {...props}
    >
      <View style={styles.content}>
        {/* Navigation */}
        <XStack justifyContent="space-between" alignItems="center" padding="$4">
          <Button
            icon={ChevronLeft}
            disabled={currentExerciseIndex === 0}
            onPress={() => handleNavigate("prev")}
          />
          <Text style={styles.exerciseTitle}>{currentExercise?.name}</Text>
          <Button
            icon={ChevronRight}
            disabled={currentExerciseIndex === exercises.length - 1}
            onPress={() => handleNavigate("next")}
          />
        </XStack>
        {/*         <Text>Test {currentWorkout.name}</Text>
         */}
        {/* Sets */}
        {currentExercise &&
          workoutLog[currentExercise.id]?.map((set, index) => (
            <View key={index} style={styles.setContainer}>
              <Text style={styles.setLabel}>Set {index + 1}</Text>
              <XStack gap="$4">
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Reps</Text>
                  <TextInput
                    style={styles.input}
                    value={set.reps}
                    onChangeText={(value) =>
                      handleSetChange(currentExercise.id, index, "reps", value)
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={set.weight}
                    onChangeText={(value) =>
                      handleSetChange(
                        currentExercise.id,
                        index,
                        "weight",
                        value
                      )
                    }
                    keyboardType="numeric"
                  />
                </View>
              </XStack>
            </View>
          ))}
        {/* Add Set Button */}
        <Button
          icon={Plus}
          onPress={() => currentExercise && addSet(currentExercise.id)}
          style={styles.addSetButton}
        >
          Add Set
        </Button>
        {/* Save Button */}
        <Button theme="active" onPress={saveWorkout} style={styles.saveButton}>
          Save Workout
        </Button>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(48, 48, 49)",
    height: height * 0.8,
  },
  content: {
    padding: 16,
  },
  exerciseTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  setContainer: {
    marginVertical: 12,
  },
  setLabel: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    color: "white",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
  },
  addSetButton: {
    marginTop: 16,
  },
  saveButton: {
    marginTop: 24,
  },
});
