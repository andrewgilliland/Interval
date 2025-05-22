import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Interval {
  name: string;
  duration: number; // seconds
}

interface IntervalSet {
  id: string;
  name: string;
  intervals: Interval[];
}

export function IntervalManager({
  onSelectSet,
}: {
  onSelectSet: (set: IntervalSet) => void;
}) {
  const [sets, setSets] = useState<IntervalSet[]>([]);
  const [newSetName, setNewSetName] = useState("");
  const [newIntervalName, setNewIntervalName] = useState("");
  const [newIntervalDuration, setNewIntervalDuration] = useState("");
  const [editingSet, setEditingSet] = useState<IntervalSet | null>(null);
  const [intervals, setIntervals] = useState<Interval[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("intervalSets").then((data) => {
      if (data) setSets(JSON.parse(data));
    });
  }, []);

  const saveSets = async (newSets: IntervalSet[]) => {
    setSets(newSets);
    await AsyncStorage.setItem("intervalSets", JSON.stringify(newSets));
  };

  const addInterval = () => {
    if (!newIntervalName || !newIntervalDuration) return;
    setIntervals([
      ...intervals,
      { name: newIntervalName, duration: parseInt(newIntervalDuration) },
    ]);
    setNewIntervalName("");
    setNewIntervalDuration("");
  };

  const saveSet = () => {
    if (!newSetName || intervals.length === 0) return;
    const newSet: IntervalSet = {
      id: Date.now().toString(),
      name: newSetName,
      intervals,
    };
    const newSets = [...sets, newSet];
    saveSets(newSets);
    setNewSetName("");
    setIntervals([]);
  };

  const deleteSet = (id: string) => {
    const newSets = sets.filter((s) => s.id !== id);
    saveSets(newSets);
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
        Create Interval Set
      </Text>
      <TextInput
        placeholder="Set Name"
        value={newSetName}
        onChangeText={setNewSetName}
        style={{ borderWidth: 1, marginVertical: 4, padding: 4 }}
      />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          placeholder="Interval Name"
          value={newIntervalName}
          onChangeText={setNewIntervalName}
          style={{ borderWidth: 1, flex: 1, marginRight: 4, padding: 4 }}
        />
        <TextInput
          placeholder="Duration (s)"
          value={newIntervalDuration}
          onChangeText={setNewIntervalDuration}
          keyboardType="numeric"
          style={{ borderWidth: 1, width: 80, marginRight: 4, padding: 4 }}
        />
        <Button title="Add" onPress={addInterval} />
      </View>
      <FlatList
        data={intervals}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.name}: {item.duration}s
          </Text>
        )}
      />
      <Button title="Save Set" onPress={saveSet} />
      <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 16 }}>
        Saved Sets
      </Text>
      <FlatList
        data={sets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 4,
            }}
          >
            <TouchableOpacity
              onPress={() => onSelectSet(item)}
              style={{ flex: 1 }}
            >
              <Text style={{ fontSize: 16 }}>{item.name}</Text>
            </TouchableOpacity>
            <Button title="Delete" onPress={() => deleteSet(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
