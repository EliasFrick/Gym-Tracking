import React, { createContext, ReactNode, useState } from "react";
import {
  IAppplicationContextType,
} from "@/types/interfaces";

export const AppplicationContext = createContext<IAppplicationContextType>({
  currentWorkout: undefined,
  setCurrentWorkout: () => {},
});

interface ApplicationProviderProps {
  children: ReactNode;
}

interface WorkoutExercise {
  id: string;
  name: string;
  // Füge hier weitere Eigenschaften hinzu, die ein Exercise haben kann
}

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({
  children,
}) => {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutExercise[]>();

  return (
    <AppplicationContext.Provider
      value={{
        currentWorkout,
        setCurrentWorkout,
      }}
    >
      {children}
    </AppplicationContext.Provider>
  );
};
