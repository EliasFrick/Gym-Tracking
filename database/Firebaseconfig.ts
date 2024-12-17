// Import the functions you need from the SDKs you need
// ./services/firebase.js
import { initializeApp, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtK7UFLg5o8xs4Tb7kAWtGI48QR0sG5nc",
  authDomain: "gym-tracking-46835.firebaseapp.com",
  projectId: "gym-tracking-46835",
  storageBucket: "gym-tracking-46835.firebasestorage.app",
  messagingSenderId: "787781092622",
  appId: "1:787781092622:web:73a6da6e06ae178698835f",
  measurementId: "G-L8SJ0ZZJ6S"
};

// initialize Firebase App
const app = initializeApp(firebaseConfig);
// initialize Firebase Auth for that app immediately
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, auth, getApp, getAuth };
