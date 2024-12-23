import { IUser, IUserLoginCredentials, IUserRegisterCredentials } from "@/types/interfaces";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const AuthenticationContext = React.createContext<any>(null)

export function useAuth() {
    return React.useContext(AuthenticationContext)
}

export function AuthenticationProvider({ children }: React.PropsWithChildren) {
    const rootSegments = useSegments()[0]
    const router = useRouter()
    const [user, setUser] = useState<IUser>()
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser((prevUser: any) => ({
                    ...prevUser,
                    uId: user.uid,
                    email: user.email
                }));
            }
        });
    }, [])


    useEffect(() => {
        if (loading) return; // Warten, bis die Authentifizierungsprüfung abgeschlossen ist

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
                user: user
            }}
        >
            {children}
        </AuthenticationContext.Provider>
    )
}