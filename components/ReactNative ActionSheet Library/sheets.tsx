import { registerSheet } from "react-native-actions-sheet";
import { AddWorkoutActionSheet } from "../ui/CreateTrainingsplan/AddWorkoutActionSheet";
import { AddExerciseActionSheet } from "../ui/CreateTrainingsplan/AddExerciseActionSheet";

registerSheet("add-workout-modal-sheet", AddWorkoutActionSheet);
registerSheet("add-exercise-modal-sheet", AddExerciseActionSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
  interface Sheets {
    "add-training-modal-sheet": {
      payload?: any;
      returnValue?: any;
    };
    "add-workout-modal-sheet": {
      payload?: any;
      returnValue?: any;
    };
    "add-exercise-modal-sheet": {
      payload?: any;
      returnValue?: any;
    };
  }
}

export {};
