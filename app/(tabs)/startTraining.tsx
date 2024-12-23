import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import FeatherIcons from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Plus,
} from "@tamagui/lucide-icons";
import type { PopoverProps } from "tamagui";
import {
  Adapt,
  Button,
  Input,
  isWeb,
  Label,
  Popover,
  XStack,
  YStack,
} from "tamagui";
import { AddDropOver } from "@/components/ui/AddDropOver";

export default function StartTrainingScreen() {
  const navigation = useNavigation();
  const [shouldAdapt, setShouldAdapt] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const translateY = new Animated.Value(0);

  const newIcons = [
    {
      id: "1",
      name: "plus",
      description: "Create own plan",
      onPress: () => addCustomPlan(),
    },
    {
      id: "2",
      name: "archive",
      description: "Choose a template",
      onPress: () => addCustomPlan(),
    },
    {
      id: "3",
      name: "robot",
      description: "Create plan with AI",
      onPress: () => addCustomPlan(),
    },
  ];

  const toggleIcons = () => {
    setIsOpen((prev) => !prev);

    Animated.timing(translateY, {
      toValue: isOpen ? 0 : 100,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Start Training",
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
          <AddDropOver />
        </View>
      ),
      headerStyle: {
        backgroundColor: "#F86E51",
      },
      headerTintColor: "#fff",
    });
  }, [navigation, isOpen]);

  const addCustomPlan = () => {
    console.log("Test");
  };

  return (
    <View style={styles.container}>
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
