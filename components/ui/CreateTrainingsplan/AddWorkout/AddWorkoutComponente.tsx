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
import { PickExerciseModal } from "./PickExerciseModal";
import { useEffect, useState } from "react";
import { SavedExercisePanel } from "./SavedExercisePanel";
import EventEmitter from "@/components/EventListener";

const { width, height } = Dimensions.get("window");

export function AddWorkoutComponent({
  items,
  bodyPart,
  setBodyPart,
  exerciseTitle,
  setExerciseTitle,
  exerciseDescription,
  setExerciseDescription,
  image,
  setImage,
  ...props
}: ExerciseComponentProps) {
  const [openPickExerciseModal, setOpenPickExerciseModal] =
    useState<boolean>(false);
  const [pickedExercises, setPickedExercises] = useState<IPickedExercises[]>();

  const toggleShowPickExerciseModal = () => {
    console.log("Tests");
    setOpenPickExerciseModal(!openPickExerciseModal);
  };

  useEffect(() => {
    const deleteExerciseFromList = (exerciseID: string) => {
      setPickedExercises((prev) =>
        prev?.filter((exercise) => exercise.id !== exerciseID)
      );
    };

    EventEmitter.on("deletetExercise", deleteExerciseFromList);

    return () => {
      EventEmitter.off("buttonClicked", deleteExerciseFromList);
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
          value={exerciseTitle}
          onChangeText={(text) => setExerciseTitle(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Workout type:</Text>
        <View
          style={{
            width: width * 0.9,
          }}
        >
          <CustomDropDown items={items} val={bodyPart} setVal={setBodyPart} />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.title}>Add Exercises:</Text>
        <View
          style={{
            width: width * 0.9,
          }}
        >
          {pickedExercises?.map((value, index) => (
            <SavedExercisePanel
              key={index}
              name={value.name}
              id={value.id}
              primaryMuscle={value.primaryMuscle}
              mainGroup={value.mainGroup}
              pickedExercises={pickedExercises}
              setPickedExercises={setPickedExercises}
            />
          ))}
          <TouchableOpacity
            onPress={toggleShowPickExerciseModal}
            style={{ marginTop: height * 0.03 }} // Abstand oben
          >
            <AddExercisePanel
              pickedExercises={pickedExercises}
              setPickedExercises={setPickedExercises}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

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
  },
});
