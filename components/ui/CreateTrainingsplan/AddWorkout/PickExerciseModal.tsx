import {
  IExerciseListProps,
  IPickedExercises,
  IPickeExerciseModal,
} from "@/types/interfaces";
import { Sheet } from "@tamagui/sheet";
import React, { memo, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "tamagui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ExerciseList } from "./ExerciseList";
import { ListWithAddedExercises } from "./ListWithAddedExercises";

const { width, height } = Dimensions.get("window");

export const PickExerciseModal = (props: IPickeExerciseModal) => {
  const [position, setPosition] = React.useState(0);

  return (
    <>
      <Sheet
        forceRemoveScrollEnabled={props.open}
        modal={true}
        open={props.open}
        onOpenChange={props.setOpen}
        snapPoints={[50]}
        snapPointsMode="percent"
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
        <Sheet.Frame padding="$4" gap="$5">
          <SheetContents
            pickedExercises={props.pickedExercises}
            setPickedExercises={props.setPickedExercises}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

const SheetContents = memo(
  ({ pickedExercises, setPickedExercises }: IExerciseListProps) => {
    return (
      <View style={styles.sheetContentContainer}>
        {pickedExercises?.map((value, index) => (
          <View style={styles.addedExercisesContainer} key={index}>
            <View style={styles.wrapper}>
              <ListWithAddedExercises exercise={value} />
            </View>
          </View>
        ))}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Search..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity>
            <Ionicons
              name="search"
              size={24}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: height * 0.02 }}>
          <ExerciseList
            pickedExercises={pickedExercises}
            setPickedExercises={setPickedExercises}
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  sheetContentContainer: {},
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.9,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginTop: height * 0.02,
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  icon: {
    margin: 10,
  },
  wrapper: {
    flexDirection: "row",
    width: width * 0.3,
    backgroundColor: "green",
  },
  addedExercisesContainer: {
    backgroundColor: "green",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // Links-Ausrichtung
  },
});