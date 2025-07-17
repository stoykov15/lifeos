import { useState } from "react";
import API from "../lib/api";
import { setUser } from "../lib/user";
import { useNavigate } from "react-router-dom";

export default function UserSetup() {
  const [email, setEmail] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [darkMode, setDarkMode] = useState(false);
  const [fixedExpenses, setFixedExpenses] = useState([{ name: "", amount: "" }]);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const addExpenseField = () => {
    setFixedExpenses([...fixedExpenses, { name: "", amount: "" }]);
  };

  const handleExpenseChange = (i, field, value) => {
    const copy = [...fixedExpenses];
    copy[i][field] = value;
    setFixedExpenses(copy);
  };

  const handleSubmit = async () => {
    if (!email || !monthlyIncome) {
      setError("Please fill in required fields.");
      return;
    }

    const cleanedExpenses = {};
    fixedExpenses.forEach((e) => {
      if (e.name && e.amount) {
        cleanedExpenses[e.name] = parseFloat(e.amount);
      }
    });

    try {
      const res = await API.post("/users", {
        email,
        password: "placeholder", // Can be ignored for now
        monthly_income: parseFloat(monthlyIncome),
        fixed_expenses: cleanedExpenses,
        currency,
        dark_mode: darkMode
      });

      setUser(res.data);
      navigate("/");
    } catch (err) {
      setError("Failed to create user.");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">👤 Set Up Your Profile</h1>

      <div className="space-y-4 bg-white p-6 rounded shadow">
        <input
          type="email"
          className="border p-2 w-full"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Monthly income"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(e.target.value)}
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

        {/* Fixed Expenses */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Fixed Expenses (optional)</p>
          {fixedExpenses.map((e, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="border p-2 flex-1"
                placeholder="e.g. Rent"
                value={e.name}
                onChange={(ev) => handleExpenseChange(i, "name", ev.target.value)}
              />
              <input
                type="number"
                className="border p-2 w-24"
                placeholder="Amount"
                value={e.amount}
                onChange={(ev) => handleExpenseChange(i, "amount", ev.target.value)}
              />
            </div>
          ))}
          <button
            onClick={addExpenseField}
            className="text-sm text-blue-600 underline"
          >
            + Add more
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          Enable Dark Mode
        </label>

        <button
          className="bg-blue-600 text-white w-full py-2 rounded"
          onClick={handleSubmit}
        >
          Save Profile
        </button>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
