import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Text } from "tamagui";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  where,
} from "firebase/firestore";
import { auth, firestoreDB } from "@/database/Firebaseconfig";
import { LineGraph } from "react-native-graph";
import { scale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

interface WeightEntry {
  weight: number;
  date: Date;
}

export default function RankingScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ color: "white", fontSize: 30 }}>Is coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(48, 48, 49)",
    padding: 20,
  },
  contentContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#242424",
    padding: 15,
    borderRadius: 8,
    color: "white",
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#F86E51",
    padding: 15,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  graphContainer: {
    backgroundColor: "#242424",
    borderRadius: 12,
    padding: 15,
    height: 300,
    marginBottom: 20,
  },
  graph: {
    flex: 1,
  },
  historyContainer: {
    backgroundColor: "#242424",
    borderRadius: 12,
    padding: 15,
  },
  historyTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  historyWeight: {
    color: "white",
    fontSize: 16,
  },
  historyDate: {
    color: "#888",
    fontSize: 16,
  },
  noDataText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
});
