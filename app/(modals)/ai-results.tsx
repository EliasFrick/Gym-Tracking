import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Text, Card } from "tamagui";
import { Stack, useRouter } from "expo-router";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { auth, firestoreDB } from "@/database/Firebaseconfig";
import { AntDesign } from "@expo/vector-icons";
import { LineGraph } from "react-native-graph";

const { width, height } = Dimensions.get("window");

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
  const [selectedResult, setSelectedResult] = useState<AIResult | null>(null);
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

  const renderCompactCard = (result: AIResult) => (
    <TouchableOpacity key={result.id} onPress={() => setSelectedResult(result)}>
      <Card
        elevate
        size="$4"
        width={width * 0.9}
        margin={10}
        backgroundColor="#242424"
      >
        <Card.Header padded>
          <Text color="white" fontSize={16} fontWeight="bold">
            Analysis from {result.timestamp.toDate().toLocaleDateString()}
          </Text>
          <Text color="#888" fontSize={14} marginTop={5}>
            Weight: {result.workoutData.weight}kg • Height:{" "}
            {result.workoutData.height}cm
          </Text>
          <Text color="#888" fontSize={14}>
            Diet: {result.workoutData.diet}
          </Text>
        </Card.Header>
      </Card>
    </TouchableOpacity>
  );

  const renderDetailModal = () => (
    <Modal
      visible={!!selectedResult}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedResult(null)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedResult(null)}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
          {selectedResult && (
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalDate}>
                {selectedResult.timestamp.toDate().toLocaleDateString()}
              </Text>

              <LineGraph
                points={testData}
                color="#4484B2"
                animated={false}
                style={{ height: 200, marginVertical: 20 }}
              />

              <Text style={styles.modalStats}>
                Weight: {selectedResult.workoutData.weight}kg {"\n"}
                Height: {selectedResult.workoutData.height}cm {"\n"}
                Diet: {selectedResult.workoutData.diet}
              </Text>

              <Text style={styles.modalAnalysis}>
                {selectedResult.analysis}
              </Text>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

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
              onPress={() => {
                router.back();
              }}
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
              results.map(renderCompactCard)
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
        {renderDetailModal()}
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#242424",
    width: width * 0.9,
    height: height * 0.8,
    borderRadius: 20,
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  modalScroll: {
    flex: 1,
  },
  modalDate: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalStats: {
    color: "#888",
    fontSize: 16,
    marginVertical: 10,
    lineHeight: 24,
  },
  modalAnalysis: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
  },
});
