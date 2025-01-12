import { IExerciseListProps, IPickedExercises } from "@/types/interfaces";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

// Definiere die Props der Komponente
interface ListWithAddedExercisesProps {
  exercise: IPickedExercises;
}

const { width, height } = Dimensions.get("window");

export const ListWithAddedExercises = ({
  exercise,
}: ListWithAddedExercisesProps) => {
  return (
    <TouchableOpacity style={styles.exerciseContainer}>
      <Text style={styles.exerciseText}>{exercise.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  exerciseContainer: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginRight: 10,
    width: (width * 0.9) / 2.5, // Zwei Elemente pro Zeile
  },
  exerciseText: {
    fontSize: 16,
    color: "black",
  },
});
