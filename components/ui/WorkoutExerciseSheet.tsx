import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import ActionSheet, {
  ActionSheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import { Dimensions } from "react-native";
import { XStack, Button, ScrollView } from "tamagui";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "@tamagui/lucide-icons";
import {
  ISet,
  IExerciseDuringWorkout,
  IPickedExercises,
} from "@/types/interfaces";
import {
  saveWorkoutProgress,
  getWorkoutProgress,
  removeWorkoutProgress,
} from "@/utils/storage";
import AntDesign from "@expo/vector-icons/AntDesign";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

import { auth, firestoreDB } from "@/database/Firebaseconfig";
import { WorkoutExerciseSheetProps } from "@/types/types";
import { getLastWorkoutDataForExercise } from "@/utils/workoutUtils";
const { width, height } = Dimensions.get("window");

export const WorkoutExerciseSheet = (props: WorkoutExerciseSheetProps) => {
  const [exercises, setExercises] = useState<IPickedExercises[] | undefined>(
    []
  );
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutLog, setWorkoutLog] = useState<{
    [key: string]: ISet[];
  }>({});
  const [lastWorkoutData, setLastWorkoutData] = useState<{
    [key: string]: { weight: string; reps: string; date: string } | null;
  }>({});

  // Load saved progress when opening
  useEffect(() => {
    const loadSavedProgress = async () => {
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
        }, {} as { [key: string]: ISet[] });
        setWorkoutLog(initialLog);
      }
    } catch (error) {
      console.error("Error processing exercises:", error);
    }
  }, [props.payload?.currentWorkout]);

  // Fetch last workout data for the current exercise
  useEffect(() => {
    const fetchLastWorkoutData = async () => {
      if (
        !exercises ||
        exercises.length === 0 ||
        currentExerciseIndex >= exercises.length
      ) {
        return;
      }

      const currentExercise = exercises[currentExerciseIndex];

      // Skip if we already have the data for this exercise
      if (lastWorkoutData[currentExercise.id]) {
        return;
      }

      const data = await getLastWorkoutDataForExercise(currentExercise.id);
      setLastWorkoutData((prev) => ({
        ...prev,
        [currentExercise.id]: data,
      }));
    };

    fetchLastWorkoutData();
  }, [currentExerciseIndex, exercises]);

  const currentExercise = exercises![currentExerciseIndex];

  const handleNavigate = (direction: "prev" | "next") => {
    if (direction === "prev" && currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
    } else if (
      direction === "next" &&
      currentExerciseIndex < exercises!.length - 1
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
    // Überprüfe alle Eingaben auf numerische Werte
    const hasInvalidInputs = Object.values(workoutLog).some((sets) =>
      sets.some((set) => {
        const reps = set.reps.trim().replace(",", ".");
        const weight = set.weight.trim().replace(",", ".");
        return (
          (reps && isNaN(Number(reps))) || (weight && isNaN(Number(weight)))
        );
      })
    );

    if (hasInvalidInputs) {
      Alert.alert(
        "Invalid Input",
        "Please enter only numbers for reps and weight. Use dots or commas for decimal numbers.",
        [{ text: "OK" }]
      );
      return;
    }

    const workoutData = {
      workoutId: props.payload?.workoutId,
      date: new Date().toISOString(),
      exercises: workoutLog,
    };

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert(
          "Error",
          "No user is signed in. Please sign in to save your workout."
        );
        return;
      }

      const docId = `${workoutData.workoutId.trim()}-${workoutData.date}`;
      const workoutDocRef = doc(
        firestoreDB,
        "User",
        user.uid,
        "WorkoutHistory",
        docId
      );
      await setDoc(workoutDocRef, workoutData);

      if (props.payload?.workoutId) {
        await removeWorkoutProgress(props.payload.workoutId);
      }
      setWorkoutLog({});
      setExercises([]);
      setCurrentExerciseIndex(0);
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

  const handleAddExercise = () => {
    openExercisePicker();
  };

  const openExercisePicker = () => {
    SheetManager.show("add-exercise-for-Workout-modal-sheet", {
      payload: {
        pickedExercises: exercises,
        setPickedExercises: (updaterOrExercises) => {
          // If it's a function, call it with the current exercises
          if (typeof updaterOrExercises === "function") {
            const updatedExercises = updaterOrExercises(exercises);
            processNewExercises(updatedExercises);
          } else {
            // Otherwise, use it directly
            processNewExercises(updaterOrExercises);
          }
        },
      },
    });
  };

  // Helper function to process new exercises
  const processNewExercises = (newExercises: any) => {
    if (!newExercises || !Array.isArray(newExercises)) return;

    // Check if we've added a new exercise
    if (newExercises.length > (exercises?.length || 0)) {
      const lastExercise = newExercises[newExercises.length - 1];

      if (lastExercise && lastExercise.id) {
        // Update workout log with the new exercise
        setWorkoutLog((prev) => ({
          ...prev,
          [lastExercise.id]: [{ reps: "", weight: "" }],
        }));

        askToSavePermanently(lastExercise);
      }
    }

    // Update exercises state
    setExercises(newExercises);
  };

  /* const openCreateExercise = () => {
    SheetManager.show("add-exercise-modal-sheet", {
      payload: {
        onExerciseCreated: (newExercise) => {
          // Initialisiere workoutLog für die neue Übung
          setWorkoutLog((prev) => ({
            ...prev,
            [newExercise.id]: [{ reps: "", weight: "" }],
          }));
          askToSavePermanently(newExercise);
          setExercises([...exercises, newExercise]);
        },
      },
    });
  }; */

  const askToSavePermanently = (exercise: IExerciseDuringWorkout) => {
    Alert.alert(
      "Save Exercise",
      "Would you like to add this exercise permanently to this workout?",
      [
        {
          text: "Yes",
          onPress: () => saveExercisePermanently(exercise),
        },
        {
          text: "No, just for this session",
          style: "cancel",
        },
      ]
    );
  };

  const saveExercisePermanently = async (exercise: IExerciseDuringWorkout) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const workoutRef = doc(
        firestoreDB,
        "User",
        user.uid,
        "Workouts",
        props?.payload?.workoutId || ""
      );

      // Aktuelles Workout abrufen
      const workoutDoc = await getDoc(workoutRef);
      if (workoutDoc.exists()) {
        const workoutData = workoutDoc.data();
        const currentExercises = workoutData.exercises || [];

        // Neue Übung hinzufügen
        await updateDoc(workoutRef, {
          exercises: [
            ...currentExercises,
            {
              id: exercise.id,
              name: exercise.name,
            },
          ],
        });

        Alert.alert("Success", "Exercise permanently added to workout!");
      }
    } catch (error) {
      console.error("Error saving exercise:", error);
      Alert.alert("Error", "Failed to save exercise permanently");
    }
  };
  /*   console.log(lastWorkoutData[currentExercise.id]);
   */
  return (
    <ActionSheet
      containerStyle={styles.container}
      gestureEnabled={false}
      closeOnTouchBackdrop={true}
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

        {/* Last Workout Data - separat nach dem XStack */}
        {currentExercise && lastWorkoutData[currentExercise.id] && (
          <View style={styles.lastWorkoutDataContainer}>
            <Text style={styles.lastWorkoutData}>
              Letztes Training: {lastWorkoutData[currentExercise.id]?.weight} kg
              × {lastWorkoutData[currentExercise.id]?.reps} Wiederholungen (
              {lastWorkoutData[currentExercise.id]?.date})
            </Text>
          </View>
        )}

        {/* Add Exercise Button */}
        <Button
          icon={Plus}
          onPress={handleAddExercise}
          style={styles.addExerciseButton}
        >
          Add Exercise
        </Button>

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
                          /*                           keyboardType="numeric"
                           */
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Weight</Text>
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
                          /*                           keyboardType="numeric"
                           */
                        />
                      </View>
                      {isLastSet && (
                        <TouchableOpacity
                          onPress={() => deleteSet(currentExercise.id, index)}
                          style={styles.deleteSetButton}
                        >
                          <AntDesign name="delete" size={24} color="white" />
                        </TouchableOpacity>
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
  lastWorkoutData: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  lastWorkoutDataContainer: {
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
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
  addExerciseButton: {
    marginVertical: 10,
    backgroundColor: "#4a4a4a",
  },
});
