import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Dimensions, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ExerciseCard from "@/components/ui/ExerciseCard";
import { ScrollView } from "tamagui";
import { IExerciseCard } from "@/types/interfaces";
import { AddTrainingModal } from "@/components/ui/CreateTrainingsplan/AddTrainingModal";
import EventEmitter from "@/components/EventListener";
import { fetchUserWorkouts } from "@/database/fetchWorkouts";
import { AppConfigContext } from "@/context/AppConfigProvider";
import { PopOverAddExercises } from "@/components/ui/PopOverAddExercises";

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
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Start Training",
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
          <PopOverAddExercises />
        </View>
      ),
      headerStyle: {
        backgroundColor: "#F86E51",
      },
      headerTintColor: "black",
    });
  }, [navigation]);

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

  const testExerciseCards: IExerciseCard[] = [
    {
      id: "Push",
      lastDone: "2025-01-01",
      rotation: "5deg",
    },
    {
      id: "Pull",
      lastDone: "2025-01-05",
      rotation: "-5deg",
    },
    {
      id: "Leg",
      lastDone: "2025-01-10",
      rotation: "5deg",
    },
    {
      id: "Upper Body",
      lastDone: "2025-01-15",
      rotation: "-5deg",
    },
  ];

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
      {/* {workout?.map((value, index) => (
        <ExerciseCard
          key={index}
          {...value}
          rotation={index % 2 === 0 ? "5deg" : "-5deg"}
        />
      ))} */}
      {workout && workout.length > 0 ? (
        workout.map((value, index) => (
          <ExerciseCard
            key={index}
            {...value}
            rotation={index % 2 === 0 ? "5deg" : "-5deg"}
          />
        ))
      ) : (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, color: "black" }}></Text>
        </View>
      )}
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
