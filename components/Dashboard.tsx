"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {

  const [expenses, setExpenses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [budget, setBudget] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("email")
      : null;

  const fetchData = async () => {

    if (!email) return;

    // TODAY TOTAL
    const totalRes = await fetch(
      "https://system-backend-hprl.onrender.com/api/expenses/today-total",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      }
    );

    const totalData = await totalRes.json();

    // TODAY EXPENSES
    const listRes = await fetch(
      "https://system-backend-hprl.onrender.com/api/expenses/today-expenses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      }
    );

    const listData = await listRes.json();

    // BUDGET API
    const budgetRes = await fetch(
      `https://system-backend-hprl.onrender.com/api/budget-percentage?email=${email}`
    );

    const budgetData = await budgetRes.json();

    setTotal(totalData.totalSpent || 0);
    setExpenses(listData.data || []);

    setBudget(budgetData.monthlyBudget || 0);
    setPercentage(Number(budgetData.percentage) || 0);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteExpense = async (id: string) => {

    await fetch(
      `https://system-backend-hprl.onrender.com/api/expenses/delete-expense/${id}`,
      { method: "DELETE" }
    );

    fetchData();
  };

  const addExpense = async () => {

    if (!amount) return;

    await fetch(
      "https://system-backend-hprl.onrender.com/api/expenses/add-expense",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          amount,
          category,
          note
        })
      }
    );

    setAmount("");
    setCategory("");
    setNote("");

    fetchData();
  };

  const percent = Math.min(percentage, 100);

  return (

    <div className="min-h-screen flex flex-col items-center p-6 space-y-6">

      <h1 className="text-3xl font-bold text-indigo-600">
        SpendSklnlkense
      </h1>

      {/* EMAIL CARD */}

      <div className="bg-white shadow rounded-xl p-4 w-[420px]">

        <p className="text-gray-500">
          Tracking for
        </p>

        <p className="font-semibold">
          {email}
        </p>

      </div>

      <>Hello World</>


      {/* TODAY SPEND */}

      <div className="bg-white shadow rounded-xl p-6 w-[420px]">

        <p className="text-gray-500">
          Today's Spend
        </p>

        <p className="text-3xl font-bold text-indigo-600">
          ₹{total}
        </p>

      </div>


      {/* THERMOMETER */}

      <div className="bg-white shadow rounded-xl p-6 w-[420px]">

        <h2 className="font-semibold mb-3">
          Monthly Budget Usage
        </h2>

        <div className="relative w-full h-6 bg-gray-200 rounded-full">

          <div
            className="h-6 bg-green-500 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />

          <div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow"
            style={{ left: `calc(${percent}% - 12px)` }}
          />

        </div>

        <div className="flex justify-between mt-2 text-sm text-gray-500">

          <span>
            ₹{total}
          </span>

          <span>
            ₹{budget}
          </span>

        </div>

        <p className="text-sm text-gray-500 mt-1">
          {percent}% of budget used
        </p>

      </div>


      {/* TODAY EXPENSES */}

      <div className="bg-white shadow rounded-xl p-6 w-[420px]">

        <h2 className="font-semibold mb-3">
          Today's Expenses
        </h2>

        {expenses.length === 0 && (
          <p className="text-gray-400">
            No expenses added today
          </p>
        )}

        {expenses.map((e: any) => (

          <div
            key={e._id}
            className="flex justify-between border-b py-2"
          >

            <div>

              <p className="font-semibold">
                {e.category}
              </p>

              <p className="text-sm text-gray-500">
                {e.note}
              </p>

            </div>

            <div className="flex gap-3 items-center">

              <span className="font-semibold">
                ₹{e.amount}
              </span>

              <button
                onClick={() => deleteExpense(e._id)}
                className="text-red-500"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>


      {/* ADD EXPENSE */}

      <div className="bg-white shadow rounded-xl p-6 w-[420px] space-y-3">

        <h2 className="font-semibold">
          Add Expense
        </h2>

        <input
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded p-2 w-full"
        />

        <input
          placeholder="Category (Food, Travel...)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded p-2 w-full"
        />

        <input
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border rounded p-2 w-full"
        />

        <button
          onClick={addExpense}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          Add Expense
        </button>

      </div>

    </div>
  );
}