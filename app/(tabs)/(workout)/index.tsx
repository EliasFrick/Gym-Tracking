import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ExerciseCard from "@/components/ui/ExerciseCard";
import { ScrollView, XStack } from "tamagui";
import { IExerciseCard } from "@/types/interfaces";
import { fetchUserWorkouts } from "@/database/fetchWorkouts";
import { AppConfigContext } from "@/context/AppConfigProvider";
import { TamaguiPopOver } from "@/components/ui/TamaguiPopOver";
import { scale } from "react-native-size-matters";
import { firestoreDB, auth } from "@/database/Firebaseconfig";
import { getLocalWorkouts, syncWorkouts } from "../../../utils/localWorkouts";
import { useFocusEffect } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function indexScreen() {
  const [workout, setWorkout] = useState<IExerciseCard[]>();
  const navigation = useNavigation();
  const user = auth.currentUser;
  const { isOnline, syncDataNow } = useContext(AppConfigContext);
  const [refreshing, setRefreshing] = useState(false);

  // Neuen Zustand für den Popover hinzufügen:
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Workouts beim Laden der Komponente abrufen
  useEffect(() => {
    loadWorkouts();
  }, [user, isOnline]);

  const loadWorkouts = async () => {
    try {
      // Erst lokale Workouts laden
      const localWorkouts = await getLocalWorkouts();
      setWorkout(localWorkouts);

      // Wenn online, dann mit Server synchronisieren
      if (user && isOnline) {
        const serverWorkouts = await fetchUserWorkouts();
        await syncWorkouts(serverWorkouts);
        setWorkout(serverWorkouts);
        await syncDataNow();
      }
    } catch (error) {
      console.error("Fehler beim Laden der Workouts:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkouts();
    setRefreshing(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (isPopoverOpen) setIsPopoverOpen(false);
      }}
    >
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <XStack style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Start Training</Text>
          </XStack>
          <TouchableWithoutFeedback
            onPress={(e) => {
              e.stopPropagation();
            }}
          >
            <View style={styles.headerRight}>
              <TamaguiPopOver />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <FlatList 
          contentContainerStyle={styles.scrollViewContent}
          data={workout} 
          keyExtractor={(item, index) => index.toString()} 
          renderItem={({ item, index }) => (
            <ExerciseCard
              key={index}
              {...item}
              rotation={index % 2 === 0 ? "5deg" : "-5deg"}
            />
          )}
          ListEmptyComponent={
            // Komponente für leere Liste
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 18, color: "white" }}>
                Create your first workout
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "rgb(22, 22, 22)",
  },
  header: {
    height: height * 0.115,
    backgroundColor: "rgb(48, 48, 49)",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative", // Damit das absolute Positionieren des Popovers funktioniert
    paddingBottom: height * 0.015,
  },
  headerCenter: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: scale(18), // Skaliert die Schriftgröße
  },
  headerRight: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: height * 0.013,
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "rgb(22, 22, 22)",
  },
  scrollViewContent: {
    alignItems: "center",
    minHeight: height,
  },
});
