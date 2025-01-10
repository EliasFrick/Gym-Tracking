import { Dimensions, Text } from "react-native";
import { Button, Card, H4, H6, Paragraph, XStack } from "tamagui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { IAddedExercisePanel } from "@/types/interfaces";

const { width } = Dimensions.get("window"); // Höhe wird nicht fix benötigt

export function AddExercisePanel() {
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
          <Text style={{ flexShrink: 1, flexWrap: "wrap" }}>
            Add Exercise....
          </Text>
          <Ionicons name="add" size={24} color="black" />
        </XStack>
      </Card.Header>
    </Card>
  );
}
