import { auth, firestoreDB } from "@/database/Firebaseconfig";
import { WeightEntry } from "@/types/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import WeightLineChart from "@/components/ui/WeightLineChart";
import { Button, Text, XStack } from "tamagui";

export default function WeightScreen() {
  const [currentWeight, setCurrentWeight] = useState("");
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [filteredData, setFilteredData] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // timeRange can be 'M' (1 month), '6M' (6 months), 'Y' (1 year), 'Max' (all data)
  const [timeRange, setTimeRange] = useState<"M" | "6M" | "Y" | "Max">("Max");

  // For displaying the currently “hovered” point when panning on the graph
  const [selectedWeight, setSelectedWeight] = useState<string>("");

  useEffect(() => {
    loadWeightHistory();
  }, []);

  useEffect(() => {
    filterData();
  }, [timeRange, weightHistory]);

  const loadWeightHistory = async () => {
    try {
      // Erst lokale Daten laden
      const localData = await AsyncStorage.getItem("weightHistory");
      if (localData) {
        const parsedData = JSON.parse(localData).map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        }));
        setWeightHistory(parsedData);
      }

      // Dann Online-Daten laden wenn verfügbar
      await fetchWeightHistory();
    } catch (error) {
      console.error("Error loading weight history:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeightHistory = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const weightsRef = collection(
        firestoreDB,
        "User",
        user.uid,
        "WeightHistory"
      );
      const q = query(weightsRef, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);

      const weights: WeightEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        weights.push({
          weight: data.weight,
          date: data.date.toDate(),
        });
      });

      setWeightHistory(weights);
      // Speichere die aktualisierten Daten im LocalStorage
      await AsyncStorage.setItem("weightHistory", JSON.stringify(weights));
    } catch (error) {
      console.error("Error fetching weight history:", error);
    }
  };

  const saveWeight = async () => {
    // Ersetze Komma durch Punkt und entferne Leerzeichen
    const formattedWeight = currentWeight.trim().replace(",", ".");
    if (!formattedWeight) return;

    try {
      const user = auth.currentUser;
      const weightNum = parseFloat(formattedWeight);
      if (isNaN(weightNum)) return;

      const newEntry: WeightEntry = {
        weight: weightNum,
        date: new Date(),
      };

      // Lokale Liste aktualisieren
      const updatedHistory = [newEntry, ...weightHistory];
      setWeightHistory(updatedHistory);
      await AsyncStorage.setItem(
        "weightHistory",
        JSON.stringify(updatedHistory)
      );

      // In Firestore speichern wenn online
      if (user) {
        const weightsRef = collection(
          firestoreDB,
          "User",
          user.uid,
          "WeightHistory"
        );
        await addDoc(weightsRef, {
          weight: weightNum,
          date: newEntry.date,
        });
      }

      setCurrentWeight("");
    } catch (error) {
      console.error("Error saving weight:", error);
    }
  };

  const deleteWeightEntry = async (entry: WeightEntry) => {
    try {
      // Bestätigungs-Dialog anzeigen
      Alert.alert(
        "Delete Entry",
        `Do you want to delete the weight entry from ${entry.date.toLocaleDateString()}?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              // Aus der lokalen Liste entfernen
              const updatedHistory = weightHistory.filter(
                (item) => item.date.getTime() !== entry.date.getTime()
              );
              setWeightHistory(updatedHistory);

              // LocalStorage aktualisieren
              await AsyncStorage.setItem(
                "weightHistory",
                JSON.stringify(updatedHistory)
              );

              // Aus Firestore löschen wenn online
              const user = auth.currentUser;
              if (user) {
                const weightsRef = collection(
                  firestoreDB,
                  "User",
                  user.uid,
                  "WeightHistory"
                );
                const q = query(weightsRef, where("date", "==", entry.date));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (doc) => {
                  await deleteDoc(doc.ref);
                });
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting weight entry:", error);
      Alert.alert("Error", "Failed to delete weight entry");
    }
  };

  /**
   * Filters the full weightHistory array based on the selected time range
   */
  const filterData = () => {
    const now = new Date().getTime();

    const filtered = (() => {
      switch (timeRange) {
        case "M": {
          const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
          return weightHistory.filter((e) => e.date.getTime() >= oneMonthAgo);
        }
        case "6M": {
          const sixMonthsAgo = now - 6 * 30 * 24 * 60 * 60 * 1000;
          return weightHistory.filter((e) => e.date.getTime() >= sixMonthsAgo);
        }
        case "Y": {
          const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;
          return weightHistory.filter((e) => e.date.getTime() >= oneYearAgo);
        }
        case "Max":
        default:
          return weightHistory;
      }
    })();

    setFilteredData(filtered);
  };

  /**
   * Sort ascending by date for the graph (oldest → newest),
   * then map to { value, date }
   */
  const prepareWeightDataForGraph = (data: WeightEntry[]) => {
    return data
      .slice()
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((entry) => ({
        value: entry.weight,
        date: entry.date,
      }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={currentWeight}
          onChangeText={setCurrentWeight}
          placeholder="Enter weight in kg"
          keyboardType="numeric"
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.addButton} onPress={saveWeight}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#F86E51" />
      ) : (
        <ScrollView style={styles.contentContainer}>
          {weightHistory.length > 0 ? (
            <>
              <View style={styles.graphContainer}>
                {/* Display selected weight on top of the graph */}
                <Text style={styles.selectedWeightText}>
                  {selectedWeight
                    ? `Selected: ${selectedWeight}`
                    : "Slide to see weight"}
                </Text>
                <View style={styles.graph}>
                  <WeightLineChart
                    data={prepareWeightDataForGraph(filteredData)}
                    color="#F86E51"
                    onPointSelected={(point) =>
                      setSelectedWeight(`${point.value.toFixed(1)} kg`)
                    }
                  />
                </View>

                <XStack
                  gap={20}
                  marginTop={10}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    color="white"
                    style={styles.filterButton}
                    onPress={() => setTimeRange("M")}
                  >
                    M
                  </Button>
                  <Button
                    color="white"
                    style={styles.filterButton}
                    onPress={() => setTimeRange("6M")}
                  >
                    6 M
                  </Button>
                  <Button
                    color="white"
                    style={styles.filterButton}
                    onPress={() => setTimeRange("Y")}
                  >
                    Y
                  </Button>
                  <Button
                    color="white"
                    style={styles.filterButton}
                    onPress={() => setTimeRange("Max")}
                  >
                    Max
                  </Button>
                </XStack>
              </View>

              <View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>Weight History</Text>
                {filteredData
                  .slice()
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((entry) => (
                    <TouchableOpacity
                      key={`${entry.date.getTime()}-${entry.weight}`}
                      style={styles.historyItem}
                      onLongPress={() => deleteWeightEntry(entry)}
                      delayLongPress={500}
                    >
                      <Text style={styles.historyWeight}>
                        {entry.weight} kg
                      </Text>
                      <Text style={styles.historyDate}>
                        {entry.date.toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </>
          ) : (
            <Text style={styles.noDataText}>No weight data yet</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
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
    height: 320,
    marginBottom: 20,
  },
  selectedWeightText: {
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    fontSize: 14,
  },
  graph: {
    flex: 1,
  },
  filterButton: {
    backgroundColor: "#333",
    borderColor: "#F86E51",
    borderWidth: 1,
    borderRadius: 8,
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
