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
        if (user?.uId === undefined) {
            console.log("undefined")
            router.replace("/(auth)/login")
            return;
        }

        if (!user && rootSegments !== "(auth)") {
            console.log("Login")
            router.replace("/(auth)/login")
        } else if (user && rootSegments !== "(app)") {
            console.log("App")
            router.replace("/")
        }
    }, [user])

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