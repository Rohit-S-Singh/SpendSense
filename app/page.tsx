"use client";

import { useEffect, useState } from "react";
import AddExpense from "@/components/AddExpense";

export default function Home() {

  const [expenses, setExpenses] = useState<any[]>([]);
  const [allExpenses, setAllExpenses] = useState<any[]>([]);

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

    // TODAY EXPENSES
    const expensesRes = await fetch(
      "https://system-backend-hprl.onrender.com/api/expenses/today-expenses",
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email: storedEmail })
      }
    );

    const expensesData = await expensesRes.json();

    // TODAY TOTAL
    const totalRes = await fetch(
      "https://system-backend-hprl.onrender.com/api/expenses/today-total",
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email: storedEmail })
      }
    );

    const totalData = await totalRes.json();

    // MONTHLY BUDGET
    const budgetRes = await fetch(
      `https://system-backend-hprl.onrender.com/api/expenses/budget-percentage?email=${storedEmail}`
    );

    const budgetData = await budgetRes.json();

    // ALL EXPENSES
    const allRes = await fetch(
      `https://system-backend-hprl.onrender.com/api/expenses/expenses?email=${storedEmail}`
    );

    const allData = await allRes.json();

    setExpenses(expensesData.data || []);
    setTotal(totalData.totalSpent || 0);

    setBudget(budgetData.monthlyBudget || 0);
    setPercentage(Number(budgetData.percentage) || 0);
    setTotalSpent(budgetData.totalSpent || 0);

    setAllExpenses(allData || []);
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

  const percent = Math.min(percentage,100);

  // GROUP EXPENSES BY DATE
  const groupedExpenses = allExpenses.reduce((acc:any, exp:any) => {

    const date = new Date(exp.date).toLocaleDateString();

    if (!acc[date]) acc[date] = [];

    acc[date].push(exp);

    return acc;

  }, {});

  return (

    <div className="min-h-screen flex justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100">

      <div className="w-[380px] p-6 space-y-6">

        <h1 className="text-3xl font-bold text-center text-indigo-600">
          SpendSense
        </h1>

        {/* USER CARD */}

        <div className="bg-white shadow rounded-2xl p-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <img
              src="https://api.dicebear.com/7.x/bottts/svg?seed=expense"
              className="w-12 h-12"
            />

            <div>
              <p className="text-sm text-gray-400">
                Tracking for
              </p>

              <p className="font-semibold text-sm text-gray-700">
                {email}
              </p>
            </div>

          </div>

          <button
            onClick={logout}
            className="text-xs text-red-500"
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

          <p className="font-semibold text-gray-700 mb-3">
            Monthly Budget Usage
          </p>

          <div className="relative w-full h-6 bg-gray-200 rounded-full">

            <div
              className="h-6 bg-green-500 rounded-full"
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


        {/* SET BUDGET */}

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

          {expenses.length === 0 ? (

            <p className="text-gray-400 text-sm">
              No expenses added today
            </p>

          ) : (

            expenses.map((e)=>(
              <div
                key={e._id}
                className="flex justify-between items-center border-b py-2"
              >

                <div>
                  <p className="font-semibold text-gray-700">
                    {e.category}
                  </p>

                  <p className="text-xs text-gray-500">
                    {e.note}
                  </p>
                </div>

                <div className="flex gap-3">

                  <p className="font-bold text-indigo-600">
                    ₹{e.amount}
                  </p>

                  <button
                    onClick={()=>deleteExpense(e._id)}
                    className="text-red-500"
                  >
                    🗑
                  </button>

                </div>

              </div>
            ))

          )}

        </div>


        {/* ALL EXPENSES ACCORDION */}
        <details className="bg-white shadow rounded-2xl p-4">

  <summary className="cursor-pointer font-semibold text-gray-900">
    All Expenses
  </summary>

  <div className="mt-4 space-y-5">

    {Object.keys(groupedExpenses).map((date)=>{

      const dayExpenses = groupedExpenses[date];

      const dayTotal = dayExpenses.reduce(
        (sum:any, exp:any)=> sum + exp.amount,
        0
      );

      return (

        <div key={date}>

          {/* DATE + DAILY TOTAL */}

          <div className="flex justify-between items-center mb-2">

            <p className="font-semibold text-gray-900">
              {date}
            </p>

            <p className="font-bold text-indigo-600">
              ₹{dayTotal}
            </p>

          </div>

          {/* EXPENSES */}

          {dayExpenses.map((e:any)=>(
            <div
              key={e._id}
              className="flex justify-between text-sm border-b py-2"
            >

              <span className="text-gray-800">
                {e.category}
              </span>

              <span className="font-semibold text-gray-700">
                ₹{e.amount}
              </span>

            </div>
          ))}

        </div>

      );

    })}

  </div>

</details>

        <AddExpense refresh={loadData}/>

      </div>

    </div>
  );
}