import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Profile({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/auth/me").then((res) => setProfile(res.data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    try {
      await api.post("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      alert("✅ Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert("❌ Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("⚠️ Are you sure you want to delete your account?");
    if (!confirmed) return;
    try {
      await api.delete("/auth/delete");
      localStorage.removeItem("token");
      onLogout();
    } catch (err) {
      alert("❌ Failed to delete account");
    }
  };

  if (!profile) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl space-y-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800">👤 User Profile</h2>

      <div className="space-y-2">
        <p className="text-gray-700"><strong>Email:</strong> {profile.email}</p>
        <p className="text-gray-700"><strong>User ID:</strong> {profile.id}</p>
      </div>

      <div className="border-t pt-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">🔐 Change Password</h3>
        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border p-2 rounded bg-gray-50"
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded bg-gray-50"
        />
        <button
          onClick={handlePasswordChange}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={handleLogout}
          className="w-[48%] py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
        >
          🚪 Logout
        </button>
        <button
          onClick={handleDelete}
          className="w-[48%] py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          🗑️ Delete Account
        </button>
      </div>
    </div>
  );
}
