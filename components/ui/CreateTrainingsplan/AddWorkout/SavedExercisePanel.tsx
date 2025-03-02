import { Dimensions, Text, View } from "react-native";
import { Card, XStack } from "tamagui";
import { IPickedExercisesDeleteList } from "@/types/interfaces";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
const { width, height } = Dimensions.get("window");

export function SavedExercisePanel({
  pickedExercises,
  setPickedExercises,
}: IPickedExercisesDeleteList) {
  const deleteExercise = (id: string) => {
    setPickedExercises((prev) =>
      prev?.filter((exercise) => exercise.id !== id)
    );
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
    return (
      <ScaleDecorator>
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
          onLongPress={drag}
          style={{
            opacity: isActive ? 0.5 : 1,
            backgroundColor: isActive ? "#E1E1E1" : "white",
          }}
        >
          <XStack
            justifyContent="space-between"
            alignItems="center"
            style={{ height: "100%" }}
          >
            <Text
              style={{
                flexShrink: 1,
                flexWrap: "wrap",
                marginLeft: width * 0.05,
                fontSize: 18,
              }}
            >
              {item.name}
            </Text>
            <MaterialCommunityIcons
              name="dots-grid"
              size={width * 0.09}
              color="black"
              style={{ marginRight: width * 0.03 }}
              onPress={() => deleteExercise(item.id)}
            />
          </XStack>
        </Card>
      </ScaleDecorator>
    );
  };

  return (
    <View style={{ width: "100%", height: height * 0.62 }}>
      <DraggableFlatList
        data={pickedExercises || []}
        onDragEnd={({ data }) => setPickedExercises(data)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}
