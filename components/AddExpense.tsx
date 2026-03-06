"use client";
import { useState } from "react";

export default function AddExpense({ refresh }: any) {

  const [amount,setAmount] = useState("");
  const [category,setCategory] = useState("");
  const [note,setNote] = useState("");

  const handleSubmit = async (e:any)=>{
    e.preventDefault();

    const email = localStorage.getItem("email");

    await fetch(
      "https://system-backend-hprl.onrender.com/api/expenses/add-expense",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email,
          amount:Number(amount),
          category,
          note
        })
      }
    );

    setAmount("");
    setCategory("");
    setNote("");

    refresh();
  };

  return(

    <form
      onSubmit={handleSubmit}
      className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6 space-y-4"
    >

      <h2 className="text-lg font-semibold text-gray-700">
        Add Expense
      </h2>

      <input
        placeholder="Amount (₹)"
        value={amount}
        onChange={(e)=>setAmount(e.target.value)}
        className="border border-gray-200 rounded-lg p-3 w-full text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <input
        placeholder="Category (Food, Travel...)"
        value={category}
        onChange={(e)=>setCategory(e.target.value)}
        className="border border-gray-200 rounded-lg p-3 w-full text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <input
        placeholder="Note (optional)"
        value={note}
        onChange={(e)=>setNote(e.target.value)}
        className="border border-gray-200 rounded-lg p-3 w-full text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <button
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition shadow-md"
      >
        Add Expense
      </button>

    </form>

  );
}