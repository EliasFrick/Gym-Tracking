import { Portal } from "@tamagui/portal";
import { Button, Input, Label, Popover, XStack, YStack } from "tamagui";
import {
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { SheetManager } from "react-native-actions-sheet";

const { width, height } = Dimensions.get("window");

export function TamaguiPopOver() {
  const [open, setOpen] = useState(false);

  const togglePopOver = () => {
    setOpen(!open);
  };

  const openExerciseActionSheet = () => {
    SheetManager.show("add-exercise-modal-sheet");
    setOpen(false);
  };

  const openWorkoutActionSheet = () => {
    SheetManager.show("add-workout-modal-sheet");
    setOpen(false);
  };

  return (
    <Popover
      size="$5"
      allowFlip
      placement="bottom"
      open={open}
      // Schaltet den Popover-Zustand um, wenn z.B. außerhalb geklickt wird
      onOpenChange={setOpen}
    >
      <Popover.Trigger asChild>
        <TouchableOpacity onPress={togglePopOver}>
          <Feather name="plus" size={width * 0.08} color="white" />
        </TouchableOpacity>
      </Popover.Trigger>

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        zIndex={100000}
        backgroundColor="white"
        padding="$4"
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YStack gap="$3" padding="$3">
          <TouchableOpacity
            onPress={() => {
              openExerciseActionSheet();
            }}
          >
            <Text>Create Exercise</Text>
          </TouchableOpacity>

          {/* Trenner */}
          <View style={styles.divider} />

          <TouchableOpacity
            onPress={() => {
              openWorkoutActionSheet();
            }}
          >
            <Text>Create Workout</Text>
          </TouchableOpacity>
        </YStack>
      </Popover.Content>
    </Popover>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    width: "100%",
    marginVertical: 8,
  },
});
