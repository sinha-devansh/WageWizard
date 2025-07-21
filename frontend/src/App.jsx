import React, { useState } from "react";
import ModelInsights from "./components/ModelInsights";
import ResultCard from "./components/ResultCard";
import EmployeeForm from "./components/EmployeeForm";
import ChartsDisplay from "./components/ChartsDisplay";

function App() {
  const [predictedSalary, setPredictedSalary] = useState(null);
  const [history, setHistory] = useState([]);

  const handlePrediction = (salary, inputData) => {
    const numericSalary = parseFloat(salary);  // 👈 Ensures it's a number
    setPredictedSalary(numericSalary);
    setHistory([...history, { ...inputData, salary: numericSalary }]);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <h1 className="text-5xl font-bold text-center mb-10 font-[Dancing_Script] text-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff] animate-pulse">
        WageWizard - Predict Employee Salary
      </h1>
      <div className="max-w-6xl mx-auto bg-white/90 p-6 rounded-3xl shadow-xl">
        <EmployeeForm onPredict={handlePrediction} />
        {predictedSalary !== null && <ResultCard salary={predictedSalary} />}
      </div>
      <div className="max-w-6xl mx-auto mt-10">
        <ChartsDisplay history={history} />
        <ModelInsights />
      </div>
    </div>
  );
}

export default App;
