import {
  ICreateCustomExercise,
  IPickedExercises,
  IWorkoutInDatabase,
  IWorkoutInfrmations,
} from "@/types/interfaces";
import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { AddExerciseComponent } from "@/components/ui/CreateTrainingsplan/AddExercises/AddExerciseComponente";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  doc,
  setDoc as firebaseSetDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import { firestoreDB } from "@/database/Firebaseconfig";
import EventEmitter from "@/components/EventListener";
import { AddWorkoutComponent } from "./AddWorkout/AddWorkoutComponente";
import { AppConfigContext } from "@/context/AppConfigProvider";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { SheetManager } from "react-native-actions-sheet";
import { XStack } from "tamagui";

const { width, height } = Dimensions.get("window");

export const AddExerciseActionSheet = (
  props: SheetProps<"add-exercise-modal-sheet">
) => {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;
  const [exercise, setExercise] = useState<IPickedExercises[]>();
  const { triggerRefreshDatabase } = useContext(AppConfigContext);

  const [customExercise, setCustomExercise] =
    React.useState<ICreateCustomExercise>({
      userID: firebaseUser!.uid,
      name: "",
      description: "",
      primaryMuscle: [],
      mainGroup: null,
      image: null,
    });

  const updateCustomExercise = (
    key: keyof ICreateCustomExercise,
    value: any
  ) => {
    setCustomExercise((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveExercise = async () => {
    try {
      await saveCustomExercise();

      triggerRefreshDatabase();
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

  const closeExerciseActionSheet = () => {
    SheetManager.hide("add-exercise-modal-sheet");

    const exerciseValue = EventEmitter.getState("addExerciseBoolean") || false;
    const workoutValue = EventEmitter.getState("addWorkoutBoolean") || false;

    if (exerciseValue) {
      EventEmitter.setState("addExerciseBoolean", !exerciseValue);
    } else if (workoutValue) {
      EventEmitter.setState("addWorkoutBoolean", !workoutValue);
    }
  };

  const saveCustomExercise = async () => {
    try {
      const usersCollection = collection(firestoreDB, "User");
      const userRef = doc(usersCollection, firebaseUser?.uid);
      const exerciseRef = collection(userRef, "Exercises");
      await setDoc(doc(exerciseRef, customExercise.name), customExercise);

      alert("Successfull saved");
      deleteExerciseData();
      SheetManager.hide("add-exercise-modal-sheet");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error while saving exercise");
    }
  };

  const deleteExerciseData = () => {
    setCustomExercise({
      userID: firebaseUser!.uid,
      name: "",
      description: "",
      primaryMuscle: [],
      mainGroup: null,
      image: null,
    });
  };

  return (
    <ActionSheet
      {...props}
      containerStyle={{
        height: height * 0.89,
        backgroundColor: "rgb(48, 48, 49)",
      }}
      gestureEnabled={false}
      indicatorStyle={{
        backgroundColor: "white",
      }}
    >
      <View>
        <XStack
          justifyContent="space-between"
          width="100%"
          paddingHorizontal={10}
        >
          <TouchableOpacity
            onPress={() => closeExerciseActionSheet()}
            activeOpacity={1}
          >
            <AntDesign name="close" size={width * 0.1} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={saveExercise} activeOpacity={1}>
            <AntDesign name="save" size={width * 0.1} color="black" />
          </TouchableOpacity>
        </XStack>
        <AddExerciseComponent
          title={customExercise.name}
          setTitle={(title) => updateCustomExercise("name", title)}
          description={customExercise.description}
          setDescription={(desc) => updateCustomExercise("description", desc)}
          image={customExercise.image}
          setImage={(img) => updateCustomExercise("image", img)}
          informations={exercise}
          setInformations={setExercise}
        />
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    marginTop: height * 0.02,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
