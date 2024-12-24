import { TouchableOpacity, View, Text, Dimensions } from "react-native";
import type { PopoverProps } from "tamagui";
import { Popover, SwitchThumb, YStack } from "tamagui";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const { width, height } = Dimensions.get("window");

export function AddDropOver({
  Icon,
  Name,
  shouldAdapt,
  ...props
}: PopoverProps & { Icon?: any; Name?: string; shouldAdapt?: boolean }) {
  const router = useRouter();

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

  useEffect(() => {
    console.log("AddDropOver");
  }, []);

  return (
    <Popover size="$8" allowFlip {...props}>
      <Popover.Trigger asChild>
        <TouchableOpacity>
          <Feather name="plus" size={width * 0.08} color="black" />
        </TouchableOpacity>
      </Popover.Trigger>
      <Popover.Content
        style={{
          transform: [
            { translateY: -height * 0.03 },
            { translateX: width * 0.09 },
          ],
          width: width * 0.6,
          maxWidth: 300,
        }}
        backgroundColor={"transparent"}
        borderWidth={1}
        borderColor="transparent"
        enterStyle={{ y: -height * 0.02, opacity: 0 }}
        exitStyle={{ y: -height * 0.02, opacity: 0 }}
        elevate
        animation={[
          "quick",
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <YStack gap={height * 0.02}>
          <Popover.Close asChild>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: height * 0.03,
              }}
            >
              {["Create own", "Use Template", "Create with AI"].map(
                (option, index) => (
                  <Popover.Close asChild key={index}>
                    <TouchableOpacity
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        paddingHorizontal: width * 0.03,
                      }}
                      onPress={() => navigateToNextScreen(index)}
                    >
                      <Text
                        style={{ fontSize: width * 0.04, margin: width * 0.02 }}
                      >
                        {option}
                      </Text>
                      {index === 0 && (
                        <Ionicons
                          name="create"
                          size={width * 0.07}
                          color="black"
                        />
                      )}
                      {index === 1 && (
                        <Entypo
                          name="box"
                          size={width * 0.07}
                          color="black"
                          style={{ marginRight: width * 0.01 }}
                        />
                      )}
                      {index === 2 && (
                        <FontAwesome5
                          name="robot"
                          size={width * 0.07}
                          color="black"
                        />
                      )}
                    </TouchableOpacity>
                  </Popover.Close>
                )
              )}
            </View>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  );
}
