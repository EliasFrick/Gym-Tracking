import { auth, firestoreDB } from "@/database/Firebaseconfig";
import { doc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { WorkoutHistoryItem } from "@/types/interfaces";
import { getOfflineWorkoutHistory } from "@/utils/offlineStorage";
import NetInfo from "@react-native-community/netinfo";

/**
 * Get the last workout data for a specific exercise
 * @param exerciseId The ID of the exercise to get last workout data for
 * @returns The last set data for the exercise (weight and reps) or null if no previous data exists
 */
export async function getLastWorkoutDataForExercise(exerciseId: string) {
  try {
    let workoutHistory: WorkoutHistoryItem[] = [];
    
    // Check if online
    const netInfo = await NetInfo.fetch();
    const isOnline = netInfo.isConnected && netInfo.isInternetReachable;
    
    if (isOnline) {
      const user = auth.currentUser;
      if (!user) return null;

      // Get workout history from Firestore
      const historyRef = collection(
        firestoreDB,
        "User",
        user.uid,
        "WorkoutHistory"
      );
      
      // Query for any workout that contains this exercise, ordered by date descending, limit to most recent
      const q = query(
        historyRef,
        orderBy("date", "desc"),
        limit(10) // Get the 10 most recent workouts to search through
      );
      
      const querySnapshot = await getDocs(q);
      
      // Convert to WorkoutHistoryItem array
      querySnapshot.forEach((doc) => {
        workoutHistory.push({ id: doc.id, ...doc.data() } as WorkoutHistoryItem);
      });
    } else {
      // Get workout history from offline storage
      workoutHistory = await getOfflineWorkoutHistory();
    }
    
    // Find the most recent workout that contains this exercise
    for (const workout of workoutHistory) {
      if (workout.exercises && workout.exercises[exerciseId]) {
        const exerciseSets = workout.exercises[exerciseId];
        
        // Get the best set (highest weight with good reps)
        // First, filter sets with valid weight and reps
        const validSets = exerciseSets.filter(
          set => set.weight && set.weight !== "" && set.reps && set.reps !== ""
        );
        
        if (validSets.length === 0) continue;
        
        // Sort by weight (descending)
        validSets.sort((a, b) => {
          const weightA = parseFloat(a.weight.replace(',', '.'));
          const weightB = parseFloat(b.weight.replace(',', '.'));
          return weightB - weightA;
        });
        
        // Return the highest weight set
        return {
          weight: validSets[0].weight,
          reps: validSets[0].reps,
          date: new Date(workout.date).toLocaleDateString()
        };
      }
    }
    
    // No previous data found
    return null;
  } catch (error) {
    console.error("Error getting last workout data for exercise:", error);
    return null;
  }
}
