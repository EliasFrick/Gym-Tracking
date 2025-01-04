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

const { width, height } = Dimensions.get("window");

export function PopOverAddExercises() {
  const router = useRouter();
  const [showPopover, setShowPopover] = useState(false);

  const options = [
    {
      label: "Create Own Plan",
      navigation: "createOwnPlan",
      icon: <Ionicons name="create" size={width * 0.07} color="black" />,
    },
    {
      label: "Choose a Template",
      navigation: "chooseTemplate",
      icon: <Entypo name="box" size={width * 0.07} color="black" />,
    },
    {
      label: "Create with AI",
      navigation: "createWithAI",
      icon: <FontAwesome5 name="robot" size={width * 0.07} color="black" />,
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

  return (
    <Popover
      displayArea={{ x: width * 0.47, y: height * 0.117, width, height }}
      arrowSize={{ width: -1, height: -1 }}
      isVisible={showPopover}
      /*       mode={PopoverMode.TOOLTIP}
       */ from={
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
              <Link href={option.navigation} asChild key={index}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    paddingHorizontal: width * 0.03,
                  }}
                  onPress={() => setShowPopover(false)}
                >
                  <Text
                    style={{ fontSize: width * 0.04, margin: width * 0.02 }}
                  >
                    {option.label}
                  </Text>
                  {option.icon}
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </YStack>
      </View>
    </Popover>
  );
}
