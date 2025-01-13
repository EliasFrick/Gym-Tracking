import { Dimensions, Text, TouchableOpacity } from "react-native";
import { Card, XStack } from "tamagui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PickExerciseModal } from "./PickExerciseModal";
import { useContext, useEffect, useState } from "react";
import {
  IExerciseListProps,
  IExercisesToPicker,
  IPickedExercises,
} from "@/types/interfaces";
import { DocumentData } from "firebase/firestore";
import { fetchDataFromFirestore } from "@/database/FetchDataFromFirestore";
import { fetchCustomExercises } from "@/database/fetchCustomExercises";
import { AppConfigContext } from "@/context/AppConfigProvider";

const { width, height } = Dimensions.get("window");

export function ExerciseList({
  pickedExercises,
  setPickedExercises,
}: IExerciseListProps) {
  const [defaultExercises, setDefaultExercises] = useState<DocumentData[]>([]);
  const [customExercises, setCustomExercises] = useState<DocumentData[]>([]);
  const { refreshDatabase } = useContext(AppConfigContext);

  useEffect(() => {
    const fetchDefaultExercises = async () => {
      const result = await fetchDataFromFirestore({
        collectionName: "DefaultExercises",
      });
      setDefaultExercises(result);
    };

    const fetchCustomUserExercises = async () => {
      const result = await fetchCustomExercises();
      setCustomExercises(result);
    };

    fetchDefaultExercises();
    fetchCustomUserExercises();
  }, [refreshDatabase]);

  const selectExercise = (
    id: string,
    name: string,
    primaryMuscle: string[],
    mainGroup: string[]
  ) => {
    const newExercise: IPickedExercises = {
      id,
      name,
      primaryMuscle,
      mainGroup,
    };
    setPickedExercises((prev) => {
      if (prev?.some((exercise) => exercise.id === id)) {
        alert("Übung bereits ausgewälts");
        return prev;
      }
      return [...(prev || []), newExercise];
    });
  };

  const combinedExercises = [...defaultExercises, ...customExercises];
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
      {combinedExercises.map((value, index) => (
        <TouchableOpacity
          key={index}
          onPress={() =>
            selectExercise(
              value.id,
              value.name,
              value.primaryMuscle,
              value.mainGroup
            )
          }
          style={{ height: height * 0.05, marginBottom: height * 0.01 }} // Fügt einen Abstand zwischen den Elementen ein
        >
          <XStack
            justifyContent="space-between"
            alignItems="center" // Sorgt dafür, dass alle Kinder, inkl. des Icons, vertikal zentriert sind
            style={{
              height: "100%",
              backgroundColor: "lightgrey",
              borderRadius: 8, // Optional: fügt Ecken hinzu
              paddingVertical: 8, // Optional: fügt Innenabstand hinzu
            }}
          >
            <Text
              style={{
                flexShrink: 1,
                flexWrap: "wrap",
                marginLeft: width * 0.05,
                fontSize: 16,
              }}
            >
              {value.name}
            </Text>
            <Ionicons
              name="add"
              size={24}
              color="black"
              style={{
                marginRight: width * 0.03,
                alignSelf: "center", // Sicherstellt die vertikale Zentrierung des Icons
              }}
            />
          </XStack>
        </TouchableOpacity>
      ))}
    </Card>
  );
}
