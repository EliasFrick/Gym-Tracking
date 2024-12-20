import React, { useState, useLayoutEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import FeatherIcons from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function StartTrainingScreen() {
  const navigation = useNavigation(); // Zugriff auf die Navigation

  // State für die Animation und das Anzeigen der neuen Icons
  const [isOpen, setIsOpen] = useState(false);
  const translateY = new Animated.Value(0); // Initiale Position für die Animation

  // Neue Optionen, die erscheinen sollen
  const newIcons = [
    { id: "1", name: "plus", description: "Create own plan", onPress: () => addCustomPlan() },
    { id: "2", name: "archive", description: "Choose a template", onPress: () => addCustomPlan()  },
    { id: "3", name: "robot", description: "Create plan with AI",  onPress: () => addCustomPlan()  },
  ];

  // Animation starten, um die Icons nach unten zu bewegen
  const toggleIcons = () => {
    setIsOpen((prev) => !prev);

    Animated.timing(translateY, {
      toValue: isOpen ? 0 : 100, // Wenn geöffnet, bringe die Icons nach unten
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Setze den Header mit Icon
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Start Training",
      headerRight: () => (
        <TouchableOpacity
          onPress={toggleIcons} // Toggle die Icons bei Klick
          style={styles.headerIconContainer}
        >
          <FeatherIcons name="plus" size={32} color="#fff" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#F86E51",
      },
      headerTintColor: "#fff", // Farbe des Titels und Icons
    });
  }, [navigation, isOpen]);

  const addCustomPlan = () => {
    console.log("Test")
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { transform: [{ translateY }] }]}>
        {isOpen &&
          newIcons.map((icon) => (
            <TouchableOpacity key={icon.id} style={styles.iconItemContainer} onPress={icon.onPress}>
              <Text style={styles.iconDescription}>{icon.description}</Text>
              <View style={styles.iconButtonContainer}>
                <FontAwesome5 name={icon.name} size={32} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
      </Animated.View>

      <Text style={styles.emptyText}>Create a Workout Routine before</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F86E51",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    top: "3%", // Positioniere die neuen Icons unterhalb des Headers
    left: "42%", // Zentriert den Container horizontal
    transform: [{ translateX: -35 }], // Korrigiere, damit es genau in der Mitte ist
    alignItems: "center", // Zentriert die Icons innerhalb des Containers
  },
  iconItemContainer: {
    flexDirection: "row", // Stellt sicher, dass Text und Icon nebeneinander stehen
    alignItems: "center", // Vertikale Zentrierung der Elemente
    marginBottom: 15, // Abstand zwischen den Icons
  },
  iconDescription: {
    color: "#fff",
    marginRight: 10, // Abstand zwischen Text und Icon
    fontSize: 17,
    fontWeight: "600",
    width: 150, // Feste Breite für die Beschreibung
    textAlign: "right", // Text rechts ausrichten
  },
  iconButtonContainer: {
    backgroundColor: "#cd1f12", // Roter Hintergrund
    padding: 15,
    width: 70,
    height: 70,
    borderRadius: 100, // Runde Form
    justifyContent: "center",
    alignItems: "center", // Zentriert das Icon im Button
  },
  headerIconContainer: {
    marginRight: 15,
  },
  emptyText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});
