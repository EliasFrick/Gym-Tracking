import AsyncStorage from '@react-native-async-storage/async-storage';
import { IExerciseCard } from '@/types/interfaces';

const WORKOUTS_KEY = 'user_workouts';
const PENDING_WORKOUTS_KEY = 'pending_workouts';

export const getLocalWorkouts = async (): Promise<IExerciseCard[]> => {
  try {
    const workouts = await AsyncStorage.getItem(WORKOUTS_KEY);
    return workouts ? JSON.parse(workouts) : [];
  } catch (error) {
    console.error('Fehler beim Laden der lokalen Workouts:', error);
    return [];
  }
};

export const saveLocalWorkouts = async (workouts: IExerciseCard[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  } catch (error) {
    console.error('Fehler beim Speichern der lokalen Workouts:', error);
  }
};

export const syncWorkouts = async (serverWorkouts: IExerciseCard[]): Promise<void> => {
  await saveLocalWorkouts(serverWorkouts);
};

export const addWorkoutToQueue = async (workout: IExerciseCard) => {
  try {
    // Add to local workouts
    const currentWorkouts = await getLocalWorkouts();
    await saveLocalWorkouts([...currentWorkouts, workout]);

    // Add to pending queue
    const pendingWorkouts = await AsyncStorage.getItem(PENDING_WORKOUTS_KEY);
    const pendingQueue = pendingWorkouts ? JSON.parse(pendingWorkouts) : [];
    pendingQueue.push(workout);
    await AsyncStorage.setItem(PENDING_WORKOUTS_KEY, JSON.stringify(pendingQueue));
  } catch (error) {
    console.error("Error adding workout to queue:", error);
  }
};

export const processPendingWorkouts = async () => {
  try {
    const pendingWorkouts = await AsyncStorage.getItem(PENDING_WORKOUTS_KEY);
    if (!pendingWorkouts) return;

    const workouts = JSON.parse(pendingWorkouts);
    for (const workout of workouts) {
      // Here you would call your Firebase save function
      await saveWorkoutToFirebase(workout); // You need to implement this
    }

    // Clear pending queue after successful sync
    await AsyncStorage.setItem(PENDING_WORKOUTS_KEY, JSON.stringify([]));
  } catch (error) {
    console.error("Error processing pending workouts:", error);
  }
}; 