import { StyleSheet, Text, View, Button } from "react-native";
import { getAuth, signOut } from "firebase/auth";

export default function TabTwoScreen() {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;

  const logout = async () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{firebaseUser?.uid}</Text>

      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(22, 22, 22)",
  },
  text: {
    color: "white",
  },
});
