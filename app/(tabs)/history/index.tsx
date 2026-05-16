import { ConfirmDeleteModal } from "@/app/component/ConfirmDeleteModal";
import { formatSqliteUtcToLocal } from "@/app/functions/dateTimeFormatter";
import { deleteItemHandler } from "@/app/functions/deleteItemHandler";
import { qrContentOpenHandler } from "@/app/functions/qrScannerDataHandler";
import { onShare } from "@/app/functions/shareHandler";
import { FontAwesome6 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Href, router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { getHistoryEntries, type HistoryEntry } from "../../../db/database";
export default function HistoryScreen() {
  const db = useSQLiteContext();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

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
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.qrname}</Text>
                <Text style={styles.cardText} numberOfLines={2}>
                  {item.qrcontent}
                </Text>
                <Text style={styles.cardMeta}>
                  Saved on {formatSqliteUtcToLocal(item.created_at)}
                </Text>
                <View style={styles.cardActions}>
                  <Pressable
                    style={[styles.cardActionBtn, styles.cardActionBtnSuccess]}
                    onPress={() => qrContentOpenHandler(item.qrcontent)}
                  >
                    <FontAwesome6
                      size={16}
                      name="arrow-up-right-from-square"
                      color="#fff"
                    />
                    <Text style={styles.cardActionBtnText}>Open</Text>
                  </Pressable>
                  <Pressable
                    style={styles.cardActionBtn}
                    onPress={() => onShare(item.qrcontent)}
                  >
                    <FontAwesome6 size={16} name="share-nodes" color="#fff" />
                    <Text style={styles.cardActionBtnText}>Share</Text>
                  </Pressable>
                  <Pressable
                    style={styles.cardActionBtn}
                    onPress={() =>
                      router.push(`/(tabs)/history/item/${item.id}` as Href)
                    }
                  >
                    <FontAwesome6 size={16} name="pen-to-square" color="#fff" />
                    <Text style={styles.cardActionBtnText}>Edit</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.cardActionBtn, styles.cardActionBtnDanger]}
                    onPress={() => {
                      setSelectedItemId(item.id);
                      setDeleteModalVisible(true);
                    }}
                  >
                    <FontAwesome6 size={16} name="trash" color="#fff" />
                    <Text style={styles.cardActionBtnText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
              <ConfirmDeleteModal
                isVisible={deleteModalVisible && selectedItemId === item.id}
                item={item}
                onConfirm={async () => {
                  if (selectedItemId) {
                    await deleteItemHandler(db, item);
                    setDeleteModalVisible(false);
                    loadEntries();
                  }
                }}
                onCancel={() => setDeleteModalVisible(false)}
              />
            </View>
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
    padding: 0,
    margin: 16,
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
    backgroundColor: "#dae8fc",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#6C8EBF",
  },
  cardContent: {
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
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
  cardActions: {
    marginTop: 12,
    flexDirection: "row",
    gap: 6,
  },
  cardActionBtn: {
    backgroundColor: "#6C8EBF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  cardActionBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  cardActionBtnSuccess: {
    backgroundColor: "#0bc15a",
  },
  cardActionBtnDanger: {
    backgroundColor: "#eb0d0d",
  },
});
