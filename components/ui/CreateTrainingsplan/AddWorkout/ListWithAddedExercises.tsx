import React, { useCallback } from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import EventEmitter from "@/components/EventListener";

// Definiere die Props der Komponente
interface ListWithAddedExercisesProps {
  exercise: {
    id: string;
    name: string;
  };
}

const { width, height } = Dimensions.get("window");

export const ListWithAddedExercises = ({
  exercise,
}: ListWithAddedExercisesProps) => {
  const deleteExercise = (id: string) => {
    EventEmitter.emit("deletetExercise", id);
  };

  console.log("Exercise Name:", exercise.name);

  return (
    <TouchableOpacity
      style={styles.exerciseContainer}
      onPress={() => deleteExercise(exercise.id)}
    >
      <Text style={styles.exerciseText}>Das ist</Text>
      <Feather name="x-circle" size={24} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  exerciseContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseText: {
    flex: 1, // gibt dem Text den nötigen Platz
    marginRight: width * 0.03,
    fontSize: 14,
    color: "black",
  },
});
