import { useEffect, useState } from "react";
import API from "../lib/api";
import { getUser } from "../lib/user";

export default function Resources() {
  const user = getUser();
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    label: "",
    type: "article",
    url: "",
    status: "to_read",
  });

  useEffect(() => {
    if (!user) return;
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const res = await API.get(`/resources/${user.id}`);
    setResources(res.data);
  };

  const addResource = async () => {
    if (!form.label || !form.url) return;
    await API.post("/resources", { ...form, user_id: user.id });
    setForm({ label: "", type: "article", url: "", status: "to_read" });
    fetchResources();
  };

  const updateStatus = async (resItem, newStatus) => {
    await API.put(`/resources/${resItem.id}`, { ...resItem, status: newStatus });
    fetchResources();
  };

  const deleteResource = async (id) => {
    await API.delete(`/resources/${id}`);
    fetchResources();
  };

  const statusColors = {
    to_read: "text-yellow-500",
    reading: "text-blue-500",
    done: "text-green-600",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📚 Resources</h1>

      {/* Add New Resource */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          className="border p-2 flex-1"
          placeholder="Label (e.g. AI Article)"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
        <input
          className="border p-2 flex-1"
          placeholder="URL"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
        <select
          className="border p-2"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="article">📄 Article</option>
          <option value="book">📚 Book</option>
          <option value="tool">🛠 Tool</option>
        </select>
        <button onClick={addResource} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      {/* Resource List */}
      <div className="space-y-3">
        {resources.map((resItem) => (
          <div key={resItem.id} className="flex items-start justify-between border-b py-2">
            <div>
              <p className="font-medium">{resItem.label} ({resItem.type})</p>
              <a
                href={resItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
              >
                {resItem.url}
              </a>
              <div className={`text-xs ${statusColors[resItem.status]} mt-1`}>
                Status: {resItem.status}
              </div>
            </div>
            <div className="flex gap-2">
              {["to_read", "reading", "done"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(resItem, s)}
                  className="text-xs underline text-gray-600"
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => deleteResource(resItem.id)}
                className="text-red-500 text-sm ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
