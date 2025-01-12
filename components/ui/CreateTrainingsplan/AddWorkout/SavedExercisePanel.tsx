import { Dimensions, Text } from "react-native";
import { Button, Card, XStack } from "tamagui";
import {
  IAddedExercisePanel,
  IExerciseListProps,
  IPickedExercises,
  IPickedExercisesDeleteList,
} from "@/types/interfaces";
import AntDesign from "@expo/vector-icons/AntDesign";
const { width, height } = Dimensions.get("window");

export function SavedExercisePanel({
  id,
  name,
  primaryMuscle,
  mainGroup,
  pickedExercises,
  setPickedExercises,
}: IPickedExercisesDeleteList) {
  const deleteExercise = (id: string) => {
    // Entferne das Exercise basierend auf der ID
    setPickedExercises((prev) =>
      prev?.filter((exercise) => exercise.id !== id)
    );
  };

  return (
    <Card
      elevate
      size="$4"
      animation="bouncy"
      width={width * 0.9}
      height={height * 0.05}
      scale={0.9}
      marginBottom={width * 0.02}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      onPress={() => deleteExercise(id)}
    >
      <XStack
        justifyContent="space-between"
        alignItems="center"
        style={{ height: "100%" }}
      >
        <Text
          style={{ flexShrink: 1, flexWrap: "wrap", marginLeft: width * 0.05 }}
        >
          {name}
        </Text>
        <AntDesign
          name="minus"
          size={24}
          color="black"
          style={{ marginRight: width * 0.03 }}
        />
      </XStack>
    </Card>
  );
}
