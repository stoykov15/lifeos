import { useState } from "react";
import API from "../lib/api";
import { getUser } from "../lib/user";

export default function ActivityLogger() {
  const user = getUser();

  const [entry, setEntry] = useState({
    type: "expense",
    category: "",
    amount: "",
    note: ""
  });

  const [status, setStatus] = useState(null);

  const handleSubmit = async () => {
    if (!entry.category || !entry.amount) {
      setStatus("Please fill in category and amount.");
      return;
    }

    try {
      await API.post("/finances", {
        ...entry,
        amount: parseFloat(entry.amount),
        user_id: user.id
      });
      setStatus("✅ Entry logged successfully!");
      setEntry({ type: "expense", category: "", amount: "", note: "" });
    } catch (err) {
      setStatus("❌ Failed to log activity.");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📝 Log Activity</h1>

      <div className="space-y-4 bg-white p-4 rounded shadow">
        <select
          className="border p-2 w-full"
          value={entry.type}
          onChange={(e) => setEntry({ ...entry, type: e.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Category (e.g. Groceries)"
          value={entry.category}
          onChange={(e) => setEntry({ ...entry, category: e.target.value })}
        />

        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Amount"
          value={entry.amount}
          onChange={(e) => setEntry({ ...entry, amount: e.target.value })}
        />

        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Optional note"
          value={entry.note}
          onChange={(e) => setEntry({ ...entry, note: e.target.value })}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          onClick={handleSubmit}
        >
          Log Activity
        </button>

        {status && (
          <p className="text-sm text-center mt-2 text-gray-700">{status}</p>
        )}
      </div>
    </div>
  );
}
