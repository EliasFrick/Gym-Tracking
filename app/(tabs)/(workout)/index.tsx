import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ExerciseCard } from "@/components/ui/ExerciseCard";
import { ScrollView } from "tamagui";
import { IExerciseCard } from "@/types/interfaces";
import { AddTrainingModal } from "@/components/ui/CreateTrainingsplan/AddTrainingModal";
import EventEmitter from "@/components/EventListener";
import { fetchUserWorkouts } from "@/database/fetchWorkouts";
import * as Network from "expo-network";
import { AppConfigContext } from "@/context/AppConfigProvider";

const { width, height } = Dimensions.get("window");

export default function indexScreen() {
  const [position, setPosition] = React.useState(0);
  const [openAddExerciseModal, setOpenAddExerciseModal] = useState(
    EventEmitter.getState("addExerciseBoolean") || false
  );
  const [openAddWorkoutModal, setOpenAddWorkoutModal] = useState(
    EventEmitter.getState("addWorkoutBoolean") || false
  );
  const [workout, setWorkout] = useState<IExerciseCard[]>();
  const { isConnected, refreshDatabase } = useContext(AppConfigContext);

  useEffect(() => {
    const listenerforAddExercise = (newValue: boolean) => {
      setOpenAddExerciseModal(newValue);
    };

    const listenerforAddWorkout = (newValue: boolean) => {
      setOpenAddWorkoutModal(newValue);
    };

    EventEmitter.on("addExerciseBoolean", listenerforAddExercise);
    EventEmitter.on("addWorkoutBoolean", listenerforAddWorkout);

    // Cleanup listener on unmount
    return () => {
      EventEmitter.off("addExerciseBoolean", listenerforAddExercise);
      EventEmitter.off("addWorkoutBoolean", listenerforAddWorkout);
    };
  }, []);

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

  const workoutTypes = [
    { name: "Weight Traning" },
    { name: "Calesthenics" },
    { name: "Cardio" },
    { name: "Other..." },
  ];


  useEffect(() => {
    const fetchWorkouts = async () => {
      const result = await fetchUserWorkouts();
      setWorkout(result);
    };
    fetchWorkouts();
  }, [refreshDatabase]);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
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
        open={openAddWorkoutModal}
        setOpen={setOpenAddWorkoutModal}
        position={position}
        setPosition={setPosition}
        items={workoutTypes}
        addWorkout={true}
      />
      {workout?.map((value, index) => (
        <ExerciseCard
          key={index}
          exerciseCard={{
            ...value,
            rotation: index % 2 === 0 ? "5deg" : "-5deg",
          }}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F86E51",
  },
  scrollViewContent: {
    alignItems: "center",
    minHeight: height,
  },
  sheetContainer: {
    marginTop: height * 0.02,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
