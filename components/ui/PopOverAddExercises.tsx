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
import { AddExerciseComponent } from "./AddExerciseComponente";
import { getAuth } from "firebase/auth";
import { ICreateCustomExercise } from "@/types/interfaces";
import EventEmitter from "@/components/EventListener";

const { width, height } = Dimensions.get("window");

export function PopOverAddExercises() {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;

  const router = useRouter();
  const [showPopover, setShowPopover] = useState(false);
  const [customExercise, setCustomExercise] =
    React.useState<ICreateCustomExercise>({
      userID: firebaseUser!.uid, // Standardwerte
      exerciseName: "",
      exerciseDescription: "",
      exerciseTargetMuscle: "",
      exerciseImage: null,
    });
  const options = [
    {
      label: "Add Workout",
      navigation: "createOwnPlan",
      icon: <Ionicons name="create" size={width * 0.07} color="black" />,
      action: "addWorkout",
    },
    {
      label: "Add Exercises",
      navigation: "createOwnPlan",
      icon: <Ionicons name="barbell" size={width * 0.07} color="black" />,
      action: "addExercise",
    },
    {
      label: "Create with AI",
      navigation: "createWithAI",
      icon: <Ionicons name="hardware-chip" size={width * 0.07} color="black" />,
      action: "createWithAi",
    },
  ];

  const navigateToNextScreen = (index: number) => {
    switch (index) {
      case 0:
        router.replace("/createOwnPlan");
        break;
      case 1:
        router.replace("/chooseTemplate");
        break;
      case 2:
        router.replace("/createWithAI");
        break;
    }
  };

  const showToolTop = () => {
    setShowPopover(true);
    console.log("Show Tool Top");
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

  const toggleAddExerciseBoolean = () => {
    const currentValue = EventEmitter.getState("addExerciseBoolean") || false;
    EventEmitter.setState("addExerciseBoolean", !currentValue);
  };

  const toggleAddWorkoutBoolean = () => {
    const currentValue = EventEmitter.getState("addWorkoutBoolean") || false;
    alert(currentValue);
    EventEmitter.setState("addWorkoutBoolean", !currentValue);
  };

  const handleCliedPopover = (index: string) => {
    setShowPopover(false);
    if (index === "addExercise") {
      toggleAddExerciseBoolean();
    } else if (index === "addWorkout") {
      toggleAddWorkoutBoolean();
    } else if (index === "createWithAi") {
      alert("Create With AI");
    }
  };

  return (
    <Popover
      displayArea={{ x: width * 0.52, y: height * 0.117, width, height }}
      arrowSize={{ width: -1, height: -1 }}
      isVisible={showPopover}
      onRequestClose={() => setShowPopover(false)}
      from={
        <TouchableOpacity onPress={() => setShowPopover(true)}>
          <Feather name="plus" size={width * 0.08} color="black" />
        </TouchableOpacity>
      }
    >
      <View backgroundColor={"#F86E51"} borderWidth={1} borderColor="#F86E51">
        <YStack gap={height * 0.02}>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: height * 0.02,
            }}
          >
            {options.map((option, index) => (
              <View asChild key={index} style={{ width: width * 0.45 }}>
                <Link href={option.navigation}>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      paddingHorizontal: width * 0.01,
                    }}
                    onPress={() => handleCliedPopover(option.action)}
                  >
                    <Text
                      style={{ fontSize: width * 0.04, margin: width * 0.02 }}
                    >
                      {option.label}
                    </Text>
                    {option.icon}
                  </TouchableOpacity>
                </Link>
              </View>
            ))}
          </View>
        </YStack>
      </View>
    </Popover>
  );
}
