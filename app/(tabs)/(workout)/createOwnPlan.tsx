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

const spModes = ["percent", "constant", "fit", "mixed"] as const;
const { width, height } = Dimensions.get("window");

export default function CreateOwnPlan() {
  const navigation = useNavigation();
  const [bodyPart, setBodyPart] = React.useState("");
  const [exerciseTitle, setExerciseTitle] = React.useState("");
  const [exerciseDescription, setExerciseDescription] = React.useState("");
  const [image, setImage] = React.useState<string | null>(null);
  const [position, setPosition] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [modal, setModal] = React.useState(false);
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

  const saveExercise = () => {
    setOpen(false);
  };

  const items = [
    { name: "Chest" },
    { name: "Back" },
    { name: "Leg" },
    { name: "Shoulder" },
    { name: "Biceps" },
    { name: "Triceps" },
    { name: "Abs" },
  ];

  return (
    <View style={styles.container}>
      <YStack gap="$4">
        <XStack
          gap="$4"
          $sm={{ flexDirection: "column", alignItems: "center" }}
        >
          <Button onPress={() => setOpen(true)}>Add New Exercise</Button>
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
              <TouchableOpacity onPress={saveExercise} activeOpacity={1}>
                <AntDesign name="save" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <AddExerciseComponent
              items={items}
              exerciseTitle={exerciseTitle}
              setExerciseTitle={setExerciseTitle}
              bodyPart={bodyPart}
              setBodyPart={setBodyPart}
              exerciseDescription={exerciseDescription}
              setExerciseDescription={setExerciseDescription}
              image={image}
              setImage={setImage}
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
