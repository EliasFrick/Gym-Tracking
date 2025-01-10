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
  exerciseName: string;
  exerciseDescription: string;
  exerciseTargetMuscle: string;
  exerciseImage: string | null;
}

export interface ExerciseComponentProps {
  items: { name: string }[];
  exerciseTitle: string;
  setExerciseTitle: React.Dispatch<React.SetStateAction<string>>;
  bodyPart: string;
  setBodyPart: React.Dispatch<React.SetStateAction<string>>;
  exerciseDescription: string;
  setExerciseDescription: React.Dispatch<React.SetStateAction<string>>;
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface IExerciseCard {
  title: string;
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
  acceptButtonTitle: string;
  rejectButtonTitle: string;
  setShowAlertDialog?: React.Dispatch<React.SetStateAction<boolean>>;
  showAlertDialog?: boolean;
}

export interface IEditCardPopover {
  title: string;
  lastTrained: string | undefined;
  exercisesInPlan: string[] | undefined;
}

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  uId: string;
  userName: string;
  birthDate: string;
}

export interface IAddTrainingModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  position: number;
  setPosition: React.Dispatch<React.SetStateAction<number>>;
  items: { name: string }[];
  addExercise?: boolean;
  addWorkout?: boolean;
}
