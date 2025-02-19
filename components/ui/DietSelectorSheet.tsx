import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import { Text, YStack } from "tamagui";
import { Check } from "@tamagui/lucide-icons";

const dietOptions = [
  { name: "Muskelaufbau (Bulk)", value: "bulking" },
  { name: "Abnehmen (Cut)", value: "cutting" },
  { name: "Gewicht halten", value: "maintaining" },
] as const;

export const DietSelectorSheet = (props: SheetProps<"diet-selector-sheet">) => {
  const selectedDiet = props.payload?.selectedDiet;
  const onSelect = props.payload?.onSelect;

  return (
    <ActionSheet
      containerStyle={styles.container}
      indicatorStyle={{ backgroundColor: "white" }}
    >
      <YStack padding="$4" space="$4">
        <Text style={styles.title}>Wähle deinen Ernährungsplan</Text>
        {dietOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              selectedDiet === option.value && styles.selectedOption,
            ]}
            onPress={() => {
              onSelect?.(option.value);
              SheetManager.hide("diet-selector-sheet");
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
