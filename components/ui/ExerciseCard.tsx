import { IExerciseCard } from "@/types/interfaces";
import { Dimensions, View } from "react-native";
import type { CardProps } from "tamagui";
import { Button, Card, H2, Image, Paragraph, XStack } from "tamagui";

const { width, height } = Dimensions.get("window");

/* export function ExerciseCard(ExerciseCard: IExerciseCard) {
  return (
    <XStack $sm={{ flexDirection: "column" }} paddingHorizontal="$4" space>
      <TamaguiCard
        animation="bouncy"
        size="$4"
        width={250}
        height={300}
        scale={0.9}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
      />
    </XStack>
  );
} */

interface ExerciseCardProps extends CardProps {
  exerciseCard: IExerciseCard & { rotation?: string }; // rotation als optionale Prop
}

export function ExerciseCard({
  exerciseCard,
  ...cardProps
}: ExerciseCardProps) {
  const defaultRotation = "0deg"; // Fallback, wenn keine Rotation angegeben ist

  return (
    <View
      style={[
        exerciseCard?.style,
        { transform: [{ rotate: exerciseCard?.rotation || defaultRotation }] },
      ]}
    >
      <Card
        elevate
        size="$4"
        animation="bouncy"
        width={width * 0.8}
        height={height * 0.15}
        scale={0.9}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
      >
        <Card.Header padded>
          <H2>{exerciseCard?.title}</H2>
          <Paragraph theme="alt2">
            Last Trained: {exerciseCard?.lastDone}
          </Paragraph>
        </Card.Header>
        {/*  <Card.Footer padded>
          <Paragraph theme="alt2">
            Last Trained: {exerciseCard?.lastDone}
          </Paragraph>
        </Card.Footer> */}
        <Card.Background>
          <Image
            resizeMode="cover"
            alignSelf="center"
            source={
              typeof exerciseCard?.image === "string"
                ? { uri: exerciseCard.image } // Falls es eine URL ist
                : exerciseCard.image // Falls es ein lokales Asset ist
            }
            style={{
              width: width * 0.8,
              height: height * 0.15, // Specify size here if needed
            }}
          />
        </Card.Background>
      </Card>
    </View>
  );
}
