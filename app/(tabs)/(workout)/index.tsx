import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Button,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ExerciseCard } from "@/components/ui/ExerciseCard";
import { ScrollView } from "tamagui";
import { ICreateCustomExercise, IExerciseCard } from "@/types/interfaces";
import { ToastDemo } from "@/components/ui/ToastMessage";
import { AddExerciseComponent } from "@/components/ui/AddExerciseComponente";
import { getAuth } from "firebase/auth";
import AntDesign from "@expo/vector-icons/AntDesign";
import { doc, setDoc as firebaseSetDoc } from "firebase/firestore";
import { firestoreDB } from "@/database/Firebaseconfig";
import { AddTrainingModal } from "@/components/ui/AddTrainingModal";
import EventEmitter from "@/components/EventListener";

const { width, height } = Dimensions.get("window");
const spModes = ["percent", "constant", "fit", "mixed"] as const;

export default function indexScreen() {
  const [position, setPosition] = React.useState(0);
  const [openAddExerciseModal, setOpenAddExerciseModal] = useState(
    EventEmitter.getState("addExerciseBoolean") || false
  );
  const [openAddWorkoutModal, setOpenAddWorkoutModal] = useState(
    EventEmitter.getState("addWorkoutBoolean") || false
  );

  useEffect(() => {
    const listenerforAddExercise = (newValue: boolean) => {
      setOpenAddExerciseModal(newValue);
    };

    const listenerforAddWorkout = (newValue: boolean) => {
      setOpenAddExerciseModal(newValue);
    };

    EventEmitter.on("addExerciseBoolean", listenerforAddExercise);
    EventEmitter.on("addWorkoutBoolean", listenerforAddWorkout);

    // Cleanup listener on unmount
    return () => {
      EventEmitter.off("addExerciseBoolean", listenerforAddExercise);
      EventEmitter.off("addWorkoutBoolean", listenerforAddWorkout);
    };
  }, []);

  const exampleExerciseCard: IExerciseCard[] = [
    {
      title: "Push",
      lastDone: "2022-01-01",
      rotation: "5deg",
      image: require("@/assets/Push.jpg"), // Relativer Pfad
    },
    {
      title: "Pull",
      lastDone: "2023-02-03",
      rotation: "-5deg",
      image: require("@/assets/Pull.jpg"), // Relativer Pfad
    },
    {
      title: "Leg",
      lastDone: "2023-02-03",
      rotation: "5deg",
      image: require("@/assets/Leg.jpeg"), // Relativer Pfad
    },
    {
      title: "Upper Body",
      lastDone: "2023-02-03",
      rotation: "-5deg",
      image: require("@/assets/Push.jpg"), // Relativer Pfad
    },
    {
      title: "Lower Body",
      lastDone: "2023-02-03",
      rotation: "5deg",
      image: require("@/assets/Push.jpg"), // Relativer Pfad
    },
  ];

  const items = [
    { name: "Chest" },
    { name: "Uppcer Chest" },
    { name: "Lower Chest" },
    { name: "Biceps" },
    { name: "Back" },
    { name: "Lats" },
    { name: "Traps" },
    { name: "Leg" },
    { name: "Glutes" },
    { name: "Shoulder" },
    { name: "Triceps" },
    { name: "Abs" },
    { name: "Forearms" },
    { name: "Calves" },
    { name: "Neck" },
    { name: "Obliques" },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent} // Zentriert den Inhalt
      style={styles.container}
    >
      <AddTrainingModal
        open={openAddExerciseModal}
        setOpen={setOpenAddExerciseModal}
        position={position}
        setPosition={setPosition}
        items={items}
        addExercise={true}
      />
      <AddTrainingModal
        open={openAddExerciseModal}
        setOpen={setOpenAddExerciseModal}
        position={position}
        setPosition={setPosition}
        items={items}
        addWorkout={true}
      />
      {exampleExerciseCard.map((value, index) => (
        <ExerciseCard key={index} exerciseCard={value} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F86E51",
  },
  scrollViewContent: {
    alignItems: "center", // Zentriert die Items horizontal
    justifyContent: "center", // Optional, je nach Bedarf
  },
  sheetContainer: {
    marginTop: height * 0.02,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
