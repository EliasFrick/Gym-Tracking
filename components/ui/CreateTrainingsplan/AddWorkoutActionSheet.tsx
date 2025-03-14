import React, { useContext, useState } from "react";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
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
  IExerciseCard,
} from "@/types/interfaces";
import { getAuth } from "firebase/auth";
import { firestoreDB } from "@/database/Firebaseconfig";
import { collection, doc, setDoc as firebaseSetDoc } from "firebase/firestore";
import { addWorkoutToQueue } from "@/utils/localWorkouts";

const { width, height } = Dimensions.get("window");

export const AddWorkoutActionSheet = (
  props: SheetProps<"add-workout-modal-sheet">
) => {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;
  const [workout, setWorkout] = useState<IPickedExercises[]>();
  const { isOnline, refresh } = useContext(AppConfigContext);

  const [customExercise, setCustomExercise] = useState<ICreateCustomExercise>({
    userID: firebaseUser!.uid,
    name: "",
    description: "",
    primaryMuscle: [],
    mainGroup: "",
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
      refresh();
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
          <XStack
            justifyContent="space-between"
            width="100%"
            paddingHorizontal={10}
          >
            <TouchableOpacity
              onPress={closeWorkoutActionSheet}
              style={{ padding: 10 }}
            >
              <AntDesign name="close" size={width * 0.1} color="grey" />
            </TouchableOpacity>
            <TouchableOpacity onPress={saveWorkoutInDB} style={{ padding: 10 }}>
              <AntDesign name="save" size={width * 0.1} color="grey" />
            </TouchableOpacity>
          </XStack>
          <View>
            <AddWorkoutComponent
              title={custmoWorkout.name}
              setTitle={(title) => updateCustomWorkout("name", title)}
              description={customExercise.description}
              setDescription={(desc) =>
                updateCustomWorkout("description", desc)
              }
              image={customExercise.image}
              setImage={(img) => updateCustomWorkout("image", img)}
              informations={workout}
              setInformations={setWorkout}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ActionSheet>
  );
};
