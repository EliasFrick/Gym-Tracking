import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutProgress } from '@/types/interfaces';

export const StorageKeys = {
  WORKOUT_PROGRESS: 'workout_progress_',
};

export const saveWorkoutProgress = async (workoutId: string, data: any) => {
  try {
    await AsyncStorage.setItem(
      `${StorageKeys.WORKOUT_PROGRESS}${workoutId}`,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error('Error saving workout progress:', error);
  }
};

export const getWorkoutProgress = async (workoutId: string): Promise<WorkoutProgress | null> => {
  try {
    const data = await AsyncStorage.getItem(
      `${StorageKeys.WORKOUT_PROGRESS}${workoutId}`
    );
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting workout progress:', error);
    return null;
  }
};

export const removeWorkoutProgress = async (workoutId: string) => {
  try {
    await AsyncStorage.removeItem(`${StorageKeys.WORKOUT_PROGRESS}${workoutId}`);
  } catch (error) {
    console.error('Error removing workout progress:', error);
  }
}; 