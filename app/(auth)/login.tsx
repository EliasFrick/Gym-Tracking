import { StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/database/Firebaseconfig"
import { IUserLoginCredentials } from "@/types/interfaces";


const LoginScreen = () => {
    const [userCredentials, setUserCredentials] = useState<IUserLoginCredentials>({
        email: '',
        password: '',
    });
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const router = useRouter()

    const handleInputChange = (name: string, value: string) => {
        setUserCredentials({
            ...userCredentials,
            [name]: value
        });
    };

    const tryLogin = async () => {
        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log("User Found: ", user)
                    router.replace("/")
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log("Error Code: ", errorCode, " ErrorMessage: ", errorMessage)
                });

            console.log("Email: ", userCredentials.email, ", Passwort: ", userCredentials.password)
        } catch (error) {
            console.log("Error: ", error)
        }
        
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#cd1f12', 'transparent']}
                style={styles.background}
            />
            <View style={styles.header}>
                <Text style={styles.title}>Gym Tracker</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.signInText}>Sign in to continue</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={userCredentials.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    secureTextEntry
                    autoCapitalize="none"
                    value={userCredentials.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                />
                <TouchableOpacity style={styles.button} onPress={tryLogin}>
                    <Text style={styles.buttonText}>SIGN IN</Text>
                </TouchableOpacity>
                <Link href={"/register"}>
                    {/* <TouchableOpacity onPress={() => console.log("Navigate To Register")}> */}
                    <Text style={styles.createAccountText}>Create Account</Text>
                    {/* </TouchableOpacity> */}
                </Link>
            </View>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
    },
    inputContainer: {
        width: '80%',
    },
    welcomeText: {
        fontSize: 24,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
    },
    signInText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#2d2d2d',
        padding: 15,
        borderRadius: 8,
        color: '#fff',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#cd1f12',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    createAccountText: {
        color: '#fff',
        textAlign: 'center',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '110%',
    },
});