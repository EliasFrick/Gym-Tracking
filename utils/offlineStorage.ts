import AsyncStorage from '@react-native-async-storage/async-storage';
import { firestoreDB, auth } from '@/database/Firebaseconfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import NetInfo from '@react-native-community/netinfo';

const STORAGE_KEYS = {
  DEFAULT_EXERCISES: 'offline_default_exercises',
  USER_EXERCISES: 'offline_user_exercises',
  WORKOUT_HISTORY: 'offline_workout_history',
  LAST_SYNC: 'last_sync_timestamp',
};

export async function syncData() {
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      console.log('No internet connection, skipping sync');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    // Sync DefaultExercises
    const defaultExercisesRef = collection(firestoreDB, 'DefaultExercises');
    const defaultExercisesSnap = await getDocs(defaultExercisesRef);
    const defaultExercises = defaultExercisesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    await AsyncStorage.setItem(
      STORAGE_KEYS.DEFAULT_EXERCISES,
      JSON.stringify(defaultExercises)
    );

    // Sync User Exercises
    const userExercisesRef = collection(firestoreDB, 'User', user.uid, 'Exercises');
    const userExercisesSnap = await getDocs(userExercisesRef);
    const userExercises = userExercisesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_EXERCISES,
      JSON.stringify(userExercises)
    );

    // Sync Workout History
    const historyRef = collection(firestoreDB, 'User', user.uid, 'WorkoutHistory');
    const historyQuery = query(historyRef, orderBy('date', 'desc'));
    const historySnap = await getDocs(historyQuery);
    const workoutHistory = historySnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    await AsyncStorage.setItem(
      STORAGE_KEYS.WORKOUT_HISTORY,
      JSON.stringify(workoutHistory)
    );

    // Update last sync timestamp
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_SYNC,
      new Date().toISOString()
    );

    console.log('Data sync completed');
  } catch (error) {
    console.error('Error syncing data:', error);
  }
}

export async function getOfflineExerciseName(exerciseId: string): Promise<string> {
  try {
    // Check DefaultExercises
    const defaultExercisesStr = await AsyncStorage.getItem(STORAGE_KEYS.DEFAULT_EXERCISES);
    if (defaultExercisesStr) {
      const defaultExercises = JSON.parse(defaultExercisesStr);
      const defaultExercise = defaultExercises.find(
        (e: any) => e.id === exerciseId
      );
      if (defaultExercise) return defaultExercise.name;
    }

    // Check User Exercises
    const userExercisesStr = await AsyncStorage.getItem(STORAGE_KEYS.USER_EXERCISES);
    if (userExercisesStr) {
      const userExercises = JSON.parse(userExercisesStr);
      const userExercise = userExercises.find(
        (e: any) => e.id === exerciseId
      );
      if (userExercise) return userExercise.name;
    }

    return 'name not found';
  } catch (error) {
    console.error('Error getting offline exercise name:', error);
    return 'name not found';
  }
}

export async function getOfflineWorkoutHistory() {
  try {
    const historyStr = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
    return historyStr ? JSON.parse(historyStr) : [];
  } catch (error) {
    console.error('Error getting offline workout history:', error);
    return [];
  }
} 