import { IEditCardPopover, IExerciseCard } from "@/types/interfaces";
import { SetStateAction, useState } from "react";
import { Dimensions, View } from "react-native";
import type { CardProps } from "tamagui";
import { Card, H2, Image, Paragraph } from "tamagui";
import { X } from "@tamagui/lucide-icons";
import {
  Adapt,
  Button,
  Dialog,
  Fieldset,
  Input,
  Label,
  Sheet,
  TooltipSimple,
  Unspaced,
  XStack,
} from "tamagui";
import { Alertdialog } from "./AlertDialog";

const { width, height } = Dimensions.get("window");

interface ExerciseCardProps extends CardProps {
  exerciseCard: IExerciseCard & { rotation?: string }; // rotation als optionale Prop
}

export function ExerciseCard({
  exerciseCard,
  ...cardProps
}: ExerciseCardProps) {
  const defaultRotation = "0deg"; // Fallback, wenn keine Rotation angegeben ist
  const [showDeletePopover, setShowDeletePopover] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(true);
  const [exercises, setExercises] = useState<string[]>();

  const DeletePopover = (props: IEditCardPopover) => {
    return (
      <Dialog
        modal
        open={showDeletePopover}
        onOpenChange={setShowDeletePopover}
      >
        <Adapt platform="touch">
          <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
            <Sheet.Frame padding="$4" gap="$4">
              <Adapt.Contents />
            </Sheet.Frame>
            <Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="slow"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />

          <Dialog.Content
            bordered
            elevate
            key="content"
            animateOnly={["transform", "opacity"]}
            animation={[
              "quicker",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
          >
            <Dialog.Title>{props.title}</Dialog.Title>
            <Dialog.Description>{props.lastTrained}</Dialog.Description>

            <Button
              theme="active"
              aria-label="Close"
              width={width * 0.9}
              onPress={() => setShowAlertDialog(true)}
            >
              Edit
            </Button>
            <XStack justifyContent="space-between" alignItems="center" gap="$4">
              <Button
                theme="active"
                backgroundColor={"red"}
                aria-label="Close"
                width={width * 0.4}
                onPress={() => setShowAlertDialog(true)}
              >
                Delete
              </Button>
              <Dialog.Close displayWhenAdapted asChild>
                <Button width={width * 0.4} theme="active" aria-label="Close">
                  Save changes
                </Button>
              </Dialog.Close>
            </XStack>
            <Dialog.Description>{props.exercisesInPlan}</Dialog.Description>

            <Unspaced>
              <Dialog.Close asChild>
                <Button
                  position="absolute"
                  top="$3"
                  right="$3"
                  size="$2"
                  circular
                  icon={X}
                />
              </Dialog.Close>
            </Unspaced>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    );
  };

  return (
    <View
      style={[
        exerciseCard?.style,
        { transform: [{ rotate: exerciseCard?.rotation || defaultRotation }] },
      ]}
    >
      {showDeletePopover && (
        <DeletePopover
          title={exerciseCard?.title}
          lastTrained={exerciseCard.lastDone}
          exercisesInPlan={exercises}
        />
      )}
      {/* {showAlertDialog && (
        <Alertdialog
          title="Sure?"
          description="Test Description"
          acceptButtonTitle="Löschen"
          rejectButtonTitle="Abbrechen"
          setShowAlertDialog={setShowAlertDialog}
        />
      )} */}
      <Card
        elevate
        size="$4"
        animation="bouncy"
        width={width * 0.8}
        height={height * 0.2}
        scale={0.9}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
        onLongPress={() => setShowDeletePopover(true)}
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
              height: height * 0.2, // Specify size here if needed
            }}
          />
        </Card.Background>
      </Card>
    </View>
  );
}
