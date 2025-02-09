import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ExerciseList } from "./ExerciseList";
import { ListWithAddedExercises } from "./ListWithAddedExercises";

const { width, height } = Dimensions.get("window");

export const PickExercisActionSheet = (
  props: SheetProps<"add-exercise-for-Workout-modal-sheet">
) => {
  // Zugriff auf die übergebene Payload
  const { pickedExercises, setPickedExercises } = props.payload!;

  // Lokaler State initialisiert mit pickedExercises
  const [localExercises, setLocalExercises] = useState(pickedExercises);

  // Aktualisiere den lokalen State, wenn sich die übergebene Liste ändert.
  useEffect(() => {
    setLocalExercises(pickedExercises);
  }, [pickedExercises]);

  // Schließt den Sheet über die korrekte ID
  const closeSheet = useCallback(() => {
    SheetManager.hide("add-exercise-for-Workout-modal-sheet");
  }, []);

  return (
    <ActionSheet
      containerStyle={{
        height: height * 0.85,
        backgroundColor: "rgb(48, 48, 49)",
      }}
      gestureEnabled={false}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={closeSheet}
          activeOpacity={1}
          style={styles.closeIconContainer}
        >
          <AntDesign name="close" size={width * 0.1} color="white" />
        </TouchableOpacity>
        <View style={styles.sheetContentContainer}>
          <View style={{ marginTop: height * 0.08 }}>
            <ExerciseList
              pickedExercises={localExercises}
              setPickedExercises={(newExercises) => {
                setPickedExercises(newExercises);
                setLocalExercises(newExercises);
              }}
            />
          </View>
        </View>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  closeIconContainer: {
    position: "absolute",
    left: width * 0.02,
    top: width * 0.02,
    zIndex: 1,
  },
  sheetContentContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  addedExercisesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
  },
});
