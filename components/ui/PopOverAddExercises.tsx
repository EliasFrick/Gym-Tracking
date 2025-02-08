import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, Text, Dimensions, Pressable } from "react-native";
import Popover, {
  PopoverMode,
  PopoverPlacement,
} from "react-native-popover-view";
import Feather from "@expo/vector-icons/Feather";
import { View, YStack } from "tamagui";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getAuth } from "firebase/auth";
import { ICreateCustomExercise } from "@/types/interfaces";
import EventEmitter from "@/components/EventListener";
import { SheetManager } from "react-native-actions-sheet";

const { width, height } = Dimensions.get("window");

export function PopOverAddExercises() {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;

  const router = useRouter();
  const [showPopover, setShowPopover] = useState(false);
  React.useState<ICreateCustomExercise>({
    userID: firebaseUser!.uid, // Standardwerte
    name: "",
    description: "",
    primaryMuscle: [],
    mainGroup: null,
    image: null,
  });
  const options = [
    {
      label: "Add Workout",
      navigation: "createOwnPlan",
      icon: <Ionicons name="create" size={width * 0.07} color="white" />,
      action: "addWorkout",
    },
    {
      label: "Add Exercises",
      navigation: "createOwnPlan",
      icon: <Ionicons name="barbell" size={width * 0.07} color="white" />,
      action: "addExercise",
    },
    /*  {
      label: "Create with AI",
      navigation: "createWithAI",
      icon: <Ionicons name="hardware-chip" size={width * 0.07} color="white" />,
      action: "createWithAi",
    }, */
  ];

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

  const openExerciseSheet = () => {
    SheetManager.show("add-exercise-modal-sheet");
  };

  const openWorkoutSheet = () => {
    SheetManager.show("add-workout-modal-sheet");
  };

  const handleCliedPopover = (action: string) => {
    setShowPopover(false);
    setTimeout(() => {
      if (action === "addExercise") {
        openExerciseSheet();
      } else if (action === "addWorkout") {
        openWorkoutSheet();
      } else if (action === "createWithAi") {
        alert("Create With AI");
      }
    }, 500); // 300ms Delay – ggf. anpassen
  };

  return (
    <Popover
      displayArea={{ x: width * 0.52, y: height * 0.117, width, height }}
      arrowSize={{ width: -1, height: -1 }}
      isVisible={showPopover}
      onRequestClose={() => setShowPopover(false)}
      from={
        <TouchableOpacity onPress={() => setShowPopover(true)}>
          <Feather name="plus" size={width * 0.08} color="white" />
        </TouchableOpacity>
      }
    >
      <View
        backgroundColor={"rgb(48, 48, 49)"}
        borderWidth={1}
        borderColor="rgb(48, 48, 49)"
      >
        <YStack gap={height * 0.02}>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: height * 0.02,
            }}
          >
            {options.map((option, index) => {
              // Falls du nur bei bestimmten Optionen navigieren möchtest,
              // kannst du das auch bedingt steuern:
              const onPressHandler = () => {
                handleCliedPopover(option.action);
                // Falls du zusätzlich navigieren willst, könntest du hier:
                // if (option.navigation && option.action !== "addExercise") {
                //   router.push(option.navigation);
                // }
              };

              return (
                <View key={index} style={{ width: width * 0.45 }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      paddingHorizontal: width * 0.01,
                    }}
                    onPress={onPressHandler}
                  >
                    <Text
                      style={{
                        fontSize: width * 0.04,
                        margin: width * 0.02,
                        color: "white",
                      }}
                    >
                      {option.label}
                    </Text>
                    {option.icon}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </YStack>
      </View>
    </Popover>
  );
}
