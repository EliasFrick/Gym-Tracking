import { collection, doc, getDocs } from "firebase/firestore";
import { firestoreDB, getAuth } from "./Firebaseconfig";

export const fetchUserWorkouts = async () => {
  try {
    const auth = getAuth();

    const firebaseUser = auth.currentUser;

    const usersCollection = collection(firestoreDB, "User");
    const userRef = doc(usersCollection, firebaseUser?.uid);
    const workoutRef = collection(userRef, "Workouts");

    // Alle Dokumente in der "Workouts"-Sammlung des Benutzers abrufen
    const querySnapshot = await getDocs(workoutRef);

    // Daten der Workouts in ein Array umwandeln
    const workouts = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Dokument-ID
      ...doc.data(), // Dokument-Daten
    }));

    return workouts; // Gibt die Workouts zurück (falls benötigt)
  } catch (error) {
    console.error("Error fetching workouts: ", error);
  }
};
