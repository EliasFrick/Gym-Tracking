import React, { useState, useEffect } from "react";
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
} from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import { Text, XStack, YStack, Select, Adapt, Sheet } from "tamagui";
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
} from "firebase/firestore";
import { firestoreDB, auth } from "@/database/Firebaseconfig";

const { width, height } = Dimensions.get("window");

interface AnalysisData {
  diet: "bulking" | "cutting" | "maintaining" | "";
  weight: string;
  height: string;
  language: string;
}

interface Exercise {
  id: string;
  name: string;
  mainGroup: string;
  primaryMuscle: string;
}

interface WorkoutHistoryItem {
  id: string;
  date: string;
  workoutId: string;
  exercises: {
    [key: string]: { reps: string; weight: string }[];
  };
}

const dietOptions = [
  { name: "Muskelaufbau (Bulk)", value: "bulking" },
  { name: "Abnehmen (Cut)", value: "cutting" },
  { name: "Gewicht halten", value: "maintaining" },
] as const;

export const WorkoutAnalysisSheet = (
  props: SheetProps<"workout-analysis-sheet">
) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    diet: "",
    weight: "",
    height: "",
    language: "english",
  });
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseNames, setExerciseNames] = useState<{
    [key: string]: Exercise;
  }>({});

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

  const analyzeWorkouts = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user logged in");
      }

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

📈 Progress Charts (if applicable): (Suggest visual representations like bar charts for muscle group balance, line charts for strength progression, etc.)

Tone & Style:

Keep the language motivational and constructive
Use emoji icons to make it engaging (optional)
Be brief but informative
        
Personal Information:
- Nutrition: ${analysisData.diet}
- Weight: ${analysisData.weight}kg
- Size: ${analysisData.height}cm
        
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
            diet: analysisData.diet,
            weight: analysisData.weight,
            height: analysisData.height,
            analyzedWorkouts: formattedWorkoutHistory,
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

  const openDietSelector = () => {
    SheetManager.show("diet-selector-sheet", {
      payload: {
        selectedDiet: analysisData.diet,
        onSelect: (diet: AnalysisData["diet"]) => {
          setAnalysisData((prev) => ({ ...prev, diet }));
        },
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ActionSheet
        containerStyle={styles.container}
        indicatorStyle={{ backgroundColor: "white" }}
      >
        <YStack space="$4" padding="$4">
          <Text style={styles.title}>Training Analyze</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Training Goal</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={openDietSelector}
            >
              <Text style={styles.selectButtonText}>
                {dietOptions.find((opt) => opt.value === analysisData.diet)
                  ?.name || "Choose your diet..."}
              </Text>
              <ChevronDown size={20} color="white" />
            </TouchableOpacity>
          </View>

          <XStack space="$4">
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={analysisData.weight}
                onChangeText={(text) =>
                  setAnalysisData((prev) => ({ ...prev, weight: text }))
                }
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={analysisData.height}
                onChangeText={(text) =>
                  setAnalysisData((prev) => ({ ...prev, height: text }))
                }
              />
            </View>
          </XStack>
          <View style={[styles.inputContainer]}>
            <Text style={styles.label}>Language</Text>
            <TextInput
              style={styles.input}
              keyboardType="default"
              placeholder="set a language"
              value={analysisData.language}
              onChangeText={(text) =>
                setAnalysisData((prev) => ({ ...prev, language: text }))
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
