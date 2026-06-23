import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setErrorMessage("");

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      setErrorMessage(error.message);
      Alert.alert("Could not load tasks", error.message);
      return;
    }

    setTasks(data ?? []);
  };

  const addTask = async () => {
    const trimmedTask = task.trim();

    if (!trimmedTask) {
      return;
    }

    setErrorMessage("");

    const { error } = await supabase
      .from("tasks")
      .insert({ title: trimmedTask, completed: false });

    if (error) {
      console.log(error);
      setErrorMessage(error.message);
      Alert.alert("Could not add task", error.message);
      return;
    }

    setTask("");
    await loadTasks();
  };

  const toggleTask = async (item: Task) => {
    setErrorMessage("");

    const { error } = await supabase
      .from("tasks")
      .update({ completed: !item.completed })
      .eq("id", item.id);

    if (error) {
      console.log(error);
      setErrorMessage(error.message);
      Alert.alert("Could not update task", error.message);
      return;
    }

    await loadTasks();
  };

  const deleteTask = async (id: string) => {
    setErrorMessage("");

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.log(error);
      setErrorMessage(error.message);
      Alert.alert("Could not delete task", error.message);
      return;
    }

    await loadTasks();
  };

  return (
    <View style={styles.container}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>TaskFlow</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter Task"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <MaterialIcons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {tasks.map((task) => (
        <TouchableOpacity
          style={styles.taskRow}
          key={task.id}
          onPress={() => toggleTask(task)}
          onLongPress={() => deleteTask(task.id)}
        >
          <MaterialIcons
            name={task.completed ? "check-box" : "check-box-outline-blank"}
            size={20}
            color="#5A6472"
          />
          <Text style={styles.taskText}>{task.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// headerStyles is kept separate from the rest of the screen's styles —
// the header is a distinct visual region (title bar) that's a natural
// candidate to later become its own component or shared layout.
const headerStyles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2A44",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#2E5BBA",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
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
  errorText: {
    color: "#B42318",
    marginBottom: 12,
  },
});
