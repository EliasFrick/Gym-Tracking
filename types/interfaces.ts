export interface IUserLoginCredentials {
  email: string;
  password: string;
}

export interface IUserRegisterCredentials {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  birthDate: string;
  userName: string;
}

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  uId: string;
}

export interface ICreateCustomExercise {
  userID: string;
  name: string;
  description: string;
  primaryMuscle: string[];
  mainGroup: string[] | null;
  image: string | null;
}

export interface IWorkoutInfrmations {
  name: string;
  description: string;
  primaryMuscle: string[];
  mainGroup: string[] | null;
  exercises: {} | null;
}

export interface ExerciseComponentProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
  informations: IPickedExercises[] | undefined;
  setInformations: React.Dispatch<
    React.SetStateAction<IPickedExercises[] | undefined>
  >;
}

export interface IExerciseCard {
  id: string;
  lastDone?: string;
  image?: string | { uri: string } | any;
  style?: any;
  rotation?: string;
}

export interface IEditPopover {
  title: string;
  description: string;
  label: string;
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  deleteButtonTitle: string;
  saveButtonTitle: string;
  showDeletePopover: boolean;
  setShowDeletePopover: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IAlertDialog {
  title: string;
  description: string;
  setShowAlertDialog?: React.Dispatch<React.SetStateAction<boolean>>;
  showAlertDialog?: boolean;
  open: boolean;
}

export interface IEditCardPopover {
  title: string;
  lastTrained: string | undefined;
  exercisesInPlan: string[] | undefined;
  showDeletePopover: boolean;
  setShowDeletePopover: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  uId: string;
  userName: string;
  birthDate: string;
}

export interface IAddedExercisePanel {
  title: string;
}

export interface IPickeExerciseModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /*   items: IExercisesToPicker[];
   */ pickedExercises: IPickedExercises[] | undefined;
  setPickedExercises: React.Dispatch<
    React.SetStateAction<IPickedExercises[] | undefined>
  >;
}

export interface IExercisesToPicker {
  title: string;
  workoutType: string;
  image?: string | null;
}

export interface IFetchDataFromFirestore {
  collectionName: string;
}

export interface IPickedExercises {
  id: string;
  name: string;
  primaryMuscle: string[];
  mainGroup: string[];
}

export interface IPickedExercisesDeleteList {
  id: string;
  name: string;
  primaryMuscle: string[];
  mainGroup: string[];
  pickedExercises: IPickedExercises[] | undefined;
  setPickedExercises: React.Dispatch<
    React.SetStateAction<IPickedExercises[] | undefined>
  >;
}

export interface IExerciseListProps {
  pickedExercises: IPickedExercises[] | undefined;
  setPickedExercises: React.Dispatch<
    React.SetStateAction<IPickedExercises[] | undefined>
  >;
  exercises?: any;
}

export interface IAppConfigContextType {
  isConnected: boolean | null;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean | null>>;
  refreshDatabase: number;
  triggerRefreshDatabase: () => void;
}

export interface IAppplicationContextType {
  currentWorkout: any[] | undefined;
  setCurrentWorkout: React.Dispatch<React.SetStateAction<any[] | undefined>>;
}

export interface IDeleteAlertDialog {
  title: string | null;
  description: string | null;
  acceptButtonText: string | null;
  cancelButtonText: string | null;
  showAlertDialog: boolean;
  setShowAlertDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IWorkoutInDatabase {
  id: string;
  name: string;
  description: string;
  workoutType: string;
  exercises: string[];
}

export interface WorkoutExercise {
  id: string;
  name: string;
  primaryMuscle?: string[];
  mainGroup?: string[];
}

export interface WorkoutProgress {
  workoutId: string;
  workoutLog: {
    [key: string]: { reps: string; weight: string }[];
  };
  currentExerciseIndex: number;
  lastUpdated: string;
}
