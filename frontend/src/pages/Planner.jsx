import { useEffect, useState } from "react";
import API from "../lib/api";
import { getUser } from "../lib/user";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Planner() {
  const user = getUser();
  const [plans, setPlans] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const res = await API.get(`/resources/${user.id}`);
    const plannerEntries = res.data.filter((r) => r.type === "planner");

    const mapped = {};
    plannerEntries.forEach((entry) => {
      mapped[entry.category] = entry.note;
    });

    setPlans(mapped);
  };

  const savePlan = async (day) => {
    const existing = await API.get(`/resources/${user.id}`);
    const plannerEntry = existing.data.find(
      (r) => r.type === "planner" && r.category === day
    );

    try {
      if (plannerEntry) {
        await API.put(`/resources/${plannerEntry.id}`, {
          ...plannerEntry,
          note: plans[day],
        });
      } else {
        await API.post("/resources", {
          user_id: user.id,
          type: "planner",
          label: `Plan for ${day}`,
          category: day,
          note: plans[day],
          status: "active",
        });
      }

      setStatus(`✅ Saved ${day}`);
      setTimeout(() => setStatus(""), 2000);
    } catch (err) {
      setStatus(`❌ Error saving ${day}`);
    }
  };

  const updateText = (day, value) => {
    setPlans({ ...plans, [day]: value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🗓 Weekly Planner</h1>

      {status && <div className="text-sm text-center text-green-700">{status}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">{day}</h3>
            <textarea
              rows={5}
              className="w-full border p-2 rounded text-sm"
              placeholder={`Plan for ${day}`}
              value={plans[day] || ""}
              onChange={(e) => updateText(day, e.target.value)}
            />
            <button
              onClick={() => savePlan(day)}
              className="mt-2 bg-blue-600 text-white text-sm px-4 py-1 rounded"
            >
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
