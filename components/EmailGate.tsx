"use client";
import { useState } from "react";

export default function EmailGate({ onSetEmail }: any) {

  const [email,setEmail] = useState("");

  const handleSubmit = (e:any)=>{
    e.preventDefault();

    localStorage.setItem("email",email);
    onSetEmail(email);
  }

  return (

    <div className="flex flex-col items-center justify-center h-screen gap-6">

      <h1 className="text-3xl font-bold">
        SpendSense
      </h1>

      <p className="text-gray-600">
        Enter email to start tracking expenses
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-72"
      >

        <input
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="border p-2 rounded"
        />

        <button className="bg-black text-white p-2 rounded">
          Start Tracking
        </button>

      </form>

    </div>
  );
}