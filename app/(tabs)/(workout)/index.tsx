import React, { useState, useLayoutEffect } from "react";
import { View, StyleSheet, Dimensions, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ExerciseCard } from "@/components/ui/ExerciseCard";
import { ScrollView } from "tamagui";
import { IExerciseCard } from "@/types/interfaces";
import { ToastDemo } from "@/components/ui/ToastMessage";

const { width, height } = Dimensions.get("window");

export default function indexScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const navigateToCreateOwnPlan = () => {
    router.navigate("/createOwnPlan");
  };

  const exampleExerciseCard: IExerciseCard[] = [
    {
      title: "Push",
      lastDone: "2022-01-01",
      rotation: "5deg",
      image: require("@/assets/Push.jpg"), // Relativer Pfad
    },
    {
      title: "Pull",
      lastDone: "2023-02-03",
      rotation: "-5deg",
      image: require("@/assets/Pull.jpg"), // Relativer Pfad
    },
    {
      title: "Leg",
      lastDone: "2023-02-03",
      rotation: "5deg",
      image: require("@/assets/Leg.jpeg"), // Relativer Pfad
    },
    {
      title: "Upper Body",
      lastDone: "2023-02-03",
      rotation: "-5deg",
      image: require("@/assets/Push.jpg"), // Relativer Pfad
    },
    {
      title: "Lower Body",
      lastDone: "2023-02-03",
      rotation: "5deg",
      image: require("@/assets/Push.jpg"), // Relativer Pfad
    },
    {
      title: "Lower Body",
      lastDone: "2023-02-03",
      rotation: "-5deg",
      image: require("@/assets/Push.jpg"), // Relativer Pfad
    },
    {
      title: "Lower Body",
      lastDone: "2023-02-03",
      rotation: "5deg",
      image: require("@/assets/Push.jpg"), // Relativer Pfad
    },
    {
      title: "Lower Body",
      lastDone: "2023-02-03",
      rotation: "-5deg",
      image: require("@/assets/Push.jpg"), // Relativer Pfad
      exercises: ["Squats", "Adduktoren"],
    },
  ];
  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent} // Zentriert den Inhalt
      style={styles.container}
    >
      <View>
        <Button title="Create own plan" onPress={showToast} />
      </View>
      {exampleExerciseCard.map((value, index) => (
        <ExerciseCard key={index} exerciseCard={value} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F86E51",
  },
  scrollViewContent: {
    alignItems: "center", // Zentriert die Items horizontal
    justifyContent: "center", // Optional, je nach Bedarf
  },
});
