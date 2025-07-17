import { useEffect, useState } from "react";
import API from "../lib/api";
import { getUser, setUser } from "../lib/user";
import { useNavigate } from "react-router-dom";

export default function BudgetEditor() {
  const user = getUser();
  const navigate = useNavigate();

  const [income, setIncome] = useState(user?.monthly_income || 0);
  const [currency, setCurrency] = useState(user?.currency || "USD");
  const [darkMode, setDarkMode] = useState(user?.dark_mode || false);
  const [expenses, setExpenses] = useState(
    Object.entries(user?.fixed_expenses || {}).map(([name, amount]) => ({
      name,
      amount: amount.toString()
    }))
  );

  const addExpense = () => {
    setExpenses([...expenses, { name: "", amount: "" }]);
  };

  const updateExpense = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = value;
    setExpenses(updated);
  };

  const handleSave = async () => {
    const cleaned = {};
    expenses.forEach((e) => {
      if (e.name && e.amount) {
        cleaned[e.name] = parseFloat(e.amount);
      }
    });

    try {
      const res = await API.put(`/users/${user.id}`, {
        monthly_income: parseFloat(income),
        currency,
        dark_mode: darkMode,
        fixed_expenses: cleaned
      });

      const updatedUser = { ...user, ...res.data };
      setUser(updatedUser);
      navigate("/");
    } catch (err) {
      alert("Failed to update user.");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">💼 Edit Budget</h1>

      <div className="space-y-4 bg-white p-6 rounded shadow">
        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Monthly income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />

        <select
          className="border p-2 w-full"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="USD">USD $</option>
          <option value="EUR">EUR €</option>
          <option value="GBP">GBP £</option>
          <option value="BGN">BGN лв</option>
        </select>

        {/* Fixed Expenses List */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Fixed Expenses</p>
          {expenses.map((e, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="border p-2 flex-1"
                placeholder="e.g. Rent"
                value={e.name}
                onChange={(ev) => updateExpense(i, "name", ev.target.value)}
              />
              <input
                type="number"
                className="border p-2 w-24"
                placeholder="Amount"
                value={e.amount}
                onChange={(ev) => updateExpense(i, "amount", ev.target.value)}
              />
            </div>
          ))}
          <button
            onClick={addExpense}
            className="text-sm text-blue-600 underline"
          >
            + Add more
          </button>
        </div>

        {/* Dark Mode */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          Enable Dark Mode
        </label>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
