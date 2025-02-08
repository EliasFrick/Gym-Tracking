import React, { useCallback, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ExerciseList } from "./ExerciseList";
import { ListWithAddedExercises } from "./ListWithAddedExercises";

const { width, height } = Dimensions.get("window");

export const PickExercisActionSheet = (
  props: SheetProps<"add-exercise-for-Workout-modal-sheet">
) => {
  const { pickedExercises, setPickedExercises } = props.payload!;

  // Schließt den Sheet über die korrekte ID
  const closeSheet = useCallback(() => {
    SheetManager.hide("add-exercise-for-Workout-modal-sheet");
  }, []);

  useEffect(() => {
    console.log("pickedExercises: " + pickedExercises);
  }, [pickedExercises]);

  return (
    <ActionSheet
      containerStyle={{
        height: height * 0.89,
        backgroundColor: "rgb(48, 48, 49)",
      }}
      gestureEnabled={false}
      indicatorStyle={{
        backgroundColor: "white",
      }}
    >
      <View style={styles.sheetContentContainer}>
        <TouchableOpacity onPress={closeSheet} activeOpacity={1}>
          <AntDesign name="close" size={30} color="black" />
        </TouchableOpacity>
        <View style={styles.addedExercisesContainer}>
          {pickedExercises?.map((value, index) => (
            <ListWithAddedExercises key={value.id || index} exercise={value} />
          ))}
        </View>
        <View style={{ marginTop: height * 0.1 }}>
          <ExerciseList
            pickedExercises={pickedExercises}
            setPickedExercises={setPickedExercises}
          />
        </View>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  sheetContentContainer: {
    flex: 1,
    width: "100%",
    padding: 16,
  },
  addedExercisesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
  },
});
