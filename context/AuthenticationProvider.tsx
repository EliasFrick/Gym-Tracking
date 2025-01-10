import {
  IUser,
  IUserLoginCredentials,
  IUserRegisterCredentials,
} from "@/types/interfaces";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
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

export function AuthenticationProvider({ children }: React.PropsWithChildren) {
  const rootSegments = useSegments()[0];
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser((prevUser: any) => ({
          ...prevUser,
          uId: firebaseUser.uid,
          email: firebaseUser.email,
        }));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;

    if (user) {
      if (rootSegments !== "(app)") {
        router.replace("/");
      }
    } else {
      if (rootSegments !== "(auth)") {
        router.replace("/(auth)/login");
      }
    }
  }, [user, loading, rootSegments]);

  if (loading) {
    return <LoadingScreen />;
  }

  function LoadingScreen() {
    return (
      <View style={styles.container}>
        <Image
          source={require("@/assets/Logo Design Preview.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <AuthenticationContext.Provider
      value={{
        user: user,
      }}
    >
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
