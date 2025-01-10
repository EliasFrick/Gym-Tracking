import { IAddTrainingModal, ICreateCustomExercise } from "@/types/interfaces";
import { Sheet } from "@tamagui/sheet";
import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { AddExerciseComponent } from "./AddExerciseComponente";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, setDoc as firebaseSetDoc } from "firebase/firestore";
import { firestoreDB } from "@/database/Firebaseconfig";
import EventEmitter from "@/components/EventListener";
import { AddWorkoutComponent } from "./AddWorkoutComponente";

const { width, height } = Dimensions.get("window");

export const AddTrainingModal = ({
  open,
  setOpen,
  position,
  setPosition,
  items,
  addExercise = false,
  addWorkout = false,
}: IAddTrainingModal) => {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;

  const [customExercise, setCustomExercise] =
    React.useState<ICreateCustomExercise>({
      userID: firebaseUser!.uid, // Standardwerte
      exerciseName: "",
      exerciseDescription: "",
      exerciseTargetMuscle: "",
      exerciseImage: null,
    });

  const updateCustomExercise = (
    key: keyof ICreateCustomExercise,
    value: any
  ) => {
    setCustomExercise((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveExercise = async () => {
    try {
      await setDoc(
        doc(
          firestoreDB,
          "CustomExercises",
          firebaseUser?.uid + ", " + customExercise.exerciseName
        ),
        customExercise
      );
      alert("Successfull saved");
      /* deleteData();
          setOpen(false); */
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error while saving exercise");
    }
  };

  async function setDoc(docRef: any, data: ICreateCustomExercise) {
    try {
      await firebaseSetDoc(docRef, data);
      console.log("Document successfully written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  const toggleAddExerciseBoolean = () => {
    const currentValue = EventEmitter.getState("addExerciseBoolean") || false;
    EventEmitter.setState("addExerciseBoolean", !currentValue);
  };
  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={false}
      open={open}
      onOpenChange={setOpen}
      snapPoints={[100, 75, 50]}
      snapPointsMode={"percent"}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100_000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Sheet.Handle />
      <Sheet.Frame backgroundColor={"#F0F8FF"}>
        <ScrollView>
          <View style={styles.sheetContainer}></View>
          <View
            style={{
              justifyContent: "space-between",
              padding: width * 0.025,
              flexDirection: "row",
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={() => toggleAddExerciseBoolean()}
              activeOpacity={1}
            >
              <AntDesign name="close" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={saveExercise} activeOpacity={1}>
              <AntDesign name="save" size={30} color="black" />
            </TouchableOpacity>
          </View>
          {addExercise && (
            <AddExerciseComponent
              items={items}
              exerciseTitle={customExercise.exerciseName}
              setExerciseTitle={(title) =>
                updateCustomExercise("exerciseName", title)
              }
              bodyPart={customExercise.exerciseTargetMuscle}
              setBodyPart={(part) =>
                updateCustomExercise("exerciseTargetMuscle", part)
              }
              exerciseDescription={customExercise.exerciseDescription}
              setExerciseDescription={(desc) =>
                updateCustomExercise("exerciseDescription", desc)
              }
              image={customExercise.exerciseImage}
              setImage={(img) => updateCustomExercise("exerciseImage", img)}
            />
          )}
          {addWorkout && (
            <AddWorkoutComponent
              items={items}
              exerciseTitle={customExercise.exerciseName}
              setExerciseTitle={(title) =>
                updateCustomExercise("exerciseName", title)
              }
              bodyPart={customExercise.exerciseTargetMuscle}
              setBodyPart={(part) =>
                updateCustomExercise("exerciseTargetMuscle", part)
              }
              exerciseDescription={customExercise.exerciseDescription}
              setExerciseDescription={(desc) =>
                updateCustomExercise("exerciseDescription", desc)
              }
              image={customExercise.exerciseImage}
              setImage={(img) => updateCustomExercise("exerciseImage", img)}
            />
          )}
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    marginTop: height * 0.02,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
