import { useEffect, useState } from "react";
import API from "../lib/api";
import { getUser } from "../lib/user";

export default function Tasks() {
  const user = getUser();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", type: "personal" });

  useEffect(() => {
    if (!user) return;
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await API.get(`/tasks/${user.id}`);
    setTasks(res.data);
  };

  const toggleTask = async (task) => {
    await API.put(`/tasks/${task.id}`, { ...task, done: !task.done });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    await API.post("/tasks", {
      user_id: user.id,
      ...newTask
    });
    setNewTask({ title: "", type: "personal" });
    fetchTasks();
  };

  const renderTasks = (type) => (
    tasks
      .filter((t) => t.type === type)
      .map((task) => (
        <div key={task.id} className="flex items-center justify-between border-b py-1">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task)}
            />
            <span className={task.done ? "line-through text-gray-400" : ""}>
              {task.title}
            </span>
          </div>
          <button onClick={() => deleteTask(task.id)} className="text-red-500 text-sm">✕</button>
        </div>
      ))
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🗂 Task Manager</h1>

      {/* Add Task */}
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="New task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <select
          className="border p-2"
          value={newTask.type}
          onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
        >
          <option value="personal">🏡 Home</option>
          <option value="work">🧑‍💻 Work</option>
        </select>
        <button onClick={addTask} className="bg-blue-600 text-white px-4 rounded">
          Add
        </button>
      </div>

      {/* Work Tasks */}
      <div>
        <h2 className="font-semibold text-lg mb-2">🧑‍💻 Work Tasks</h2>
        {renderTasks("work")}
      </div>

      {/* Home Tasks */}
      <div>
        <h2 className="font-semibold text-lg mb-2">🏡 Home Tasks</h2>
        {renderTasks("personal")}
      </div>
    </div>
  );
}
