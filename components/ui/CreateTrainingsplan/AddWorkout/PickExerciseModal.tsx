import { IExerciseListProps, IPickeExerciseModal } from "@/types/interfaces";
import { Sheet } from "@tamagui/sheet";
import React, {
  memo,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "tamagui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ExerciseList } from "./ExerciseList";
import { ListWithAddedExercises } from "./ListWithAddedExercises";
import AntDesign from "@expo/vector-icons/AntDesign";

const { width, height } = Dimensions.get("window");

export const PickExerciseModal = memo((props: IPickeExerciseModal) => {
  const [position, setPosition] = React.useState(0);

  return (
    <Sheet
      forceRemoveScrollEnabled={props.open}
      modal={true}
      open={props.open}
      onOpenChange={props.setOpen}
      snapPoints={[90]}
      snapPointsMode="percent"
      position={position}
      onPositionChange={setPosition}
      zIndex={100_000}
      animation="medium"
      animationConfig={{
        mass: 1,
        damping: 25,
        stiffness: 200,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      }}
      dismissOnSnapToBottom
      disableBackdropAnimation={true}
      disableHideBottomOverflow={true}
      moveOnKeyboardChange={false}
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        opacity={0.5}
        backgroundColor="rgba(0,0,0,0.5)"
      />

      <Sheet.Frame
        padding="$4"
        gap="$5"
        backgroundColor="$background"
        style={{ height: "100%" }}
      >
        <SheetContents
          pickedExercises={props.pickedExercises}
          setPickedExercises={props.setPickedExercises}
          setOpen={props.setOpen}
        />
      </Sheet.Frame>
    </Sheet>
  );
});

const SheetContents = memo(
  ({
    pickedExercises,
    setPickedExercises,
    setOpen,
  }: IExerciseListProps & { setOpen: (open: boolean) => void }) => {
    const closeSheet = useCallback(() => {
      setOpen(false);
    }, [setOpen]);

    return (
      <View style={styles.sheetContentContainer}>
        <TouchableOpacity onPress={closeSheet} activeOpacity={1}>
          <AntDesign name="close" size={30} color="black" />
        </TouchableOpacity>
        <View style={styles.addedExercisesContainer}>
          {pickedExercises?.map((value, index) => (
            <ListWithAddedExercises key={value.id || index} exercise={value} />
          ))}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Search..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity>
            <Ionicons
              name="search"
              size={24}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: height * 0.02 }}>
          <ExerciseList
            pickedExercises={pickedExercises}
            setPickedExercises={setPickedExercises}
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  sheetContentContainer: {
    flex: 1,
    width: "100%",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.9,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginTop: height * 0.02,
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  icon: {
    margin: 10,
  },
  wrapper: {
    width: width * 0.45, // Etwa die Hälfte der Breite für zwei Elemente pro Zeile
    marginRight: 10,
    marginBottom: 10,
  },
  addedExercisesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
  },
});
