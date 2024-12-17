import { IUserCredentials } from "@/types/interfaces";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";

const AuthenticationContext =  React.createContext<any>(null)

export function useAuth() {
    return React.useContext(AuthenticationContext )
}

export function AuthenticationProvider({children}:React.PropsWithChildren) {
    const rootSegments = useSegments()[0]
    const router = useRouter()
    const [user, setUser] = useState<IUserCredentials>()
    
    useEffect(() => {
        if (user === undefined) {
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
    }, [])

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