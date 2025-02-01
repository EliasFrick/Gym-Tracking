import {
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext, useEffect, useState } from "react";
import { IExerciseListProps } from "@/types/interfaces";
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
  const [paddingBottom, setpaddingBottom] = useState<number>(height * 0.14);

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
    const newExercise = { id, name, primaryMuscle, mainGroup };
    setPickedExercises((prev) => {
      if (prev?.some((exercise) => exercise.id === id)) {
        alert("Übung bereits ausgewählt");
        return prev;
      }
      return [...(prev || []), newExercise];
    });
    extendPaddingBottom();
  };

  const extendPaddingBottom = () => {
    setpaddingBottom((prev) => prev + height * 0.05);
  };

  const combinedExercises = [...defaultExercises, ...customExercises];

  return (
    <View style={{ width: width * 0.9 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: paddingBottom }}>
        {combinedExercises.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: height * 0.2 }}>
            Keine Übungen gefunden.
          </Text>
        ) : (
          combinedExercises.map((value, index) => (
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
              style={{
                height: height * 0.05,
                marginBottom: height * 0.01,
              }}
            >
              <View
                style={{
                  height: "100%",
                  backgroundColor: "lightgrey",
                  borderRadius: 8,
                  paddingVertical: 8,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
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
                    alignSelf: "center",
                  }}
                />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
