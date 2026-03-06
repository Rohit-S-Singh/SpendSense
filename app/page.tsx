"use client";

import { useEffect, useState } from "react";
import AddExpense from "@/components/AddExpense";

export default function Home() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  const loadData = async () => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) return;

    // Fetch expenses using POST
    const expensesRes = await fetch(
      "https://system-backend-hprl.onrender.com/api/expenses/today-expenses",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: storedEmail })
      }
    );
    const expensesData = await expensesRes.json();

    // Fetch total using POST
    const totalRes = await fetch(
      "https://system-backend-hprl.onrender.com/api/expenses/today-total",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: storedEmail })
      }
    );
    const totalData = await totalRes.json();

    setExpenses(expensesData.data || []);
    setTotal(totalData.totalSpent || 0);
  };
  const deleteExpense = async (id: string) => {
    await fetch(`https://system-backend-hprl.onrender.com/api/expenses/delete-expense/${id}`, {
      method: "DELETE",
    });
  
    loadData();
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setEmail(savedEmail);
      setIsTracking(true);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (isTracking) loadData();
  }, [isTracking]);

  const startTracking = () => {
    if (!email) return;
    localStorage.setItem("email", email);
    setIsTracking(true);
    loadData();
  };

  const logout = () => {
    localStorage.removeItem("email");
    setEmail("");
    setIsTracking(false);
  };

  if (!ready) return null;

  if (!isTracking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100">
        <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 w-[360px]">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
            SpendSense
          </h1>
          <p className="text-gray-500 text-center mb-6">
            Track your daily spending effortlessly
          </p>

          <input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg w-full text-black mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            onClick={startTracking}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Start Tracking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100">
      <div className="w-[380px] p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600">
          SpendSense
        </h1>

        <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=user"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="text-sm text-gray-400">Tracking for</p>
              <p className="font-semibold text-gray-700 text-sm">{email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Change
          </button>
        </div>

        <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6">
          <p className="text-gray-500 text-sm">Today's Spend</p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">₹{total}</h2>
        </div>

        <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Today's Expenses</h2>

          {expenses.length === 0 ? (
            <p className="text-gray-400 text-sm">No expenses added today</p>
          ) : (
            <div className="space-y-3">
              {expenses.map((e) => (
                <div
                  key={e._id}
                  className="flex justify-between items-center bg-white rounded-lg shadow-sm p-3"
                >
                  <div>
                    <p className="font-semibold text-gray-700">{e.category}</p>
                    <p className="text-xs text-gray-400">{e.note}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-indigo-600">₹{e.amount}</p>
                    <button
                      onClick={() => deleteExpense(e._id)}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <AddExpense refresh={loadData} />
      </div>
    </div>
  );
}