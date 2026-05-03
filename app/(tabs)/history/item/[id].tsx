import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  getHistoryEntryById,
  type HistoryEntry,
} from "../../../../db/database";

export default function HistoryItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [entry, setEntry] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    getHistoryEntryById(db, id).then(setEntry);
  }, [db, id]);

  return (
    <View style={styles.container}>
      {entry ? (
        <>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{entry.qrname}</Text>
          <Text style={styles.label}>Content</Text>
          <Text style={styles.value}>{entry.qrcontent}</Text>
          <Text style={styles.label}>Saved</Text>
          <Text style={styles.value}>{entry.created_at}</Text>
        </>
      ) : (
        <Text style={styles.value}>No saved scan found for this ID.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f6f7fb",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#102033",
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#64748b",
  },
  value: {
    fontSize: 16,
    color: "#0f172a",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e6e8ef",
  },
});
