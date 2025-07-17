import { useState, useEffect } from "react";
import API from "../lib/api";
import { getUser } from "../lib/user";

const emojiMap = {
  salary: "💼",
  rent: "🏠",
  investments: "📈",
  gift: "🎁",
  food: "🍔",
  transport: "🚗",
  entertainment: "🎮",
  other: "💸",
};

const getCategoryEmoji = (category) => emojiMap[category?.toLowerCase()] || "💰";

const categoryOptions = {
  income: [
    { label: "💼 Salary", value: "salary" },
    { label: "🏠 Rent", value: "rent" },
    { label: "📈 Investments", value: "investments" },
    { label: "🎁 Gift", value: "gift" },
    { label: "💸 Other", value: "other" },
  ],
  expense: [
    { label: "🍔 Food", value: "food" },
    { label: "🏡 Rent", value: "rent" },
    { label: "🚗 Transport", value: "transport" },
    { label: "🎮 Entertainment", value: "entertainment" },
    { label: "💸 Other", value: "other" },
  ],
};

export default function Finances() {
  const user = getUser();
  const [finances, setFinances] = useState([]);
  const [form, setForm] = useState({
    type: "income",
    amount: "",
    category: "",
    customCategory: "",
  });

  useEffect(() => {
    if (user) fetchFinances();
  }, []);

  const fetchFinances = async () => {
    const res = await API.get(`/finances/${user.id}`);
    setFinances(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount) return;

    const category =
      form.category === "other" ? form.customCategory : form.category;

    await API.post("/finances", {
      user_id: user.id,
      type: form.type,
      amount: parseFloat(form.amount),
      category,
    });

    setForm({ type: "income", amount: "", category: "", customCategory: "" });
    fetchFinances();
  };

  const filteredOptions = categoryOptions[form.type] || [];

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-8">
      <h2 className="text-xl font-semibold">💰 Track Income & Expenses</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            step="0.01"
            min="0"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          >
            <option value="">Select Category</option>
            {filteredOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {form.category === "other" && (
            <input
              type="text"
              name="customCategory"
              placeholder="Custom category"
              value={form.customCategory}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Entry
        </button>
      </form>

      {/* List */}
<div className="bg-gray-50 p-4 rounded-xl shadow">
  <h3 className="font-semibold mb-2">📋 All Entries</h3>
  {finances.length === 0 ? (
    <p className="text-gray-500">No finance data yet.</p>
  ) : (
    <>
      {/* Income Table */}
      <div className="mb-6">
        <h4 className="font-semibold text-green-600 mb-2">Income</h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {finances
              .filter((item) => item.type === "income")
              .map((item) => (
                <tr key={item.id} className="border-b">
                  <td>{getCategoryEmoji(item.category)} {item.category}</td>
                  <td className="text-green-700 font-semibold">+{item.amount}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Expense Table */}
      <div>
        <h4 className="font-semibold text-red-600 mb-2">Expenses</h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {finances
              .filter((item) => item.type === "expense")
              .map((item) => (
                <tr key={item.id} className="border-b">
                  <td>{getCategoryEmoji(item.category)} {item.category}</td>
                  <td className="text-red-700 font-semibold">-{item.amount}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )}
</div>

    </div>
  );
}
