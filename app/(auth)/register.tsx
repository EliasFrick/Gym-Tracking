import { StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from "expo-router";
import { IUserRegisterCredentials } from "@/types/interfaces";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {app} from "@/database/Firebaseconfig"

const RegisterScreen = () => {
    const [userCredentials, setUserCredentials] = useState<IUserRegisterCredentials>({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });
    const router = useRouter()

    const handleInputChange = (name: string, value: string) => {
        setUserCredentials({
            ...userCredentials,
            [name]: value
        });
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    

    const tryRegister = async () => {
        if (!isValidEmail(userCredentials.email)) {
            alert("Please enter a valid email address");
            return;
        }
    
        if (userCredentials.password === "" || userCredentials.password !== userCredentials.passwordConfirm) {
            alert("Passworts are not the same")
        } else {
            console.log("Email: ", userCredentials.email, ", Passwort: ", userCredentials.password)
            try {
                const auth = getAuth(app);
                await createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
                .then((userCredential) => {
                        // Signed up 
                        const user = userCredential.user;
                        console.log("Signed In: ", user)
                        // ...
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log("Error Code: ", errorCode, " Error Message: ", errorMessage)
                        // ..
                    });
                    router.replace("/")
                } catch (error) {
                    console.log("Error: ", error)
                }
        }
    }



    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#cd1f12', 'transparent']}
                style={styles.background}
            />
            <View style={styles.header}>
                <Text style={styles.title}>Register</Text>
            </View>

            {/* Firstname & Lastname */}
            <View style={styles.rowContainer}>
                <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Firstname"
                    placeholderTextColor="#666"
                    autoCapitalize="none"
                    value={userCredentials.firstname}
                    onChangeText={(text) => handleInputChange('firstname', text)}
                />
                <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Lastname"
                    placeholderTextColor="#666"
                    autoCapitalize="none"
                    value={userCredentials.lastname}
                    onChangeText={(text) => handleInputChange('lastname', text)}
                />
            </View>

            {/* Email Address */}
            <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={userCredentials.email}
                onChangeText={(text) => handleInputChange('email', text)}
            />

            {/* Password & Confirm Password */}
            <View style={styles.rowContainer}>
                <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    secureTextEntry
                    autoCapitalize="none"
                    value={userCredentials.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                />
                <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Confirm Password"
                    placeholderTextColor="#666"
                    secureTextEntry
                    autoCapitalize="none"
                    value={userCredentials.passwordConfirm}
                    onChangeText={(text) => handleInputChange('passwordConfirm', text)}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={tryRegister}>
                <Text style={styles.buttonText}>SIGN IN</Text>
            </TouchableOpacity>
            {/* Navigation Link */}
            <Link href="/login">
                <Text style={styles.linkText}>Back to login</Text>
            </Link>
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    input: {
        backgroundColor: '#2d2d2d',
        padding: 15,
        borderRadius: 8,
        color: '#fff',
        marginBottom: 15,
        width: '100%',
    },
    halfInput: {
        width: '48%', // Halbe Breite für 2 Inputs nebeneinander
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '110%',
    },
    linkText: {
        color: '#fff',
        marginTop: 20,
        textDecorationLine: 'underline',
    },
    button: {
        backgroundColor: '#cd1f12',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
