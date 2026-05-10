import { useLocalSearchParams, Href, router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { getHistoryEntryById, type HistoryEntry } from "@/db/database";
import { deleteItemHandler } from "@/app/functions/deleteItemHandler";
import { updateItemHandler } from "@/app/functions/updateItemHandler";
import { onShare } from "@/app/functions/shareHandler";
import { ConfirmDeleteModal } from "@/app/component/ConfirmDeleteModal";

export default function HistoryItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [entry, setEntry] = useState<HistoryEntry | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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
          <TextInput
            style={styles.value}
            value={entry.qrname}
            onChangeText={(text) => setEntry({ ...entry, qrname: text })}
            editable={true}
          />
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.value}
            value={entry.qrcontent}
            onChangeText={(text) => setEntry({ ...entry, qrcontent: text })}
            editable={true}
            multiline
          />
          <Text style={styles.label}>Saved</Text>
          <Text style={styles.value}>{entry.created_at}</Text>
          <Text style={styles.label}>Last Updated</Text>
          <Text style={styles.value}>{entry.updated_at}</Text>

          <Pressable
            style={[
              styles.value,
              {
                marginTop: 24,
                alignItems: "center",
              },
            ]}
            onPress={() =>
              updateItemHandler(db, entry).then(() => router.back())
            }
          >
            <Text>Save Changes</Text>
          </Pressable>

          <View style={styles.actionsContainer}>
            <Pressable
              style={[styles.actionButton, styles.openButton]}
              onPress={() => router.push(`${entry.qrcontent}` as Href)}
            >
              <Text style={styles.actionButtonText}>Open</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.shareButton]}
              onPress={() => onShare(entry.qrcontent)}
            >
              <Text style={styles.actionButtonText}>Share</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => setDeleteModalVisible(true)}
            >
              <Text style={styles.actionButtonText}>Delete</Text>
            </Pressable>
            <ConfirmDeleteModal
              isVisible={deleteModalVisible}
              item={entry}
              onConfirm={async () => {
                await deleteItemHandler(db, entry);
                setDeleteModalVisible(false);
                router.back();
              }}
              onCancel={() => setDeleteModalVisible(false)}
            />
          </View>
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
  actionsContainer: {
    flexDirection: "column",
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  openButton: {
    backgroundColor: "#0bc15a",
  },
  shareButton: {
    backgroundColor: "#6C8EBF",
  },
  deleteButton: {
    backgroundColor: "#eb0d0d",
  },
});
