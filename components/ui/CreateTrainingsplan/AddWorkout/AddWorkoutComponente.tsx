import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Input } from "tamagui";
import { ExerciseComponentProps, WorkoutHistoryItem } from "@/types/interfaces";
import { AddExercisePanel } from "./AddExercisePanel";
import { useEffect, memo, useLayoutEffect, useState } from "react";
import { SavedExercisePanel } from "./SavedExercisePanel";
import EventEmitter from "@/components/EventListener";
import { auth, firestoreDB } from "@/database/Firebaseconfig";
import axios from "axios";
import { GEMINI_API_KEY } from "@env";
import { useAppConfig } from "@/context/AppConfigProvider";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { getOfflineWorkoutHistory } from "@/utils/offlineStorage";

const { width, height } = Dimensions.get("window");

export const AddWorkoutComponent = memo(
  ({
    title,
    setTitle,
    description,
    setDescription,
    image,
    setImage,
    informations,
    setInformations,
    ...props
  }: ExerciseComponentProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [aiPlan, setAIPlan] = useState<any>();
    const { isOnline } = useAppConfig();
    const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryItem[]>(
      []
    );
    const [infoTextForAI, setinfoTextForAI] = useState<string>();

    useEffect(() => {
      const deleteExerciseFromList = (exerciseID: string) => {
        setInformations((prev) =>
          prev?.filter((exercise) => exercise.id !== exerciseID)
        );
      };

      EventEmitter.on("deletetExercise", deleteExerciseFromList);

      return () => {
        EventEmitter.off("deletetExercise", deleteExerciseFromList);
      };
    }, []);

    const fetchWorkoutHistory = async () => {
      try {
        if (isOnline) {
          const user = auth.currentUser;
          if (!user) return;

          // Hole die Workout-Historie wie bisher
          const historyRef = collection(
            firestoreDB,
            "User",
            user.uid,
            "WorkoutHistory"
          );
          const q = query(historyRef, orderBy("date", "desc"));
          const querySnapshot = await getDocs(q);

          const history: WorkoutHistoryItem[] = [];
          querySnapshot.forEach((doc) => {
            history.push({ id: doc.id, ...doc.data() } as WorkoutHistoryItem);
          });
          setWorkoutHistory(history);
        } else {
          const history = await getOfflineWorkoutHistory();
          setWorkoutHistory(history);
        }
      } catch (error) {
        console.error("Error fetching workout history:", error);
      }
    };

    const createPlanWithAI = async () => {
      try {
        // Wrap the Alert.prompt in a Promise to make it wait for user input
        const userInput = await new Promise<string | null>((resolve) => {
          Alert.prompt("What kind of plan?", "Enter Informations for the AI", [
            {
              text: "Cancel",
              onPress: () => resolve(null),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: (info) => resolve(info || ""),
            },
          ]);
        });

        // If user pressed Cancel or provided no input, exit the function
        if (userInput === null || userInput.trim() === "") {
          console.log("AI plan creation cancelled or no information provided");
          return;
        }

        // Set the info text and continue with the rest of the function
        setinfoTextForAI(userInput);
        setIsLoading(true);

        const user = auth.currentUser;
        if (!user) {
          throw new Error("No user logged in");
        }

        await fetchWorkoutHistory();
        console.log(workoutHistory);

        const prompt = `
    I want you to create a personalized workout plan based on my workout history and my current training goals. I will provide you with my workout history, and I will also specify the muscle groups I want to train. You will generate the best possible workout plan for me, ensuring it aligns with my past training and optimizes my progress.
    
    Instructions:
    Consider my workout history to balance intensity, volume, and recovery.
    Choose the best exercises that fit my goals and training experience.
    Do not include exercises I have already done excessively unless necessary for balance.
    Focus on progressive overload and muscle symmetry.
    The response should be a JSON array, where each exercise is an object with the following structure:
    json
    Copy
    Edit
    [
      {
        "id": "unique_exercise_id",
        "mainGroup": "Chest",  
        "name": "Incline Bench Press",
        "primaryMuscle": "Upper Chest"
      },
      {
        "id": "unique_exercise_id",
        "mainGroup": "Arms",  
        "name": "Barbell Curl",
        "primaryMuscle": "Biceps"
      }
    ]
    Input Data:
    Workout History:  ${workoutHistory}
    Target Muscle Groups: ${userInput}
    Return only the JSON output without any explanations or additional text
    `;

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log(response);

        const result =
          response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Keine Analyse verfügbar.";

        setAIPlan(result);
      } catch (error) {
        console.error("Error analyzing workouts:", error);
        setAIPlan("Fehler bei der Analyse. Bitte versuche es später erneut.");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <View>
        <View style={styles.inputContainer}>
          <Text style={[styles.title, { color: "#E0E0E0" }]}>Title:</Text>
          <Input
            style={{
              width: width * 0.9,
              height: height * 0.05,
              color: "black",
            }}
            placeholderTextColor="#A0A0A0"
            placeholder="Name of Workout..."
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <View
            style={{
              width: width * 0.9,
            }}
          >
            <Text style={[styles.title, { color: "#E0E0E0" }]}>
              Add Exercises:
            </Text>
            <View style={{ marginBottom: height * 0.03 }}>
              <AddExercisePanel
                pickedExercises={informations}
                setPickedExercises={setInformations}
              />
            </View>
            {informations === undefined ? (
              <TouchableOpacity
                style={styles.CreateWithAIButton}
                onPress={createPlanWithAI}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: "white", fontSize: height * 0.022 }}>
                    Create With AI
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <></>
            )}

            <SavedExercisePanel
              pickedExercises={informations}
              setPickedExercises={setInformations}
            />
          </View>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison für memo
    return (
      prevProps.title === nextProps.title &&
      prevProps.description === nextProps.description &&
      JSON.stringify(prevProps.informations) ===
        JSON.stringify(nextProps.informations)
    );
  }
);

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
  title: {
    height: height * 0.03,
    marginBottom: height * 0.002,
  },
  CreateWithAIButton: {
    backgroundColor: "red",
    height: height * 0.055,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
