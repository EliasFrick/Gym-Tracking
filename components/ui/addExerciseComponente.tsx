import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { Button, Input, TextArea } from "tamagui";
import { CustomDropDown } from "./CustomDropDown";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";

const { width, height } = Dimensions.get("window");

interface ExerciseComponentProps {
  items: { name: string }[]; // Typdefinition für die Items
  exerciseTitle: string; // Aktueller Wert
  setExerciseTitle: React.Dispatch<React.SetStateAction<string>>; // Funktion zum Aktualisieren des Werts
  bodyPart: string; // Aktueller Wert
  setBodyPart: React.Dispatch<React.SetStateAction<string>>; // Funktion zum Aktualisieren des Werts
  exerciseDescription: string; // Aktueller Wert
  setExerciseDescription: React.Dispatch<React.SetStateAction<string>>; // Funktion zum Aktualisieren des Werts
  image: string | null; // Aktueller Wert
  setImage: React.Dispatch<React.SetStateAction<string | null>>; // Funktion zum Aktualisieren des Werts
}

export function AddExerciseComponent({
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
          placeholder={`Name of Exercise...`}
          value={exerciseTitle}
          onChangeText={(text) => setExerciseTitle(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Body part:</Text>
        <View
          style={{
            width: width * 0.9,
          }}
        >
          <CustomDropDown items={items} val={bodyPart} setVal={setBodyPart} />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={{ marginBottom: 8 }}>Description:</Text>
        <View
          style={{
            width: width * 0.9,
            /*                   height: height * 1,
             */
          }}
        >
          <TextArea
            placeholder="Description..."
            style={{
              height: height * 0.15,
            }}
            value={exerciseDescription}
            onChangeText={(text) => setExerciseDescription(text)}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text>Add Picture:</Text>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Button alignSelf="center" size="$6" onPress={pickImage}>
            <AntDesign name="cloudupload" size={24} color="black" />
            <Text>Add Picture</Text>
          </Button>
          {image && (
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <Image source={{ uri: image }} style={styles.image} />
            </View>
          )}
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
