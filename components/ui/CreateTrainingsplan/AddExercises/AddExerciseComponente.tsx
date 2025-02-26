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
import { SheetManager } from "react-native-actions-sheet";

const { width, height } = Dimensions.get("window");

const MUSCLE_GROUP = [
  { label: "Arms", value: "Arms" },
  { label: "Chest", value: "Chest" },
  { label: "Back", value: "Back" },
  { label: "Shoulder", value: "Shoulder" },
  { label: "Legs", value: "Legs" },
  { label: "Neck", value: "Neck" },
] as const;

export function AddExerciseComponent({
  title,
  setTitle,
  description,
  setDescription,
  image,
  setImage,
  mainGroup,
  setMainGroup,
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

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openMuscleGroupSheet = () => {
    SheetManager.show("muscle-group-selector-sheet", {
      payload: {
        selectedMuscleGroup: mainGroup || "",
        onSelect: (mainGroup: string) => {
          setMainGroup(mainGroup);
        },
      },
    });
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: "#E0E0E0" }]}>Title:</Text>
        <Input
          style={{
            width: width * 0.9,
            height: height * 0.05,
            color: "black",
          }}
          placeholderTextColor="#A0A0A0"
          placeholder="Name of Exercise..."
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Muscle Group</Text>
        <TouchableOpacity
          style={styles.dropdownInput}
          onPress={openMuscleGroupSheet}
        >
          <Text style={{ color: "white", fontSize: 16 }}>
            {MUSCLE_GROUP.find((option) => option.value === mainGroup)?.label ||
              "Select Muscle Group"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: "#E0E0E0" }]}>Description:</Text>
        <View style={{ width: width * 0.9 }}>
          <TextArea
            placeholder="Description..."
            style={{
              height: height * 0.15,
              color: "black",
            }}
            placeholderTextColor="#A0A0A0"
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
      </View>

      {/*  <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: "#E0E0E0" }]}>Add Picture:</Text>
        <View style={{ flexDirection: "row" }}>
          <Button alignSelf="center" size="$6" onPress={pickImage}>
            <AntDesign name="cloudupload" size={24} color="white" />
            <Text style={{ color: "#FFFFFF" }}>Add Picture</Text>
          </Button>
          {image && (
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <Image source={{ uri: image }} style={styles.image} />
            </View>
          )}
        </View>
      </View> */}
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
    width: "100%",
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    alignItems: "flex-start",
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
  },
  label: {
    marginBottom: 8,
    color: "white",
  },
  dropdownInput: {
    backgroundColor: "#242424",
    padding: 15,
    borderRadius: 8,
    color: "white",
    fontSize: 16,
  },
});
