import React, { useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Text, Card } from "tamagui";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, firestoreDB } from "@/database/Firebaseconfig";
import { useRouter } from "expo-router";
import { getOfflineWorkoutHistory } from "@/utils/offlineStorage";
import { useAppConfig } from "@/context/AppConfigProvider";
import { Ionicons } from "@expo/vector-icons";
import { SheetManager } from "react-native-actions-sheet";
import { UserInfo, WorkoutHistoryItem } from "@/types/interfaces";
import { useUser } from "@/context/UserProvider";

const { width, height } = Dimensions.get("window");

export default function TabOneScreen() {
  const router = useRouter();
  const { isOnline } = useAppConfig();
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryItem[]>(
    []
  );
  const [refreshing, setRefreshing] = useState(false);
  const { userData, loading, error, refreshUserData } = useUser();

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

  useLayoutEffect(() => {
    fetchWorkoutHistory();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWorkoutHistory();
    setRefreshing(false);
  };

  const handleWorkoutPress = (workout: WorkoutHistoryItem) => {
    router.push({
      pathname: "/workout-details",
      params: {
        id: workout.id,
        date: workout.date,
        workoutId: workout.workoutId,
        exercises: encodeURIComponent(JSON.stringify(workout.exercises)),
      },
    });
  };

  const openAnalysisSheet = () => {
    SheetManager.show("workout-analysis-sheet", {
      payload: {
        workoutHistory: workoutHistory,
      },
    });
  };

  const renderWorkoutCard = ({ item }: { item: WorkoutHistoryItem }) => {
    const exerciseCount = Object.keys(item.exercises).length;
    const totalSets = Object.values(item.exercises).reduce(
      (acc, sets) => acc + sets.length,
      0
    );

    return (
      <Card
        elevate
        size="$4"
        animation="bouncy"
        width={width * 0.9}
        height={height * 0.15}
        scale={0.9}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
        margin={10}
        onPress={() => handleWorkoutPress(item)}
      >
        <Card.Header padded>
          <Text color="$color" fontSize={20} fontWeight="bold">
            {item.workoutId}
          </Text>
          <Text color="$color12" fontSize={14}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <Text color="$color12" fontSize={14}>
            {exerciseCount} Exercises • {totalSets} Sets
          </Text>
        </Card.Header>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {userData?.prime ? (
        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={openAnalysisSheet}
        >
          <Text style={styles.analyzeButtonText}>Analyze with AI</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}

      <FlatList
        data={workoutHistory}
        renderItem={renderWorkoutCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  listContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#242424",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  analyzeButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    margin: 16,
    alignItems: "center",
  },
  analyzeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
