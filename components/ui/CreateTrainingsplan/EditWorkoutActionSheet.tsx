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
    console.log(userData!.uId);

    try {
      if (!user) {
        Alert.alert("Error", "No user is signed in");
        return;
      }

      const workoutRef = doc(
        firestoreDB,
        "User",
        userData!.uId,
        "Workouts",
        props.payload?.workoutId || ""
      );

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

  console.log(exercises);
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
          paddingVertical={height * 0.04}
        >
          <TouchableOpacity onPress={handleClose} style={{ padding: 10 }}>
            <AntDesign name="close" size={width * 0.1} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={{ padding: 10 }}>
            <AntDesign name="save" size={width * 0.1} color="white" />
          </TouchableOpacity>
        </XStack>
        {/*         <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingVertical={height * 0.04}
        >
          <Button
            icon={<AntDesign name="close" size={width * 0.1} color="white" />}
            onPress={handleClose}
            backgroundColor="transparent"
          />
          <Button
            icon={<AntDesign name="save" size={width * 0.1} color="white" />}
            onPress={handleSave}
            backgroundColor="transparent"
          />
        </XStack>
 */}
        {/* Debug Text */}
        <Text style={styles.debugText}>
          {exercises?.length || 0} exercises loaded
        </Text>

        {/* Content Container with Explicit Height */}
        <View style={styles.scrollContainer}>
          {/* Use native React Native ScrollView instead of Tamagui ScrollView */}
          <View style={styles.scrollViewContent}>
            <View style={{ marginBottom: height * 0.1 }}>
              {/* Panel to add new exercises */}
              <AddExercisePanel
                pickedExercises={exercises}
                setPickedExercises={setExercises}
              />
            </View>

            {/* List of current exercises */}
            {exercises && exercises.length > 0 ? (
              exercises.map((exercise) => (
                <SavedExercisePanel
                  key={exercise.id}
                  id={exercise.id}
                  name={exercise.name}
                  primaryMuscle={exercise.primaryMuscle}
                  mainGroup={exercise.mainGroup}
                  pickedExercises={exercises}
                  setPickedExercises={setExercises}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No exercises added yet</Text>
            )}
          </View>
        </View>
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
  scrollContainer: {
    flex: 1,
    marginTop: 10,
  },
  scrollViewContent: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
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
});
