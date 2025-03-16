import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import { Text, YStack } from "tamagui";
import { Check } from "@tamagui/lucide-icons";

const MUSCLE_GROUP = [
  { name: "Arms", value: "Arms" },
  { name: "Chest", value: "Chest" },
  { name: "Back", value: "Back" },
  { name: "Shoulder", value: "Shoulder" },
  { name: "Legs", value: "Legs" },
  { name: "Neck", value: "Neck" },
  { name: "Six-Pack", value: "Six-Pack" },
] as const;

export const MuscleGroupSelectorSheet = (
  props: SheetProps<"muscle-group-selector-sheet">
) => {
  const selectedDiet = props.payload?.selectedMuscleGroup;
  const onSelect = props.payload?.onSelect;

  return (
    <ActionSheet
      containerStyle={styles.container}
      indicatorStyle={{ backgroundColor: "white" }}
    >
      <YStack padding="$4" space="$4">
        <Text style={styles.title}>Choose the MuscleGroup</Text>
        {MUSCLE_GROUP.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              selectedDiet === option.value && styles.selectedOption,
            ]}
            onPress={() => {
              onSelect?.(option.value);
              SheetManager.hide("muscle-group-selector-sheet");
            }}
          >
            <Text style={styles.optionText}>{option.name}</Text>
            {selectedDiet === option.value && (
              <Check size={20} color="#F86E51" />
            )}
          </TouchableOpacity>
        ))}
      </YStack>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  optionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#2D2D2D",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: "#3D3D3D",
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },
});
