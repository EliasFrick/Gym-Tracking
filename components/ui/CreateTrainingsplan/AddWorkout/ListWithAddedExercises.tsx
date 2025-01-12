import { IPickedExercises } from "@/types/interfaces";
import { Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import EventEmitter from "@/components/EventListener";

// Definiere die Props der Komponente
interface ListWithAddedExercisesProps {
  exercise: IPickedExercises;
}

const { width, height } = Dimensions.get("window");

export const ListWithAddedExercises = ({
  exercise,
}: ListWithAddedExercisesProps) => {
  const deleteExercise = (id: string) => {
    console.log(id);
    EventEmitter.emit("deletetExercise", id);
  };

  return (
    <TouchableOpacity
      style={styles.exerciseContainer}
      onPress={() => deleteExercise(exercise.id)}
    >
      <Text style={styles.exerciseText} numberOfLines={1} ellipsizeMode="tail">
        {exercise.name}
      </Text>
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
    marginRight: width * 0.03,
    fontSize: 14,
    color: "black",
    textAlign: "center",
  },
});
