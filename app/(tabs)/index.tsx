import { StyleSheet, Text } from "react-native";

import { IntervalManager } from "@/components/IntervalManager";
import { useState } from "react";

export default function HomeScreen() {
  const [selectedSet, setSelectedSet] = useState(null);

  return (
    <>
      {selectedSet ? (
        // Render your timer or workout screen here
        // <IntervalTimer set={selectedSet} onDone={() => setSelectedSet(null)} />
        <Text>Selected set: {selectedSet.name}</Text>
      ) : (
        <IntervalManager onSelectSet={setSelectedSet} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
