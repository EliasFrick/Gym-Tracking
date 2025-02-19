import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text, Card } from "tamagui";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { auth, firestoreDB } from "@/database/Firebaseconfig";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

interface AIResult {
  id: string;
  analysis: string;
  timestamp: Date;
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
        const data = doc.data();
        aiResults.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate(),
        } as AIResult);
      });

      setResults(aiResults);
    } catch (error) {
      console.error("Error fetching AI results:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderResultCard = (result: AIResult) => (
    <Card
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
          Analysis from {result.timestamp.toLocaleDateString()}
        </Text>
        <Text color="#888" fontSize={14} marginTop={5}>
          Weight: {result.workoutData.weight}kg • Height: {result.workoutData.height}cm
        </Text>
        <Text color="#888" fontSize={14}>
          Diet: {result.workoutData.diet}
        </Text>
      </Card.Header>
      <Card.Footer padded>
        <Text color="white" fontSize={14} numberOfLines={3}>
          {result.analysis}
        </Text>
      </Card.Footer>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <Text color="white">Loading...</Text>
        ) : results.length > 0 ? (
          results.map((result) => renderResultCard(result))
        ) : (
          <Text color="white">No AI analyses yet</Text>
        )}
      </ScrollView>
    </View>
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
}); 