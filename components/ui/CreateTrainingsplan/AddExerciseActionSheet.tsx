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
  getDocs,
  query,
  where,
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

  const getNextCustomExerciseId = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return "C1";

      const exercisesRef = collection(
        firestoreDB,
        "User",
        user.uid,
        "Exercises"
      );
      const q = query(exercisesRef, where("userID", "==", user.uid));
      const querySnapshot = await getDocs(q);

      let maxNumber = 0;
      querySnapshot.forEach((doc) => {
        const id = doc.id;
        if (id.startsWith("C")) {
          const num = parseInt(id.substring(1));
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      });

      return `C${maxNumber + 1}`;
    } catch (error) {
      console.error("Error getting next exercise ID:", error);
      return "C1";
    }
  };

  const saveCustomExercise = async () => {
    try {
      const usersCollection = collection(firestoreDB, "User");
      const userRef = doc(usersCollection, firebaseUser?.uid);
      const exerciseRef = collection(userRef, "Exercises");

      // Generiere die nächste ID
      const nextId = await getNextCustomExerciseId();

      await setDoc(doc(exerciseRef, nextId), {
        ...customExercise,
        id: nextId, // Speichere die ID auch im Dokument
      });

      alert("Successfully saved");
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
            style={{ padding: 10 }}
          >
            <AntDesign name="close" size={width * 0.1} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={saveExercise}
            activeOpacity={1}
            style={{ padding: 10 }}
          >
            <AntDesign name="save" size={width * 0.1} color="grey" />
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
