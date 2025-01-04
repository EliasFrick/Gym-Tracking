import React, { useState, useLayoutEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "tamagui";
import { Activity, Airplay } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { PopOverAddExercises } from "@/components/ui/PopOverAddExercises";

const { width, height } = Dimensions.get("window");

export default function indexScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const navigateToCreateOwnPlan = () => {
    router.navigate("/createOwnPlan");
  };

  return <View style={styles.container}></View>;
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
    color: "black",
    fontWeight: "600",
  },
});
