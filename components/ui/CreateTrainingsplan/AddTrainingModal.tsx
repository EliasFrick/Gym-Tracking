import {
  IAddTrainingModal,
  ICreateCustomExercise,
  IPickedExercises,
  IWorkoutInfrmations,
} from "@/types/interfaces";
import { Sheet } from "@tamagui/sheet";
import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { AddExerciseComponent } from "@/components/ui/CreateTrainingsplan/AddExercises/AddExerciseComponente";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect, useState } from "react";
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

const { width, height } = Dimensions.get("window");

export const AddTrainingModal = ({
  open,
  setOpen,
  position,
  setPosition,
  items,
  addExercise = false,
  addWorkout = false,
}: IAddTrainingModal) => {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;
  const [workout, setWorkout] = useState<IPickedExercises[]>();
  const [exercise, setExercise] = useState<IPickedExercises[]>();

  const [customExercise, setCustomExercise] =
    React.useState<ICreateCustomExercise>({
      userID: firebaseUser!.uid, // Standardwerte
      name: "",
      description: "",
      primaryMuscle: [],
      mainGroup: null,
      image: null,
    });

  const [custmoWorkout, setCustomWorkout] = React.useState<IWorkoutInfrmations>(
    {
      name: "",
      primaryMuscle: [],
      mainGroup: null,
      exercises: null,
    }
  );

  const updateCustomExercise = (
    key: keyof ICreateCustomExercise,
    value: any
  ) => {
    setCustomExercise((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateCustomWorkout = (
    key: keyof ICreateCustomExercise,
    value: any
  ) => {
    setCustomWorkout((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveExercise = async () => {
    if (addExercise) {
      await saveCustomExercise();
    } else if (addWorkout) {
      await saveCustomWorkout();
    }
  };

  async function setDoc(docRef: any, data: ICreateCustomExercise) {
    try {
      await firebaseSetDoc(docRef, data);
      console.log("Document successfully written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  const toggleAddTrainingBoolean = () => {
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
      await setDoc(
        doc(
          firestoreDB,
          "CustomExercises",
          firebaseUser?.uid + ", " + customExercise.name
        ),
        customExercise
      );
      alert("Successfull saved");
      deleteExerciseData();
      setOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error while saving exercise");
    }
  };

  const deleteExerciseData = () => {
    setCustomExercise({
      userID: firebaseUser!.uid, // Setzt die userID auf die aktuelle Firebase UID
      name: "",
      description: "",
      primaryMuscle: [],
      mainGroup: null,
      image: null,
    });
  };

  const deleteWorkoutData = () => {
    setCustomWorkout({
      name: "",
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
      console.log("Wokrout: ", custmoWorkout);
      await setDoc(doc(workoutRef, custmoWorkout.name), { workout });

      deleteWorkoutData();
      setOpen(false);
      alert("Workout saved successfully!");
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
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={false}
      open={open}
      onOpenChange={setOpen}
      snapPoints={[100, 75, 50]}
      snapPointsMode={"percent"}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100_000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Sheet.Handle />
      <Sheet.Frame backgroundColor={"#F0F8FF"}>
        <ScrollView>
          <View style={styles.sheetContainer}></View>
          <View
            style={{
              justifyContent: "space-between",
              padding: width * 0.025,
              flexDirection: "row",
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={() => toggleAddTrainingBoolean()}
              activeOpacity={1}
            >
              <AntDesign name="close" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={saveExercise} activeOpacity={1}>
              <AntDesign name="save" size={30} color="black" />
            </TouchableOpacity>
          </View>
          {addExercise && (
            <AddExerciseComponent
              items={items}
              title={customExercise.name}
              setTitle={(title) => updateCustomExercise("name", title)}
              bodyPart={customExercise.primaryMuscle}
              setBodyPart={(part) =>
                updateCustomExercise("primaryMuscle", part)
              }
              description={customExercise.description}
              setDescription={(desc) =>
                updateCustomExercise("description", desc)
              }
              image={customExercise.image}
              setImage={(img) => updateCustomExercise("image", img)}
              informations={exercise}
              setInformations={setExercise}
            />
          )}
          {addWorkout && (
            <AddWorkoutComponent
              items={items}
              title={custmoWorkout.name}
              setTitle={(title) => updateCustomWorkout("name", title)}
              bodyPart={customExercise.primaryMuscle}
              setBodyPart={(part) => updateCustomWorkout("primaryMuscle", part)}
              description={customExercise.description}
              setDescription={(desc) =>
                updateCustomWorkout("description", desc)
              }
              image={customExercise.image}
              setImage={(img) => updateCustomWorkout("image", img)}
              informations={workout}
              setInformations={setWorkout}
            />
          )}
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    marginTop: height * 0.02,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
