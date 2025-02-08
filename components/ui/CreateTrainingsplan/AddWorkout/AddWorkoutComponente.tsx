import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { Button, Input, ScrollView, TextArea } from "tamagui";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import {
  ExerciseComponentProps,
  IExercisesToPicker,
  IPickedExercises,
} from "@/types/interfaces";
import { CustomDropDown } from "../CustomDropDown";
import { AddExercisePanel } from "./AddExercisePanel";
import { PickExerciseModal } from "./PickExerciseActionSheet";
import { useEffect, useState, memo } from "react";
import { SavedExercisePanel } from "./SavedExercisePanel";
import EventEmitter from "@/components/EventListener";
import { SheetManager } from "react-native-actions-sheet";

const { width, height } = Dimensions.get("window");

export const AddWorkoutComponent = memo(
  ({
    title,
    setTitle,
    description,
    setDescription,
    image,
    setImage,
    informations,
    setInformations,
    ...props
  }: ExerciseComponentProps) => {
    const [openPickExerciseModal, setOpenPickExerciseModal] =
      useState<boolean>(false);

    const toggleShowPickExerciseModal = async () => {
      console.log("toggleShowPickExerciseModal");
    };
    useEffect(() => {
      const deleteExerciseFromList = (exerciseID: string) => {
        setInformations((prev) =>
          prev?.filter((exercise) => exercise.id !== exerciseID)
        );
      };

      EventEmitter.on("deletetExercise", deleteExerciseFromList);

      return () => {
        EventEmitter.off("deletetExercise", deleteExerciseFromList);
      };
    }, []);

    return (
      <View>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Title:</Text>
          <Input
            style={{
              width: width * 0.9,
              height: height * 0.05,
            }}
            placeholder={`Name of Workout...`}
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <View
            style={{
              width: width * 0.9,
            }}
          >
            {informations?.map((value, index) => (
              <SavedExercisePanel
                key={index}
                name={value.name}
                id={value.id}
                primaryMuscle={value.primaryMuscle}
                mainGroup={value.mainGroup}
                pickedExercises={informations}
                setPickedExercises={setInformations}
              />
            ))}
            <Text style={styles.title}>Add Exercises:</Text>
            <TouchableOpacity onPress={() => toggleShowPickExerciseModal()}>
              <AddExercisePanel
                pickedExercises={informations}
                setPickedExercises={setInformations}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison für memo
    return (
      prevProps.title === nextProps.title &&
      prevProps.description === nextProps.description &&
      JSON.stringify(prevProps.informations) ===
        JSON.stringify(nextProps.informations)
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F86E51",
  },
  sheetContainer: {
    marginTop: height * 0.02,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  inputContainer: {
    width: "100%", // Nimmt die volle Breite des übergeordneten Containers
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    alignItems: "flex-start", // Text linksbündig
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
  },
  title: {
    height: height * 0.03,
    marginBottom: 20,
  },
});
