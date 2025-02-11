import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
} from "react-native";
import { Text, Card } from "tamagui";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { auth, firestoreDB } from "@/database/Firebaseconfig";
import { useRouter } from "expo-router";
import { getOfflineWorkoutHistory } from "@/utils/offlineStorage";
import { useAppConfig } from "@/context/AppConfigProvider";

const { width, height } = Dimensions.get("window");

interface WorkoutHistoryItem {
  id: string;
  date: string;
  workoutId: string;
  exercises: {
    [key: string]: { reps: string; weight: string }[];
  };
}

export default function TabOneScreen() {
  const router = useRouter();
  const { isOnline } = useAppConfig();
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryItem[]>(
    []
  );
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkoutHistory = async () => {
    try {
      if (isOnline) {
        const user = auth.currentUser;
        if (!user) return;

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

  useEffect(() => {
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
});
