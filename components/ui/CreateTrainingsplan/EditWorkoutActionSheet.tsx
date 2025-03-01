import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import { Button, XStack } from "tamagui";
import { collection, doc, updateDoc } from "firebase/firestore";
import { firestoreDB, getAuth } from "@/database/Firebaseconfig";
import { AddExercisePanel } from "./AddWorkout/AddExercisePanel";
import { SavedExercisePanel } from "./AddWorkout/SavedExercisePanel";
import { IPickedExercises } from "@/types/interfaces";
import AntDesign from "@expo/vector-icons/AntDesign";
import { EditWorkoutActionSheetProps } from "@/types/types";
import { useUser } from "@/context/UserProvider";

const { width, height } = Dimensions.get("window");

export const EditWorkoutActionSheet = (props: EditWorkoutActionSheetProps) => {
  const [exercises, setExercises] = useState<IPickedExercises[] | undefined>(
    []
  );
  const auth = getAuth();
  const user = auth.currentUser;
  const { userData } = useUser();

  useEffect(() => {
    if (props.payload?.exercises) {
      setExercises(props?.payload?.exercises);
    }
  }, [props.payload?.exercises]);

  const handleSave = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "No user is signed in");
        return;
      }

      const workoutRef = doc(
        firestoreDB,
        "User",
        user?.uid,
        "Workouts",
        props.payload?.workoutId || ""
      );
      console.log(exercises);
      await updateDoc(workoutRef, {
        exercises: exercises,
      });

      Alert.alert("Success", "Workout updated successfully!");
      SheetManager.hide("edit-workout-sheet");
    } catch (error) {
      console.error("Error updating workout:", error);
      Alert.alert("Error", "Failed to update workout. Please try again.");
    }
  };

  const handleClose = () => {
    SheetManager.hide("edit-workout-sheet");
  };

  return (
    <ActionSheet
      id="edit-workout-sheet"
      containerStyle={styles.container}
      indicatorStyle={{ backgroundColor: "white" }}
    >
      <View style={styles.actionSheetContent}>
        {/* Header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingVertical={height * 0.02}
          style={styles.header}
        >
          <TouchableOpacity onPress={handleClose} style={{ padding: 10 }}>
            <AntDesign name="close" size={width * 0.08} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSave()}
            style={{ padding: 10 }}
          >
            <AntDesign name="save" size={width * 0.08} color="white" />
          </TouchableOpacity>
        </XStack>

        {/* Debug Text */}
        <Text style={styles.debugText}>
          {exercises?.length || 0} exercises loaded
        </Text>

        {/* ScrollView with defined height */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.addExerciseContainer}>
            <AddExercisePanel
              pickedExercises={exercises}
              setPickedExercises={setExercises}
            />
          </View>

          {/* List of current exercises */}
          <View style={styles.exerciseListContainer}>
            {exercises && exercises.length > 0 ? (
              exercises.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseItem}>
                  <SavedExercisePanel
                    id={exercise.id}
                    name={exercise.name}
                    primaryMuscle={exercise.primaryMuscle}
                    mainGroup={exercise.mainGroup}
                    pickedExercises={exercises}
                    setPickedExercises={setExercises}
                  />
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No exercises added yet</Text>
            )}
          </View>

          {/* Add extra padding at the bottom for better scrolling */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(48, 48, 49)",
    height: height * 0.85,
  },
  actionSheetContent: {},
  header: {
    paddingHorizontal: 10,
  },
  scrollView: {
    marginBottom: height * 0.05,
  },
  scrollViewContent: {
    alignItems: "center",
    paddingHorizontal: 15,
  },
  addExerciseContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: height * 0.07,
    marginTop: 10,
  },
  exerciseListContainer: {
    width: "100%",
    alignItems: "center",
  },
  exerciseItem: {
    width: "100%",
    marginBottom: 10,
  },
  debugText: {
    color: "white",
    textAlign: "center",
    marginVertical: 5,
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  bottomPadding: {
    height: 100, // Extra padding at bottom for better scrolling
  },
});
