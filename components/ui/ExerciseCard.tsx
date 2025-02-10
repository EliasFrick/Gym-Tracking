import {
  IDeleteAlertDialog,
  IEditCardPopover,
  IExerciseCard,
} from "@/types/interfaces";
import { useContext, useEffect, useState, memo, useCallback } from "react";
import { Dimensions, View } from "react-native";
import type { CardProps } from "tamagui";
import { Card, H2, Image, Paragraph, YStack } from "tamagui";
import { X } from "@tamagui/lucide-icons";
import {
  Adapt,
  Button,
  Dialog,
  Sheet,
  Unspaced,
  XStack,
  AlertDialog,
} from "tamagui";
import EventEmitter from "@/components/EventListener";
import { collection, doc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { firestoreDB } from "@/database/Firebaseconfig";
import { getAuth } from "firebase/auth";
import { AppConfigContext } from "@/context/AppConfigProvider";
import { Animated } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { AppplicationContext } from "@/context/ApplicationProvider";

const { width, height } = Dimensions.get("window");

interface ExerciseCardProps extends CardProps {
  exerciseCard: IExerciseCard & { rotation?: string };
}

const AlertDialogDemo = memo(
  ({
    title,
    description,
    acceptButtonText,
    cancelButtonText,
    showAlertDialog,
    setShowAlertDialog,
  }: IDeleteAlertDialog) => {
    const handleDelete = useCallback(() => {
      EventEmitter.emit("finallyDeleteWorkout");
      setShowAlertDialog(false);
    }, [setShowAlertDialog]);

    return (
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            elevate
            key="content"
            animation={[
              "quick",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            style={{ maxWidth: "80%" }}
          >
            <YStack space>
              <AlertDialog.Title>{title}</AlertDialog.Title>
              <AlertDialog.Description>{description}</AlertDialog.Description>
              <XStack justifyContent="space-between" width="100%">
                <AlertDialog.Cancel asChild>
                  <Button backgroundColor={"red"} onPress={handleDelete}>
                    {acceptButtonText}
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button theme="active">{cancelButtonText}</Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    );
  }
);

const ExerciseCard = memo(
  (props: IExerciseCard) => {
    const defaultRotation = "0deg";
    const [showDeletePopover, setShowDeletePopover] = useState(false);
    const [exercises, setExercises] = useState<string[]>();
    const { currentWorkout, setCurrentWorkout } =
      useContext(AppplicationContext);
    const auth = getAuth();
    const firebaseUser = auth.currentUser;

    const handleLongPress = useCallback(() => {
      setShowDeletePopover(true);
    }, [props.id]);

    const handlePress = useCallback(async () => {
      try {
        const exercises = await findWorkoutWithID();
        if (exercises) {
          SheetManager.show("workout-exercise-sheet", {
            payload: {
              workoutId: props.id,
              currentWorkout: exercises,
            },
          });
        }
      } catch (error) {
        console.error("Error in handlePress:", error);
      }
    }, [props.id, currentWorkout]);

    const findWorkoutWithID = async () => {
      try {
        const workoutRef = collection(firestoreDB, "User");
        const workoutUserRef = doc(workoutRef, firebaseUser?.uid);
        const workoutCollectionRef = collection(workoutUserRef, "Workouts");
        const workoutDocRef = doc(workoutCollectionRef, props.id);
        const workoutDoc = await getDoc(workoutDocRef);

        if (workoutDoc.exists()) {
          const workoutData = workoutDoc.data();

          if (Array.isArray(workoutData?.exercises)) {
            setCurrentWorkout(workoutData.exercises);
            return workoutData.exercises;
          }
        } else {
          console.log("Workout not found!");
        }
      } catch (error) {
        console.error("Error fetching workout: ", error);
        throw error;
      }
    };

    return (
      <View
        style={[
          props?.style,
          {
            transform: [{ rotate: props?.rotation || defaultRotation }],
          },
        ]}
      >
        {showDeletePopover && (
          <DeletePopover
            title={props?.id}
            lastTrained={props?.lastDone}
            exercisesInPlan={exercises}
            setShowDeletePopover={setShowDeletePopover}
            showDeletePopover={showDeletePopover}
          />
        )}
        <Card
          elevate
          size="$4"
          animation="bouncy"
          width={width * 0.8}
          height={height * 0.2}
          scale={0.9}
          hoverStyle={{ scale: 0.925 }}
          pressStyle={{ scale: 0.875 }}
          onLongPress={handleLongPress}
          onPress={handlePress}
          backgroundColor={"white"}
        >
          <Card.Header padded>
            <H2>{props?.id}</H2>
            <Paragraph theme="alt2">Last Trained: {props?.lastDone}</Paragraph>
          </Card.Header>
          <Card.Background></Card.Background>
        </Card>
      </View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      prevProps.lastDone === nextProps.lastDone &&
      prevProps.rotation === nextProps.rotation
    );
  }
);

const DeletePopover = (props: IEditCardPopover) => {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const auth = getAuth();
  const firebaseUser = auth.currentUser;
  const { triggerRefreshDatabase } = useContext(AppConfigContext);

  useEffect(() => {
    const handleDeleteWorkout = () => {
      deleteWorkout(props.title);
    };

    EventEmitter.on("finallyDeleteWorkout", handleDeleteWorkout);

    return () => {
      EventEmitter.off("finallyDeleteWorkout", handleDeleteWorkout);
    };
  }, []);

  const deleteWorkout = async (id: string) => {
    try {
      const usersCollection = collection(firestoreDB, "User");
      const userRef = doc(usersCollection, firebaseUser?.uid);
      const workoutRef = collection(userRef, "Workouts");
      const workoutDocRef = doc(workoutRef, id);

      await deleteDoc(workoutDocRef);

      alert("Workout deleted successfully!");
      triggerRefreshDatabase();
      setShowAlertDialog(false);
      props.setShowDeletePopover(false);
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert("Error deleting workout. Please try again.");
    }
  };

  return (
    <Dialog
      modal
      open={props.showDeletePopover}
      onOpenChange={props.setShowDeletePopover}
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
          <AlertDialogDemo
            title={"Delete Workout"}
            showAlertDialog={showAlertDialog}
            setShowAlertDialog={setShowAlertDialog}
            description={"Are you sure you want to delete the workout"}
            acceptButtonText={"Delete Workout"}
            cancelButtonText={"Cancel"}
          />

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

export default ExerciseCard;
