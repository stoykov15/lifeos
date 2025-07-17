import { useEffect, useState } from "react";
import API from "../lib/api";
import { getUser } from "../lib/user";
import FinanceChart from "../components/FinanceChart";
import Layout from "../components/Layout";


export default function Dashboard() {
  const user = getUser();
  const [tasks, setTasks] = useState([]);
  const [finances, setFinances] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetchTasks();
    fetchFinances();
  }, []);

  const fetchTasks = async () => {
    const res = await API.get(`/tasks/${user.id}`);
    setTasks(res.data);
  };

  const fetchFinances = async () => {
    const res = await API.get(`/finances/${user.id}`);
    setFinances(res.data);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const totalExpenses = finances
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const remaining = (user?.monthly_income || 0) - totalExpenses;

  const workTasks = tasks.filter(t => t.type === "work" && !t.done);
  const homeTasks = tasks.filter(t => t.type === "personal" && !t.done);

  return (
    <Layout>
    <div className="space-y-6">
      <div className="bg-blue-100 p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold">
          {getGreeting()}, {user?.email?.split("@")[0]} 👋
        </h2>
        <p className="text-sm text-gray-600">Here’s what’s going on today.</p>
      </div>

      {/* 🧑‍💻 Work Tasks */}
      <div>
        <h3 className="font-semibold text-lg mb-2">🧑‍💻 Work Tasks</h3>
        {workTasks.length === 0 ? (
          <p className="text-gray-500">You're all caught up!</p>
        ) : (
          <ul className="list-disc ml-5">
            {workTasks.slice(0, 3).map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        )}
      </div>

      {/* 🏡 Home Tasks */}
      <div>
        <h3 className="font-semibold text-lg mb-2">🏡 Home Tasks</h3>
        {homeTasks.length === 0 ? (
          <p className="text-gray-500">Nothing pending at home!</p>
        ) : (
          <ul className="list-disc ml-5">
            {homeTasks.slice(0, 3).map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        )}
      </div>

    {/* 💰 Budget Chart */}
    <FinanceChart
        incomeSources={
            Array.isArray(user.monthly_income)
            ? user.monthly_income
            : [{ source: "Main Income", amount: user.monthly_income || 0 }]
        }
        fixedExpenses={user.fixed_expenses || {}}
        variableExpenses={finances.filter((f) => f.type === "expense")}
    />

    </div>
    </Layout>
  );
}
