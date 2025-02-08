import { Portal } from "@tamagui/portal";
import { Button, Input, Label, Popover, XStack, YStack } from "tamagui";
import { Dimensions, TouchableOpacity, View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";

const { width, height } = Dimensions.get("window");

export function TamaguiPopOver() {
  const [open, setOpen] = useState(false);

  const togglePopOver = () => {
    setOpen(!open);
  };

  return (
    <Popover
      size="$5"
      allowFlip
      placement="bottom"
      open={open}
      // onOpenChange sorgt dafür, dass der Popover-Zustand auch durch Klicken außerhalb geändert wird
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
              // Logik für "Create Exercise"
              console.log("Create Exercise pressed");
              setOpen(false); // Optional: Popover schließen
            }}
          >
            <Text>Create Exercise</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // Logik für "Create Workout"
              console.log("Create Workout pressed");
              setOpen(false); // Optional: Popover schließen
            }}
          >
            <Text>Create Workout</Text>
          </TouchableOpacity>
        </YStack>
      </Popover.Content>
    </Popover>
  );
}
