import React, { useContext, useState } from "react";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { XStack } from "tamagui";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AddWorkoutComponent } from "./AddWorkout/AddWorkoutComponente";
import { AppConfigContext } from "@/context/AppConfigProvider";
import {
  ICreateCustomExercise,
  IPickedExercises,
  IWorkoutInfrmations,
} from "@/types/interfaces";
import { getAuth } from "firebase/auth";
import { firestoreDB } from "@/database/Firebaseconfig";
import { collection, doc, setDoc as firebaseSetDoc } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

export const AddWorkoutActionSheet = (
  props: SheetProps<"add-workout-modal-sheet">
) => {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;
  const [workout, setWorkout] = useState<IPickedExercises[]>();

  const [customExercise, setCustomExercise] = useState<ICreateCustomExercise>({
    userID: firebaseUser!.uid,
    name: "",
    description: "",
    primaryMuscle: [],
    mainGroup: null,
    image: null,
  });

  const [custmoWorkout, setCustomWorkout] = useState<IWorkoutInfrmations>({
    name: "",
    description: "",
    primaryMuscle: [],
    mainGroup: null,
    exercises: null,
  });

  const updateCustomWorkout = (
    key: keyof ICreateCustomExercise,
    value: any
  ) => {
    setCustomWorkout((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveWorkoutInDB = async () => {
    try {
      await saveCustomWorkout();
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };

  async function setDoc(docRef: any, data: any) {
    try {
      await firebaseSetDoc(docRef, data);
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  const closeWorkoutActionSheet = () => {
    SheetManager.hide("add-workout-modal-sheet");
  };

  const deleteWorkoutData = () => {
    setCustomWorkout({
      name: "",
      description: "",
      primaryMuscle: [],
      mainGroup: null,
      exercises: null,
    });
    setWorkout([]);
  };

  const saveCustomWorkout = async () => {
    try {
      const usersCollection = collection(firestoreDB, "User");
      const userRef = doc(usersCollection, firebaseUser?.uid);
      const workoutRef = collection(userRef, "Workouts");

      const formattedExercises =
        workout?.map((exercise) => ({
          id: exercise.id || "",
          name: exercise.name || "",
        })) || [];

      const workoutData = {
        name: custmoWorkout.name || "",
        description: custmoWorkout.description || "",
        primaryMuscle: custmoWorkout.primaryMuscle || [],
        mainGroup: custmoWorkout.mainGroup || [],
        exercises: formattedExercises,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(workoutRef, workoutData.name), workoutData);

      deleteWorkoutData();
      alert("Workout saved successfully!");
      SheetManager.hide("add-workout-modal-sheet");
    } catch (error: any) {
      console.error("Error adding document: ", error);
      if (error.code === "permission-denied") {
        alert("You don't have permission to save workouts.");
      } else {
        alert("An error occurred while saving the workout. Please try again.");
      }
    }
  };

  return (
    // Um die Tastatur zu schließen, wenn irgendwo getippt wird,
    // wird der Inhalt in TouchableWithoutFeedback gewrappt.
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ActionSheet
        containerStyle={{
          height: height * 0.85,
          backgroundColor: "rgb(48, 48, 49)",
        }}
        gestureEnabled={false}
        indicatorStyle={{
          backgroundColor: "white",
        }}
      >
        <XStack
          justifyContent="space-between"
          width="100%"
          paddingHorizontal={10}
        >
          <TouchableWithoutFeedback onPress={closeWorkoutActionSheet}>
            <AntDesign name="close" size={width * 0.1} color="white" />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={saveWorkoutInDB}>
            <AntDesign name="save" size={width * 0.1} color="white" />
          </TouchableWithoutFeedback>
        </XStack>
        <View>
          <AddWorkoutComponent
            title={custmoWorkout.name}
            setTitle={(title) => updateCustomWorkout("name", title)}
            description={customExercise.description}
            setDescription={(desc) => updateCustomWorkout("description", desc)}
            image={customExercise.image}
            setImage={(img) => updateCustomWorkout("image", img)}
            informations={workout}
            setInformations={setWorkout}
          />
        </View>
      </ActionSheet>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    marginTop: height * 0.02,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
