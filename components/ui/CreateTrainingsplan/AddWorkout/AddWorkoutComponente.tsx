import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { Button, Input, TextArea } from "tamagui";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { ExerciseComponentProps } from "@/types/interfaces";
import { CustomDropDown } from "../CustomDropDown";
import { AddExercisePanel } from "./AddExercisePanel";

const { width, height } = Dimensions.get("window");

export function AddWorkoutComponent({
  items,
  bodyPart,
  setBodyPart,
  exerciseTitle,
  setExerciseTitle,
  exerciseDescription,
  setExerciseDescription,
  image,
  setImage,
  ...props
}: ExerciseComponentProps) {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <Text style={{ marginBottom: 8 }}>Title:</Text>
        <Input
          style={{
            width: width * 0.9,
            height: height * 0.05,
          }}
          placeholder={`Name of Workout...`}
          value={exerciseTitle}
          onChangeText={(text) => setExerciseTitle(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Workout type:</Text>
        <View
          style={{
            width: width * 0.9,
          }}
        >
          <CustomDropDown items={items} val={bodyPart} setVal={setBodyPart} />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text>Add Exercises:</Text>
        <View
          style={{
            width: width * 0.9,
          }}
        >
          <AddExercisePanel />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F86E51",
  },
  sheetContainer: {
    marginTop: height * 0.02,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  inputContainer: {
    width: "100%", // Nimmt die volle Breite des übergeordneten Containers
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    alignItems: "flex-start", // Text linksbündig
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
  },
});
