import AsyncStorage from '@react-native-async-storage/async-storage';
import { IExerciseCard } from '@/types/interfaces';

const WORKOUTS_KEY = 'user_workouts';

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