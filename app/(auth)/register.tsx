import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { IUser, IUserRegisterCredentials } from "@/types/interfaces";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "@/database/Firebaseconfig";
import { firestoreDB } from "@/database/Firebaseconfig";
import { doc, setDoc as firebaseSetDoc } from "firebase/firestore";
import { CustomDropDown } from "@/components/ui/CustomDropDown";
import { Button } from "react-native";
import DatePicker from "react-native-date-picker";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const RegisterScreen = () => {
  const [userCredentials, setUserCredentials] =
    useState<IUserRegisterCredentials>({
      firstname: "Elias",
      lastname: "Frick",
      email: "elias.frick.ef@gmail.com",
      password: "TestTest",
      passwordConfirm: "TestTest",
      birthDate: "",
      userName: "DuracellHase",
    });
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date()); // Zustand für das Datum
  const [showPicker, setShowPicker] = useState(false); // Zustand für die Sichtbarkeit des Pickers

  const handleDateChange = (event: any, date: any) => {
    setShowPicker(false);
    if (date) {
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      handleInputChange("birthDate", utcDate);
      setSelectedDate(utcDate); // UTC-Datum speichern
      console.log(utcDate);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setUserCredentials({
      ...userCredentials,
      [name]: value,
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

    if (userCredentials.userName === "") {
      alert("Enter a username");
      return;
    }

    if (
      userCredentials.password === "" ||
      userCredentials.password !== userCredentials.passwordConfirm
    ) {
      alert("Passworts are not the same");
    } else {
      try {
        const auth = getAuth(app);
        await createUserWithEmailAndPassword(
          auth,
          userCredentials.email,
          userCredentials.password
        )
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            saveUserInformations(user.uid, {
              email: userCredentials.email,
              firstname: userCredentials.firstname,
              lastname: userCredentials.lastname,
              uId: user.uid,
              birthDate: userCredentials.birthDate,
              userName: userCredentials.userName,
            });
            router.replace("/");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(
              "Error Code: ",
              errorCode,
              " Error Message: ",
              errorMessage
            );
            alert(errorMessage.substring(9));
            // ..
          });
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };

  async function setDoc(docRef: any, data: any) {
    try {
      await firebaseSetDoc(docRef, data);
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  const saveUserInformations = async (uid: string, user: IUser) => {
    try {
      await setDoc(doc(firestoreDB, "User", uid), user);
      alert("Successfull saved");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error while saving exercise");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient
        colors={["#cd1f12", "transparent"]}
        style={styles.background}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
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
            onChangeText={(text) => handleInputChange("firstname", text)}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Lastname"
            placeholderTextColor="#666"
            autoCapitalize="none"
            value={userCredentials.lastname}
            onChangeText={(text) => handleInputChange("lastname", text)}
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
          onChangeText={(text) => handleInputChange("email", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#666"
          autoCapitalize="none"
          value={userCredentials.userName}
          onChangeText={(text) => handleInputChange("userName", text)}
        />
        <View style={styles.datePicker}>
          <RNDateTimePicker
            mode="date"
            value={selectedDate}
            maximumDate={new Date()}
            onChange={handleDateChange} // Handler für Änderungen
          />
        </View>
        {showPicker && (
          <RNDateTimePicker
            mode="date"
            value={selectedDate}
            maximumDate={new Date()}
            onChange={handleDateChange} // Datum aktualisieren
          />
        )}
        {/* Password & Confirm Password */}
        <View style={styles.rowContainer}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            autoCapitalize="none"
            value={userCredentials.password}
            onChangeText={(text) => handleInputChange("password", text)}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Confirm Password"
            placeholderTextColor="#666"
            secureTextEntry
            autoCapitalize="none"
            value={userCredentials.passwordConfirm}
            onChangeText={(text) => handleInputChange("passwordConfirm", text)}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={tryRegister}>
          <Text style={styles.buttonText}>SIGN IN</Text>
        </TouchableOpacity>
        {/* Navigation Link */}
        <Link href="/login">
          <Text style={styles.linkText}>Back to login</Text>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  input: {
    backgroundColor: "#2d2d2d",
    padding: 15,
    borderRadius: 8,
    color: "#fff",
    marginBottom: 15,
    width: "100%",
  },
  halfInput: {
    width: "48%",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "110%",
  },
  linkText: {
    color: "#fff",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#cd1f12",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  datePicker: {
    backgroundColor: "#2d2d2d",
    padding: 15,
    borderRadius: 8,
    color: "#fff",
    marginBottom: 15,
    width: "100%",
  },
});
