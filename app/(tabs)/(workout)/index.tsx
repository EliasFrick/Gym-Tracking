import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Button,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ExerciseCard from "@/components/ui/ExerciseCard";
import { ScrollView, XStack } from "tamagui";
import { IExerciseCard } from "@/types/interfaces";
import { AddTrainingModal } from "@/components/ui/CreateTrainingsplan/AddTrainingModal";
import EventEmitter from "@/components/EventListener";
import { fetchUserWorkouts } from "@/database/fetchWorkouts";
import { AppConfigContext } from "@/context/AppConfigProvider";
import { PopOverAddExercises } from "@/components/ui/PopOverAddExercises";
import { SheetManager } from "react-native-actions-sheet";
import { TamaguiPopOver } from "@/components/ui/TamaguiPopOver";
import PopOver from "@/components/ui/PopOver";
import PlusPopover from "@/components/ui/PopOver";
import { ScaledSheet, scale } from "react-native-size-matters";

const { width, height } = Dimensions.get("window");

export default function indexScreen() {
  const [openAddExerciseModal, setOpenAddExerciseModal] = useState(
    EventEmitter.getState("addExerciseBoolean") || false
  );
  const [openAddWorkoutModal, setOpenAddWorkoutModal] = useState(
    EventEmitter.getState("addWorkoutBoolean") || false
  );
  const [workout, setWorkout] = useState<IExerciseCard[]>();
  const { isConnected, refreshDatabase } = useContext(AppConfigContext);
  const navigation = useNavigation();

  // Neuen Zustand für den Popover hinzufügen:
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Wir bauen den Header selbst im Render-Bereich
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

    return () => {
      EventEmitter.off("addExerciseBoolean", listenerforAddExercise);
      EventEmitter.off("addWorkoutBoolean", listenerforAddWorkout);
    };
  }, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const result = await fetchUserWorkouts();
      setWorkout(result);
    };
    fetchWorkouts();
  }, [refreshDatabase]);

  const items = [
    { name: "Chest" },
    { name: "Upper Chest" },
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

  const test = () => {
    SheetManager.show("add-exercise-modal-sheet", {
      payload: { value: items },
    });
  };

  return (
    // Der Wrapper fängt jeden Touch außerhalb der Kinder auf.
    <TouchableWithoutFeedback
      onPress={() => {
        if (isPopoverOpen) setIsPopoverOpen(false);
      }}
    >
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.header}>
          <XStack style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Start Training</Text>
          </XStack>
          {/* Um zu verhindern, dass ein Klick auf das Popover den Wrapper auslöst, 
              wird der Popover-Bereich in einen eigenen TouchableWithoutFeedback gehüllt,
              der event.stopPropagation() aufruft */}
          <TouchableWithoutFeedback
            onPress={(e) => {
              e.stopPropagation();
            }}
          >
            <View style={styles.headerRight}>
              {/* Annahme: TamaguiPopOver akzeptiert isOpen und onOpenChange */}
              <TamaguiPopOver
                isOpen={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* Restlicher Inhalt */}
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          style={styles.container}
        >
          <Button title="Test" onPress={test} />
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
              <Text style={{ fontSize: 18, color: "black" }}>
                Create your first workout
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "rgb(22, 22, 22)",
  },
  header: {
    height: height * 0.115,
    backgroundColor: "rgb(48, 48, 49)",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative", // Damit das absolute Positionieren des Popovers funktioniert
    paddingBottom: height * 0.015,
  },
  headerCenter: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: scale(18), // Skaliert die Schriftgröße
  },
  headerRight: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: height * 0.013,
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "rgb(22, 22, 22)",
  },
  scrollViewContent: {
    alignItems: "center",
    minHeight: height,
  },
});
