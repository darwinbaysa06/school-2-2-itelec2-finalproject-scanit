import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { getHistoryEntries, type HistoryEntry } from "../../../db/database";

export default function HistoryScreen() {
  const db = useSQLiteContext();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await getHistoryEntries(db);
      setEntries(results);
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries]),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan History</Text>
      {isLoading ? (
        <Text style={styles.status}>Loading saved scans...</Text>
      ) : entries.length === 0 ? (
        <Text style={styles.status}>No scans saved yet.</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/(tabs)/history/item/${item.id}`)}
            >
              <Text style={styles.cardTitle}>{item.qrname}</Text>
              <Text style={styles.cardText} numberOfLines={2}>
                {item.qrcontent}
              </Text>
              <Text style={styles.cardMeta}>{item.created_at}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#102033",
    marginBottom: 12,
  },
  status: {
    fontSize: 16,
    color: "#52606d",
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e6e8ef",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#102033",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 10,
  },
  cardMeta: {
    fontSize: 12,
    color: "#64748b",
  },
});
