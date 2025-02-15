import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import ActionSheet, {
  SheetProps,
  ActionSheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import { Dimensions } from "react-native";
import { XStack, Button, ScrollView } from "tamagui";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "@tamagui/lucide-icons";
import { AppplicationContext } from "@/context/ApplicationProvider";
import { WorkoutExercise } from "@/types/interfaces";
import {
  saveWorkoutProgress,
  getWorkoutProgress,
  removeWorkoutProgress,
} from "@/utils/storage";

// Import Firestore functions and firebase services
import { doc, setDoc } from "firebase/firestore";

import { auth, firestoreDB } from "@/database/Firebaseconfig";
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

  // Load saved progress when opening
  useEffect(() => {
    /*     console.log("props", props);
     */ const loadSavedProgress = async () => {
      if (!props.payload?.workoutId) return;

      const savedProgress = await getWorkoutProgress(props.payload.workoutId);
      if (savedProgress) {
        setWorkoutLog(savedProgress.workoutLog);
        setCurrentExerciseIndex(savedProgress.currentExerciseIndex);
      }
    };

    loadSavedProgress();
  }, [props.payload?.workoutId]);

  // Save progress on changes
  useEffect(() => {
    if (!props.payload?.workoutId || Object.keys(workoutLog).length === 0)
      return;

    saveWorkoutProgress(props.payload.workoutId, {
      workoutLog,
      currentExerciseIndex,
      lastUpdated: new Date().toISOString(),
    });
  }, [workoutLog, currentExerciseIndex, props.payload?.workoutId]);

  // Initialize exercises
  useEffect(() => {
    if (!props.payload?.currentWorkout) {
      console.log("No workout data available");
      return;
    }

    try {
      const exercisesList = props.payload.currentWorkout.map((exercise) => {
        return {
          id: exercise.id,
          name: exercise.name,
          sets: [{ reps: "", weight: "" }],
        };
      });
      setExercises(exercisesList);

      // If there's no saved data, initialize new workout log
      if (Object.keys(workoutLog).length === 0) {
        const initialLog = exercisesList.reduce((acc, exercise) => {
          acc[exercise.id] = [{ reps: "", weight: "" }];
          return acc;
        }, {} as { [key: string]: ExerciseSet[] });
        setWorkoutLog(initialLog);
      }
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

  const deleteSet = (exerciseId: string, setIndex: number) => {
    setWorkoutLog((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].filter((_, idx) => idx !== setIndex),
    }));
  };

  const saveWorkout = async () => {
    const workoutData = {
      workoutId: props.payload?.workoutId,
      date: new Date().toISOString(),
      exercises: workoutLog,
    };
    console.log("Workout Data:", workoutData);

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert(
          "Error",
          "No user is signed in. Please sign in to save your workout."
        );
        return;
      }
      // Create document ID: workoutId (trimmed) + '-' + current ISO date/time
      const docId = `${workoutData.workoutId.trim()}-${workoutData.date}`;
      const workoutDocRef = doc(
        firestoreDB,
        "User",
        user.uid,
        "WorkoutHistory",
        docId
      );
      await setDoc(workoutDocRef, workoutData);

      // Remove saved progress
      if (props.payload?.workoutId) {
        await removeWorkoutProgress(props.payload.workoutId);
      }
      // Clear local workout data so that text inputs are empty
      setWorkoutLog({});
      setExercises([]);
      setCurrentExerciseIndex(0);
      // Alert the user and close the Action Sheet
      Alert.alert("Success", "Workout saved successfully!");
      SheetManager.hide("workout-exercise-sheet");
    } catch (error) {
      console.error("Error saving workout:", error);
      Alert.alert(
        "Error",
        "There was an error saving your workout. Please try again."
      );
    }
  };

  const handleReset = () => {
    Alert.alert(
      "End Workout",
      "Are you sure you want to end this workout? All progress will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "End Workout",
          style: "destructive",
          onPress: async () => {
            if (!props.payload?.workoutId) return;
            await removeWorkoutProgress(props.payload.workoutId);
            SheetManager.hide("workout-exercise-sheet");
          },
        },
      ]
    );
  };

  return (
    <ActionSheet
      containerStyle={styles.container}
      gestureEnabled={false}
      closeOnTouchBackdrop={true}
      keyboardShouldPersistTaps="handled"
      onTouchEnd={() => Keyboard.dismiss()}
      {...props}
    >
      <View style={styles.content}>
        {/* Navigation */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          padding="$4"
          style={styles.navigationContainer}
        >
          <Button
            icon={ChevronLeft}
            disabled={currentExerciseIndex === 0}
            onPress={() => handleNavigate("prev")}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.exerciseTitle}>
              {currentExercise?.name ?? "Loading..."}
            </Text>
          </View>
          <Button
            icon={ChevronRight}
            disabled={currentExerciseIndex === exercises.length - 1}
            onPress={() => handleNavigate("next")}
          />
        </XStack>

        {/* Scrollable Area */}
        <View style={styles.scrollableWrapper}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
          >
            {currentExercise &&
              workoutLog[currentExercise.id]?.map((set, index) => {
                const isLastSet =
                  index === workoutLog[currentExercise.id].length - 1;
                return (
                  <View key={index} style={styles.setContainer}>
                    <Text style={styles.setLabel}>Set {index + 1}</Text>
                    <XStack gap="$4" alignItems="center">
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Reps</Text>
                        <TextInput
                          style={styles.input}
                          value={set.reps}
                          onChangeText={(value) =>
                            handleSetChange(
                              currentExercise.id,
                              index,
                              "reps",
                              value
                            )
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
                      {isLastSet && (
                        <Button
                          icon={Trash2}
                          onPress={() => deleteSet(currentExercise.id, index)}
                          style={styles.deleteSetButton}
                          size="$2"
                          chromeless
                        />
                      )}
                    </XStack>
                  </View>
                );
              })}
            {/* Add Set Button */}

            <Button
              icon={Plus}
              onPress={() => currentExercise && addSet(currentExercise.id)}
              style={styles.addSetButton}
            >
              Add Set
            </Button>
          </ScrollView>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          {/* Save Button */}
          <Button
            theme="active"
            onPress={saveWorkout}
            style={styles.saveButton}
          >
            Save Workout
          </Button>

          {/* Reset Button */}
          <Button
            theme="danger"
            onPress={handleReset}
            style={styles.resetButton}
          >
            Cancel Current Workout
          </Button>
        </View>
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
    flex: 1,
    padding: 16,
  },
  scrollableWrapper: {
    height: height * 0.45,
    borderRadius: 8,
    marginVertical: 10,
  },
  scrollContent: {
    padding: 10,
  },
  buttonsContainer: {},
  navigationContainer: {
    width: "100%",
    marginBottom: 10,
    minHeight: 50, // Minimum height added
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
    minHeight: 30, // Minimum height added
    justifyContent: "center", // Vertical centering
  },
  exerciseTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    width: "100%", // Full width
    zIndex: 1, // Higher z-index
  },
  setContainer: {
    marginVertical: 12,
    paddingHorizontal: 10,
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
  resetButton: {
    marginTop: 32,
    backgroundColor: "red",
  },
  saveButton: {
    marginTop: 24,
  },
  deleteSetButton: {
    padding: 0,
    color: "red",
    marginLeft: 8,
    alignSelf: "flex-end",
    marginBottom: 4,
  },
});
