import { Dimensions, Text } from "react-native";
import { Button, Card, XStack } from "tamagui";
import { IAddedExercisePanel } from "@/types/interfaces";
import AntDesign from "@expo/vector-icons/AntDesign";

const { width } = Dimensions.get("window"); // Höhe wird nicht fix benötigt

export function SavedExercisePanel(props: IAddedExercisePanel) {
  return (
    <Card
      elevate
      size="$4"
      animation="bouncy"
      width={width * 0.9}
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      // Entfernt die fixe Höhe
    >
      <Card.Header>
        <XStack justifyContent="space-between">
          <Text style={{ flexShrink: 1, flexWrap: "wrap" }}>{props.title}</Text>
          <AntDesign name="minus" size={24} color="black" />{" "}
        </XStack>
      </Card.Header>
    </Card>
  );
}
