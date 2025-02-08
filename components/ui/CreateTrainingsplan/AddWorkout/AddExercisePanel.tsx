import { Dimensions, Text, TouchableOpacity } from "react-native";
import { Card, XStack } from "tamagui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { IExerciseListProps, IExercisesToPicker } from "@/types/interfaces";
import { SheetManager } from "react-native-actions-sheet";

const { width, height } = Dimensions.get("window");

export function AddExercisePanel(props: IExerciseListProps) {
  const [openPickExerciseModal, setOpenPickExerciseModal] =
    useState<boolean>(false);

  const toggleShowPickExerciseModal = () => {
    SheetManager.show("add-exercise-for-Workout-modal-sheet", {
      payload: {
        pickedExercises: props.pickedExercises,
        setPickedExercises: props.setPickedExercises,
      },
    });
  };

  return (
    <Card
      elevate
      size="$4"
      animation="bouncy"
      width={width * 0.9}
      height={height * 0.05}
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
    >
      <TouchableOpacity onPress={toggleShowPickExerciseModal}>
        <XStack
          justifyContent="space-between"
          alignItems="center"
          style={{ height: "100%" }}
        >
          <Text
            style={{
              flexShrink: 1,
              flexWrap: "wrap",
              marginLeft: width * 0.05,
            }}
          >
            Add Exercise...
          </Text>
          <Ionicons
            name="add"
            size={24}
            color="black"
            style={{ marginRight: width * 0.03 }}
          />
        </XStack>
      </TouchableOpacity>
    </Card>
  );
}
