import {StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions} from "react-native";
import React, {useEffect, useState} from "react";
import {LinearGradient} from 'expo-linear-gradient';


const LoginScreen = () => {
    const [userCredentials, setUserCredentials] = useState({
        email: '',
        password: '',
    });
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    
    const handleInputChange = (name: string, value: string) => {
        setUserCredentials({
            ...userCredentials,
            [name]: value
        });
    };

    const tryLogin = () => {
        console.log("Email: ", userCredentials.email, ", Passwort: ", userCredentials.password)
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
                <TouchableOpacity onPress={() => console.log("Navigate To Register")}>
                    <Text style={styles.createAccountText}>Create Account</Text>
                </TouchableOpacity>
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