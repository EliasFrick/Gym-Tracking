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
        setUser(null); // Kein Benutzer angemeldet
      }
      setLoading(false); // Authentifizierungsprüfung abgeschlossen
    });

    return unsubscribe; // Aufräumen, wenn der Effekt neu ausgeführt wird
  }, []);

  useEffect(() => {
    //if (loading) return; // Warten, bis die Authentifizierungsprüfung abgeschlossen ist

    if (user) {
      if (rootSegments !== "(app)") {
        router.replace("/"); // Benutzer zur App weiterleiten
      }
    } else {
      if (rootSegments !== "(auth)") {
        router.replace("/(auth)/login"); // Benutzer zur Login-Seite weiterleiten
      }
    }
  }, [user, loading, rootSegments]);

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
