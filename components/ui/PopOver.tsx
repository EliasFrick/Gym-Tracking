// PlusPopover.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Popover from "react-native-popover-view";
import { Placement } from "react-native-popover-view/dist/Types";

const PlusPopover = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Popover
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        from={(ref) => (
          <TouchableOpacity
            onPress={() => setIsVisible(true)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        )}
        placement={Placement.BOTTOM} // PopOver-Inhalt wird unter dem Element angezeigt
      >
        <View style={styles.popoverContent}>
          <Text style={styles.popoverText}>Dies ist der PopOver-Inhalt!</Text>
        </View>
      </Popover>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  popoverContent: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
  },
  popoverText: {
    fontSize: 16,
    color: "black",
  },
});

export default PlusPopover;
