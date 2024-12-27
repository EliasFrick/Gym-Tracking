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
  items: { name: string }[]; // Typdefinition für die Items
  exerciseTitle: string; // Aktueller Wert
  setExerciseTitle: React.Dispatch<React.SetStateAction<string>>; // Funktion zum Aktualisieren des Werts
  bodyPart: string; // Aktueller Wert
  setBodyPart: React.Dispatch<React.SetStateAction<string>>; // Funktion zum Aktualisieren des Werts
  exerciseDescription: string; // Aktueller Wert
  setExerciseDescription: React.Dispatch<React.SetStateAction<string>>; // Funktion zum Aktualisieren des Werts
  image: string | null; // Aktueller Wert
  setImage: React.Dispatch<React.SetStateAction<string | null>>; // Funktion zum Aktualisieren des Werts
}
