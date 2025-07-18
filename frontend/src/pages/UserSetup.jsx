import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { fetchProfile } from "../lib/auth";

export default function UserSetup({ onComplete }) {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState("");
  const [goal, setGoal] = useState("");
  const [categories, setCategories] = useState("");
  const [progress, setProgress] = useState(33);

  const navigate = useNavigate();

  const nextStep = () => {
    setStep((prev) => prev + 1);
    setProgress((prev) => Math.min(prev + 33, 100));
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    setProgress((prev) => Math.max(prev - 33, 0));
  };

  const handleSubmit = async () => {
    try {
      await api.put("/users/setup", {
        monthly_income: parseFloat(income) || 0,
        goal: goal || "",
        fixed_expenses: categories ? { categories } : {},
      });

      const updatedProfile = await fetchProfile();
      onComplete(updatedProfile); // Update user in App
      navigate("/"); // Redirect to dashboard
    } catch (error) {
      console.error("Setup error:", error);
      alert("Something went wrong with setup");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-2 rounded overflow-hidden mb-6">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Step 1: Monthly Income</h2>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter your income"
            className="w-full border p-2 rounded"
          />
          <button
            onClick={nextStep}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Step 2: Financial Goal</h2>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Choose a goal</option>
            <option value="Save for house">Save for house</option>
            <option value="Pay off debt">Pay off debt</option>
            <option value="Build emergency fund">Build emergency fund</option>
            <option value="Other">Other</option>
          </select>

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="bg-gray-400 text-white py-2 px-4 rounded"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="bg-blue-600 text-white py-2 px-4 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Step 3: Categories (optional)</h2>
          <input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="E.g. Rent, Food, Travel"
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="bg-gray-400 text-white py-2 px-4 rounded"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white py-2 px-4 rounded"
            >
              Finish Setup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
