import { registerSheet } from "react-native-actions-sheet";
import { AddWorkoutActionSheet } from "../ui/CreateTrainingsplan/AddWorkoutActionSheet";
import { AddExerciseActionSheet } from "../ui/CreateTrainingsplan/AddExerciseActionSheet";
import { PickExercisActionSheet } from "../ui/CreateTrainingsplan/AddWorkout/PickExerciseActionSheet";
import { IPickedExercises, WorkoutExercise } from "@/types/interfaces";
import { WorkoutExerciseSheet } from "../ui/WorkoutExerciseSheet";
import { WorkoutAnalysisSheet } from "../ui/WorkoutAnalysisSheet";
import { DietSelectorSheet } from "../ui/DietSelectorSheet";
import { MsucleGroupSelectorSheet } from "../ui/MuslceGroupSelectorSheet";

registerSheet("add-workout-modal-sheet", AddWorkoutActionSheet);
registerSheet("add-exercise-modal-sheet", AddExerciseActionSheet);
registerSheet("add-exercise-for-Workout-modal-sheet", PickExercisActionSheet);
registerSheet("workout-exercise-sheet", WorkoutExerciseSheet);
registerSheet("workout-analysis-sheet", WorkoutAnalysisSheet);
registerSheet("diet-selector-sheet", DietSelectorSheet);
registerSheet("muscle-group-selector-sheet", MsucleGroupSelectorSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
  interface Sheets {
    "add-exercise-modal-sheet": {
      payload?: any;
      returnValue?: any;
    };
    "add-workout-modal-sheet": {
      payload?: any;
      returnValue?: any;
    };
    "add-exercise-for-Workout-modal-sheet": {
      payload: {
        pickedExercises: IPickedExercises[] | undefined;
        setPickedExercises: React.Dispatch<
          React.SetStateAction<IPickedExercises[] | undefined>
        >;
      };
      returnValue?: any;
    };
    "workout-exercise-sheet": {
      payload: {
        workoutId: string;
        currentWorkout: WorkoutExercise[];
      };
      returnValue?: any;
    };
    "workout-analysis-sheet": {
      payload: {
        workoutHistory: any[];
      };
      returnValue?: any;
    };
    "diet-selector-sheet": {
      payload: {
        selectedDiet: string;
        onSelect: (diet: string) => void;
      };
    };
    "muscle-group-selector-sheet": {
      payload: {
        selectedMuscleGroup: string;
        onSelect: (muscleGroup: string) => void;
      };
    };
  }
}

export {};
