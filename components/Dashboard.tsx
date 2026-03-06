"use client";

import { useEffect,useState } from "react";

export default function Dashboard(){

  const [expenses,setExpenses] = useState([]);
  const [total,setTotal] = useState(0);

  const fetchData = async ()=>{

    const email = localStorage.getItem("spend_email");

    const totalRes = await fetch(
      `http://localhost:8080/api/expenses/today-total?email=${email}`
    );
    const totalData = await totalRes.json();

    const listRes = await fetch(
      `http://localhost:8080/api/expenses/today-expenses?email=${email}`
    );
    const listData = await listRes.json();

    setTotal(totalData.totalSpent || 0);
    setExpenses(listData.data || []);
  };

  useEffect(()=>{
    fetchData();
  },[]);

  const deleteExpense = async(id:string)=>{

    await fetch(
      `http://localhost:8080/api/expenses/delete-expense/${id}`,
      {method:"DELETE"}
    );

    fetchData();
  };

  return(

    <div className="space-y-4">

      <div className="p-4 border rounded-xl">

        <h2 className="text-xl font-bold">
          Today's Spend
        </h2>

        <p className="text-3xl font-bold mt-2">
          ₹{total}
        </p>

      </div>

      <div className="p-4 border rounded-xl">

        <h2 className="text-xl font-bold mb-2">
          Today's Expenses
        </h2>

        {expenses.map((e:any)=>(

          <div
            key={e._id}
            className="flex justify-between items-center border-b py-2"
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

              <span className="font-bold">
                ₹{e.amount}
              </span>

              <button
                onClick={()=>deleteExpense(e._id)}
                className="text-red-500"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}