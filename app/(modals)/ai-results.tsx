import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Text, Card } from "tamagui";
import { Stack, useRouter } from "expo-router";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { auth, firestoreDB } from "@/database/Firebaseconfig";
import { AntDesign } from "@expo/vector-icons";
import { LineGraph } from "react-native-graph";
const { width } = Dimensions.get("window");

interface AIResult {
  id: string;
  analysis: string;
  timestamp: {
    toDate: () => Date;
  };
  workoutData: {
    diet: string;
    weight: string;
    height: string;
    analyzedWorkouts: any[];
  };
}

export default function AIResultsScreen() {
  const [results, setResults] = useState<AIResult[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAIResults();
  }, []);

  const fetchAIResults = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const resultsRef = collection(firestoreDB, "User", user.uid, "AIResult");
      const q = query(resultsRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);

      const aiResults: AIResult[] = [];
      querySnapshot.forEach((doc) => {
        aiResults.push({
          id: doc.id,
          ...doc.data(),
        } as AIResult);
      });

      setResults(aiResults);
    } catch (error) {
      console.error("Error fetching AI results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.push("/(tabs)/profile");
  };

  const testData = [
    {
      value: 1,
      date: new Date("2024-01-01"),
    },
    {
      value: 20,
      date: new Date("2024-01-02"),
    },
    {
      value: 40,
      date: new Date("2024-01-03"),
    },
    {
      value: 50,
      date: new Date("2024-01-04"),
    },
    {
      value: 200,
      date: new Date("2024-01-05"),
    },
    {
      value: 120,
      date: new Date("2024-01-06"),
    },
  ];

  const renderResultCard = (result: AIResult) => {
    const graphPoints = result.workoutData.analyzedWorkouts.map(
      (workout, index) => ({
        date: new Date(workout.date),
        value: parseFloat(workout.weight) || 0,
      })
    );

    return (
      <Card
        key={result.id}
        elevate
        size="$4"
        animation="bouncy"
        width={width * 0.9}
        scale={0.9}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
        margin={10}
        backgroundColor="#242424"
      >
        <Card.Header padded>
          <Text color="white" fontSize={16} fontWeight="bold">
            Analysis from {result.timestamp.toDate().toLocaleDateString()}
          </Text>
          {graphPoints.length > 0 && (
            <LineGraph
              points={testData}
              color="#4484B2"
              animated={false}
              style={{ height: 200 }}
            />
          )}
          <Text color="#888" fontSize={14} marginTop={5}>
            Weight: {result.workoutData.weight}kg • Height:{" "}
            {result.workoutData.height}cm
          </Text>
          <Text color="#888" fontSize={14}>
            Diet: {result.workoutData.diet}
          </Text>
        </Card.Header>
        <Card.Footer padded>
          <Text color="white" fontSize={14} lineHeight={20}>
            {result.analysis}
          </Text>
        </Card.Footer>
      </Card>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "AI Analyses",
          headerStyle: {
            backgroundColor: "#1A1A1A",
          },
          headerTintColor: "white",
          presentation: "modal",
          headerLeft: () => (
            <AntDesign
              name="close"
              size={24}
              color="white"
              style={{ marginLeft: 10 }}
              onPress={handleClose}
            />
          ),
        }}
      />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F86E51" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {results.length > 0 ? (
              results.map((result) => renderResultCard(result))
            ) : (
              <Text
                color="white"
                fontSize={16}
                textAlign="center"
                marginTop={20}
              >
                No AI analyses yet
              </Text>
            )}
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
