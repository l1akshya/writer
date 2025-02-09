"use client";

import { useState } from "react";
import "./styles.css";

export default function Calculator() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [operation, setOperation] = useState("add");
  const [result, setResult] = useState(null);

  const calculate = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/calculate?operation=${operation}&a=${a}&b=${b}`
      );
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error fetching calculation result:", error);
    }
  };

  return (
    <div>
      <h1>Calculator</h1>
      <input
        type="number"
        value={a}
        onChange={(e) => setA(parseFloat(e.target.value))}
      />
      <select value={operation} onChange={(e) => setOperation(e.target.value)}>
        <option value="add">+</option>
        <option value="subtract">-</option>
        <option value="multiply">*</option>
        <option value="divide">/</option>
      </select>
      <input
        type="number"
        value={b}
        onChange={(e) => setB(parseFloat(e.target.value))}
      />
      <button onClick={calculate}>Calculate</button>
      {result !== null && <p>Result: {result}</p>}
    </div>
  );
}


       
       
       