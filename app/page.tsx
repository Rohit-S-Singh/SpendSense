"use client";

import { useEffect, useState } from "react";
import AddExpense from "@/components/AddExpense";

export default function Home() {

  const [expenses, setExpenses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [budget, setBudget] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  const [budgetInput, setBudgetInput] = useState("");

  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  const loadData = async () => {

    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) return;

    // FETCH TODAY EXPENSES
    const expensesRes = await fetch(
      "https://system-backend-hprl.onrender.com/api/expenses/today-expenses",
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email: storedEmail })
      }
    );

    const expensesData = await expensesRes.json();

    // FETCH TODAY TOTAL
    const totalRes = await fetch(
      "https://system-backend-hprl.onrender.com/api/expenses/today-total",
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email: storedEmail })
      }
    );

    const totalData = await totalRes.json();

    // FETCH MONTHLY BUDGET + %
    const budgetRes = await fetch(
      `https://system-backend-hprl.onrender.com/api/expenses/budget-percentage?email=${storedEmail}`
    );

    const budgetData = await budgetRes.json();

    setExpenses(expensesData.data || []);
    setTotal(totalData.totalSpent || 0);

    setBudget(budgetData.monthlyBudget || 0);
    setPercentage(Number(budgetData.percentage) || 0);
    setTotalSpent(budgetData.totalSpent || 0);
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

  const deleteExpense = async (id: string) => {

    await fetch(
      `https://system-backend-hprl.onrender.com/api/expenses/delete-expense/${id}`,
      { method: "DELETE" }
    );

    loadData();
  };

  const setMonthlyBudget = async () => {

    if (!budgetInput) return;

    await fetch(
      "https://system-backend-hprl.onrender.com/api/expenses/set-budget",
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email,
          monthlyBudget: Number(budgetInput)
        })
      }
    );

    setBudgetInput("");

    loadData();
  };

  if (!ready) return null;

  if (!isTracking) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100">

        <div className="bg-white shadow-xl rounded-2xl p-8 w-[360px]">

          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
            SpendSense
          </h1>

          <p className="text-gray-500 text-center mb-6">
            Track your daily spending effortlessly
          </p>

          <input
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="border p-3 rounded-lg w-full text-black mb-4"
          />

          <button
            onClick={startTracking}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg"
          >
            Start Tracking
          </button>

        </div>

      </div>
    );
  }

  const percent = Math.min(percentage,100);

  return (

    <div className="min-h-screen flex justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100">

      <div className="w-[380px] p-6 space-y-6">

        <h1 className="text-3xl font-bold text-center text-indigo-600">
          SpendSense
        </h1>

        {/* USER CARD */}

        <div className="bg-white shadow rounded-2xl p-4 flex justify-between items-center">

          <div>
            <p className="text-sm text-gray-400">Tracking for</p>
            <p className="font-semibold text-gray-700 text-sm">{email}</p>
          </div>

          <button
            onClick={logout}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Change
          </button>

        </div>

        {/* TODAY SPEND */}

        <div className="bg-white shadow rounded-2xl p-6">

          <p className="text-gray-500 text-sm">
            Today's Spend
          </p>

          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            ₹{total}
          </h2>

        </div>

        {/* THERMOMETER */}

        <div className="bg-white shadow rounded-2xl p-6">

          <p className="text-gray-700 mb-3 font-semibold">
            Monthly Budget Usage
          </p>

          <div className="relative w-full h-6 bg-gray-200 rounded-full">

            <div
              className="h-6 bg-green-500 rounded-full transition-all"
              style={{ width:`${percent}%` }}
            />

            <div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"
              style={{ left:`calc(${percent}% - 12px)` }}
            />

          </div>

          <div className="flex justify-between mt-2 text-sm text-gray-500">

            <span>₹{totalSpent}</span>

            <span>₹{budget}</span>

          </div>

          <p className="text-xs text-gray-500 mt-1">
            {percent}% used
          </p>

        </div>

        {/* SET BUDGET ACCORDION */}

        <details className="bg-white shadow rounded-2xl p-4">

          <summary className="cursor-pointer font-semibold text-gray-700">
            Set Monthly Budget
          </summary>

          <div className="mt-4 space-y-3">

            <input
              placeholder="Enter monthly budget"
              value={budgetInput}
              onChange={(e)=>setBudgetInput(e.target.value)}
              className="border rounded-lg p-2 w-full"
            />

            <button
              onClick={setMonthlyBudget}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg"
            >
              Save Budget
            </button>

          </div>

        </details>

        {/* TODAY EXPENSES */}

        <div className="bg-white shadow rounded-2xl p-6">

          <h2 className="font-semibold mb-4 text-gray-800">
            Today's Expenses
          </h2>

          {expenses.length === 0 ?

            <p className="text-gray-400 text-sm">
              No expenses added today
            </p>

          :

            <div className="space-y-3">

              {expenses.map((e)=>(
                <div
                  key={e._id}
                  className="flex justify-between items-center bg-white rounded-lg shadow-sm p-3"
                >

                  <div>
                    <p className="font-semibold text-gray-700">
                      {e.category}
                    </p>

                    <p className="text-xs text-gray-500">
                      {e.note}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">

                    <p className="font-bold text-indigo-600">
                      ₹{e.amount}
                    </p>

                    <button
                      onClick={()=>deleteExpense(e._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑
                    </button>

                  </div>

                </div>
              ))}

            </div>

          }

        </div>

        <AddExpense refresh={loadData}/>

      </div>

    </div>

  );
}