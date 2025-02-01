import {
  IUser,
  IUserLoginCredentials,
  IUserRegisterCredentials,
} from "@/types/interfaces";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useState, useMemo, memo } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/database/Firebaseconfig";
import { View, Text, Image, StyleSheet } from "react-native";

const AuthenticationContext = React.createContext<any>(null);

export function useAuth() {
  return React.useContext(AuthenticationContext);
}

// Optimiere LoadingScreen mit memo
const LoadingScreen = memo(() => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/Logo Design Preview.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
});

export function AuthenticationProvider({ children }: React.PropsWithChildren) {
  const rootSegments = useSegments()[0];
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>();
  const [loading, setLoading] = useState(true);

  // Memoize den Context-Wert
  const contextValue = useMemo(
    () => ({
      user: user,
    }),
    [user]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser((prevUser: any) => {
          // Vermeide unnötige State-Updates
          if (prevUser?.uId === firebaseUser.uid) return prevUser;
          return {
            ...prevUser,
            uId: firebaseUser.uid,
            email: firebaseUser.email,
          };
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;

    if (user && rootSegments !== "(app)") {
      router.replace("/");
    } else if (!user && rootSegments !== "(auth)") {
      router.replace("/(auth)/login");
    }
  }, [user, loading, rootSegments]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Optional: Hintergrundfarbe
  },
  image: {
    width: 150, // Breite des Bildes
    height: 150, // Höhe des Bildes
  },
});
