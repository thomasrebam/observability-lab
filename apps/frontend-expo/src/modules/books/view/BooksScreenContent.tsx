import { useBooksQuery } from "@/modules/books/infra/books.query";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export const BooksScreenContent = () => {
  const { data, error, isPending, isRefetching, refetch } = useBooksQuery();

  if (isPending) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error} accessibilityRole="alert">
          {error.message}
        </Text>
        <Button title="Retry" onPress={() => void refetch()} />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(book) => String(book.id)}
      refreshing={isRefetching}
      onRefresh={() => void refetch()}
      contentInsetAdjustmentBehavior="automatic"
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={<View style={styles.topSpacer} />}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>
            {item.author} · {item.year}
          </Text>
        </View>
      )}
    />
  );
};

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  topSpacer: {
    height: 48,
  },
  error: {
    color: "#b91c1c",
    textAlign: "center",
  },
  retry: {
    color: "#2563eb",
    fontWeight: "600",
    padding: 8,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    marginTop: 2,
    color: "#6b7280",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e5e7eb",
  },
});
