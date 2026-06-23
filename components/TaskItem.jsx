import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function TaskItem({ item, onToggle, onDelete }) {
  return (
    <TouchableOpacity
      style={styles.taskRow}
      onPress={() => onToggle(item)}
      onLongPress={() => onDelete(item.id)}
    >
      <MaterialIcons
        name={item.completed ? "check-box" : "check-box-outline-blank"}
        size={20}
        color="#5A6472"
      />
      <Text style={styles.taskText}>{item.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  taskText: {
    fontSize: 15,
  },
});
