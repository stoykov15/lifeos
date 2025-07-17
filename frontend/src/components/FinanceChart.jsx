import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { ArrowRightCircle } from "lucide-react";

const COLORS = ["#00C49F", "#FF8042", "#8884d8", "#ffc658"];

const FinanceChart = ({
  incomeSources = [],
  fixedExpenses = {},
  variableExpenses = [],
}) => {
  const totalIncome = incomeSources.reduce((sum, inc) => sum + inc.amount, 0);
  const fixedArray = Object.entries(fixedExpenses).map(([key, val]) => ({
    name: key,
    amount: val,
  }));

  const totalFixed = fixedArray.reduce((sum, item) => sum + item.amount, 0);
  const totalVariable = variableExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalExpenses = totalFixed + totalVariable;
  const savings = totalIncome - totalExpenses;

  const remainingPercentage = ((savings / totalIncome) * 100).toFixed(0);

  const data = [
    { name: "Fixed Expenses", value: totalFixed },
    { name: "Variable Expenses", value: totalVariable },
    { name: "Savings", value: savings > 0 ? savings : 0 },
  ];

  const topExpenses = [...fixedArray, ...variableExpenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6 w-full">
      <h2 className="text-xl font-semibold mb-2">💸 Budget Overview — This Month</h2>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {/* Chart */}
        <PieChart width={300} height={300}>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
                label
            >
                {data.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i]} />
                ))}
            </Pie>
            <Tooltip />
            {/* <Legend /> */}
        </PieChart>


        {/* Legend and Breakdown */}
        <div className="space-y-4 flex-1">
          <div>
            <p className="font-semibold">💼 Income Sources</p>
            {incomeSources.map((inc, idx) => (
              <p key={idx} className="text-sm text-gray-700">
                {inc.source}: {inc.amount} {inc.currency || ""}
              </p>
            ))}
          </div>

          <div>
            <p className="font-semibold mt-2">📉 Top 3 Expenses</p>
            {topExpenses.map((e, idx) => (
              <p key={idx} className="text-sm text-gray-700">
                {e.name || e.category}: {e.amount}
              </p>
            ))}
          </div>

          <div className="text-sm">
            <p><strong>Total Income:</strong> {totalIncome}</p>
            <p><strong>Total Expenses:</strong> {totalExpenses}</p>
            <p><strong>Savings:</strong> {savings}</p>
            <p>
              <strong>Remaining Budget:</strong>{" "}
              <span className={remainingPercentage < 20 ? "text-red-500 font-semibold" : "text-green-600"}>
                {remainingPercentage}%
              </span>
            </p>
          </div>

          {remainingPercentage < 20 && (
            <p className="text-red-600 font-semibold mt-2">
              ⚠️ Only {remainingPercentage}% of your budget remains. Be careful!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceChart;
