import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import { Text, XStack, YStack, Select, Adapt, Sheet, TextArea } from "tamagui";
import { GEMINI_API_KEY } from "@env";
import axios from "axios";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  writeBatch,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { firestoreDB, auth } from "@/database/Firebaseconfig";
import {
  AnalysisData,
  Exercise,
  UserInfo,
  WeightEntry,
  WorkoutHistoryItem,
} from "@/types/interfaces";

const { width, height } = Dimensions.get("window");

const dietOptions = [
  { name: "Muskelaufbau (Bulk)", value: "bulking" },
  { name: "Abnehmen (Cut)", value: "cutting" },
  { name: "Gewicht halten", value: "maintaining" },
] as const;

export const WorkoutAnalysisSheet = (
  props: SheetProps<"workout-analysis-sheet">
) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    language: "",
    userInformation: "",
  });
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseNames, setExerciseNames] = useState<{
    [key: string]: Exercise;
  }>({});
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "",
    firstName: "",
    lastName: "",
    height: "",
    diet: "maintaining",
  });

  // Fetch exercise names when component mounts
  useEffect(() => {
    fetchExerciseNames();
  }, []);

  const fetchExerciseNames = async () => {
    try {
      const exercisesRef = collection(firestoreDB, "DefaultExercises");
      const snapshot = await getDocs(exercisesRef);
      const exerciseData: { [key: string]: Exercise } = {};

      snapshot.forEach((doc) => {
        exerciseData[doc.id] = doc.data() as Exercise;
      });

      setExerciseNames(exerciseData);
    } catch (error) {
      console.error("Error fetching exercise names:", error);
    }
  };

  const fetchBodyWeight = async (): Promise<WeightEntry[]> => {
    const user = auth.currentUser;
    if (!user) return [];
    try {
      const weightsRef = collection(
        firestoreDB,
        "User",
        user.uid,
        "WeightHistory"
      );

      const q = query(weightsRef, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);

      const weights: WeightEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        weights.push({
          weight: data.weight,
          date: data.date.toDate(),
        });
      });

      return weights;
    } catch (error) {
      console.error("Error fetching body weight:", error);
      return [];
    }
  };

  const loadUserInfo = async (): Promise<UserInfo | null> => {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userDoc = await getDoc(doc(firestoreDB, "User", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const info: UserInfo = {
          username: data.userName || "",
          firstName: data.firstname || "",
          lastName: data.lastname || "",
          height: data.height?.toString() || "",
          diet: data.diet || "",
        };
        return info;
      }
    } catch (error) {
      console.error("Error loading user info:", error);
      Alert.alert("Error", "Failed to load user information");
    }
    return null;
  };

  const analyzeWorkouts = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user logged in");
      }

      // Fetch weight history and user info concurrently
      const [weightHistoryData, userInfoData] = await Promise.all([
        fetchBodyWeight(),
        loadUserInfo(),
      ]);

      // Update state if needed
      setWeightHistory(weightHistoryData);
      if (userInfoData) {
        setUserInfo(userInfoData);
      }

      const currentWeight =
        weightHistoryData[weightHistoryData.length - 1]?.weight || "";

      const workoutHistory = props.payload?.workoutHistory || [];

      const formattedWorkoutHistory = workoutHistory.map(
        (workout: WorkoutHistoryItem) => {
          const exercises = Object.entries(workout.exercises).map(
            ([exerciseId, sets]) => ({
              name: exerciseNames[exerciseId]?.name || exerciseId,
              mainGroup: exerciseNames[exerciseId]?.mainGroup || "Unknown",
              primaryMuscle:
                exerciseNames[exerciseId]?.primaryMuscle || "Unknown",
              sets: sets.map((set, index) => ({
                setNumber: index + 1,
                reps: set.reps,
                weight: set.weight,
              })),
            })
          );

          return {
            date: new Date(workout.date).toLocaleDateString(),
            workoutName: workout.workoutId,
            exercises,
          };
        }
      );

      console.log(JSON.stringify(weightHistoryData, null, 2));

      const prompt = `
You are an AI assistant that analyzes a user's gym workout history and provides structured feedback to help them optimize their training.

User Data Input:

Workout logs (e.g., exercises, weights, reps, sets, frequency)
Progress trends (e.g., strength increase, endurance, recovery times)
Muscle group distribution
Training consistency
Response Format:
Provide the analysis in a structured, user-friendly format with clear recommendations. The output should be concise and actionable.

Output Template:

📊 Overall Assessment: (Brief summary of their current progress, e.g., "Great progress in upper body strength, but lower body training is imbalanced.")

✅ Strengths: (Highlight positive aspects, e.g., "Bench press strength increased by 10% over the last 4 weeks.")

⚠️ Areas for Improvement: (Identify weaknesses, e.g., "Leg training volume is 30% lower than upper body workouts.")

💡 Actionable Recommendations: (Provide 2-3 specific, data-driven suggestions, e.g., "Increase lower body training volume by 20% or add an extra leg session per week.")


Tone & Style:

Keep the language motivational and constructive
Use emoji icons to make it engaging (optional)
Be brief but informative
        
Personal Information:
- FirstName: ${userInfoData?.firstName || ""}
- Nutrition: ${userInfoData?.diet || ""}
- Weight: ${currentWeight}
- Bodyweight History: ${JSON.stringify(weightHistoryData.reverse(), null, 2)}
- Size: ${userInfoData?.height || ""}cm
- User Informations: ${analysisData.userInformation || ""}

when analyzing your body weight, also take into account the date that it says and tell me whether the trend is increasing or decreasing and how much I gain or lose on average per week and whether this is good or bad

Workout-History:
${JSON.stringify(formattedWorkoutHistory, null, 2)}
      Write the report in ${analysisData.language}`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const result =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Keine Analyse verfügbar.";

      // Save analysis to Firestore
      await setDoc(
        doc(
          firestoreDB,
          "User",
          user.uid,
          "AIResult",
          new Date().toISOString()
        ),
        {
          analysis: result,
          timestamp: new Date(),
          workoutData: {
            diet: userInfoData?.diet || "",
            weight: currentWeight,
            analyzedWorkouts: formattedWorkoutHistory,
            height: userInfoData?.height || "",
          },
        }
      );

      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing workouts:", error);
      setAnalysis("Fehler bei der Analyse. Bitte versuche es später erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ActionSheet
        containerStyle={styles.container}
        indicatorStyle={{ backgroundColor: "white" }}
      >
        <YStack space="$4" padding="$4">
          <Text style={styles.title}>Training Analyze</Text>

          <View style={[styles.inputContainer]}>
            <Text style={styles.label}>Set your language</Text>
            <TextInput
              style={styles.input}
              keyboardType="default"
              placeholder="english..."
              value={analysisData.language}
              onChangeText={(text) =>
                setAnalysisData((prev) => ({ ...prev, language: text }))
              }
            />
          </View>
          <View style={{ width: width * 0.9 }}>
            <Text style={styles.label}>Give more Informations about you</Text>
            <TextArea
              placeholder="input..."
              style={{
                height: height * 0.15,
                color: "#FFFFFF",
                backgroundColor: "#2D2D2D",
                borderRadius: 8,
                borderColor: "#2D2D2D",
              }}
              placeholderTextColor="#A0A0A0"
              value={analysisData.userInformation}
              onChangeText={(text) =>
                setAnalysisData((prev) => ({ ...prev, userInformation: text }))
              }
            />
          </View>
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={analyzeWorkouts}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Analyze</Text>
            )}
          </TouchableOpacity>
          {analysis && (
            <ScrollView style={styles.analysisContainer}>
              <Text style={styles.analysisText}>{analysis}</Text>
            </ScrollView>
          )}
        </YStack>
      </ActionSheet>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
    height: height * 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    color: "white",
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#2D2D2D",
    borderRadius: 8,
    padding: 12,
    color: "white",
    fontSize: 16,
  },
  analyzeButton: {
    backgroundColor: "#F86E51",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  analysisContainer: {
    backgroundColor: "#2D2D2D",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: height * 0.4,
  },
  analysisText: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
  },
  selectButton: {
    backgroundColor: "#2D2D2D",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectButtonText: {
    color: "white",
    fontSize: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  optionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#2D2D2D",
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: "#3D3D3D",
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },
});
