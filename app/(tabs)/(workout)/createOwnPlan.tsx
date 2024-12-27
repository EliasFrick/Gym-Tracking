import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import { Sheet } from "@tamagui/sheet";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import type { SheetProps } from "@tamagui/sheet";
import {
  Adapt,
  Button,
  FontSizeTokens,
  H2,
  Input,
  Paragraph,
  ScrollView,
  Select,
  SelectProps,
  TextArea,
  XStack,
  YStack,
} from "tamagui";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "tamagui/linear-gradient";
import { CustomDropDown } from "@/components/ui/CustomDropDown";
import * as ImagePicker from "expo-image-picker";
import Entypo from "@expo/vector-icons/Entypo";
import { AddExerciseComponent } from "@/components/ui/addExerciseComponente";
import { addDoc, collection } from "firebase/firestore";
import { firestoreDB } from "@/database/Firebaseconfig";
import { ICreateCustomExercise } from "@/types/interfaces";
import { getAuth } from "firebase/auth";

const spModes = ["percent", "constant", "fit", "mixed"] as const;
const { width, height } = Dimensions.get("window");

export default function CreateOwnPlan() {
  // Aktueller Benutzer wird direkt abgerufen
  const auth = getAuth();
  const firebaseUser = auth.currentUser;

  // Hooks
  const navigation = useNavigation();
  const [position, setPosition] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [customExercise, setCustomExercise] =
    React.useState<ICreateCustomExercise>({
      userID: firebaseUser!.uid, // Standardwerte
      exerciseName: "",
      exerciseDescription: "",
      exerciseTargetMuscle: "",
      exerciseImage: null,
    });
  const [snapPointsMode, setSnapPointsMode] =
    React.useState<(typeof spModes)[number]>("percent");

  const snapPoints = [100, 75, 50];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Create Plan",
      headerStyle: {
        backgroundColor: "#F86E51",
      },
      headerTintColor: "black",
      headerBackTitle: "Back",
    });
  }, [navigation]);

  const saveExercise = async () => {
    console.log("Saving exercise... ", customExercise);
    try {
      // Create the document in Firestore
      const docRef = await addDoc(collection(firestoreDB, "customExercises"), {
        userID: customExercise.userID,
        exerciseName: customExercise.exerciseName,
        exerciseDescription: customExercise.exerciseDescription,
        exerciseTargetMuscle: customExercise.exerciseTargetMuscle,
        exerciseImage: customExercise.exerciseImage, // Use the download URL
      });
      console.log("Document written with ID: ", docRef.id);
      setOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const tryout = async () => {
    try {
      await setDoc(
        doc(
          firestoreDB,
          "CustomExercises",
          firebaseUser?.uid + ", " + customExercise.exerciseName
        ),
        customExercise
      );
      alert(
        "Exercise was only saved locally, go to the settings to save the exercise in the cloud"
      );
      deleteData();
      setOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error while saving exercise");
    }
  };

  const items = [
    { name: "Chest" },
    { name: "Uppcer Chest" },
    { name: "Lower Chest" },
    { name: "Biceps" },
    { name: "Back" },
    { name: "Lats" },
    { name: "Traps" },
    { name: "Leg" },
    { name: "Glutes" },
    { name: "Shoulder" },
    { name: "Triceps" },
    { name: "Abs" },
    { name: "Forearms" },
    { name: "Calves" },
    { name: "Neck" },
    { name: "Obliques" },
  ];

  // Funktion, um customExercise zu aktualisieren
  const updateCustomExercise = (
    key: keyof ICreateCustomExercise,
    value: any
  ) => {
    setCustomExercise((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const deleteData = () => {
    setCustomExercise((prev) => ({
      ...prev,
      exerciseName: "",
      exerciseDescription: "",
      exerciseTargetMuscle: "",
      exerciseImage: null,
    }));
  };

  return (
    <View style={styles.container}>
      <YStack gap="$4">
        <XStack
          gap="$4"
          $sm={{ flexDirection: "column", alignItems: "center" }}
        >
          <Button onPress={() => setOpen(true)}>Add New Exercise</Button>
          <Button onPress={() => setOpen(true)}>Add New Plan</Button>
        </XStack>
      </YStack>

      <Sheet
        forceRemoveScrollEnabled={open}
        modal={modal}
        open={open}
        onOpenChange={setOpen}
        snapPoints={snapPoints}
        snapPointsMode={snapPointsMode}
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
                onPress={() => setOpen(false)}
                activeOpacity={1}
              >
                <AntDesign name="close" size={30} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={tryout} activeOpacity={1}>
                <AntDesign name="save" size={30} color="black" />
              </TouchableOpacity>
            </View>
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
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
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
});
import { doc, setDoc as firebaseSetDoc } from "firebase/firestore";

async function setDoc(docRef: any, data: { name: string; age: number }) {
  try {
    await firebaseSetDoc(docRef, data);
    console.log("Document successfully written!");
  } catch (error) {
    console.error("Error writing document: ", error);
  }
}
