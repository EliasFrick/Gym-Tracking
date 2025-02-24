import React, { createContext, ReactNode, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { IUserProvider } from "@/types/interfaces";
import { auth, firestoreDB } from "@/database/Firebaseconfig";

// Define the context type
interface UserContextType {
  userData: IUserProvider | null;
  loading: boolean;
  error: string | null;
  refreshUserData: () => Promise<void>;
}

// Create the context
export const UserContext = createContext<UserContextType>({
  userData: null,
  loading: true,
  error: null,
  refreshUserData: async () => {},
});

interface UserProviderProps {
  children: ReactNode;
  userId: string; // The ID of the current user
}

export function UserProvider({ children }: React.PropsWithChildren) {
  const [userData, setUserData] = useState<IUserProvider | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const user = auth.currentUser;
  if (!user) return;

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userDocRef = doc(firestoreDB, "User", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data() as IUserProvider);
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    if (user.uid) {
      fetchUserData();
    }
  }, [user.uid]);

  // Function to manually refresh user data
  const refreshUserData = async () => {
    await fetchUserData();
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        loading,
        error,
        refreshUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for using the user context
export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
