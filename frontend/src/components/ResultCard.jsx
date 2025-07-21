import React from "react";
import { CheckCircle } from "lucide-react"; // Icon library

const ResultCard = ({ salary }) => {
  // Ensure salary is a number before formatting
  const parsedSalary = parseFloat(salary);
  const displaySalary = isNaN(parsedSalary) ? "N/A" : `₹${parsedSalary.toFixed(2)}`;

  return (
    <div className="bg-green-100 border-2 border-green-400 rounded-xl p-6 mt-6 shadow-lg text-center animate-fade-in-down">
      <div className="flex justify-center mb-2">
        <CheckCircle className="text-green-600 h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold text-green-800">
        💰 Predicted Monthly Salary
      </h2>
      <p className="text-3xl mt-2 font-extrabold text-green-700">
        {displaySalary}
      </p>
      <p className="text-green-600 mt-1 italic">Based on submitted data</p>
    </div>
  );
};

export default ResultCard;
