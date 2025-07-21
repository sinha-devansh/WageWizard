import React, { useState } from "react";
import axios from "axios";

const EmployeeForm = ({ onPredict }) => {
  const [formData, setFormData] = useState({
    Age: "",
    Attrition: "No",
    BusinessTravel: "Travel_Rarely",
    Department: "Research & Development",
    Education: "3",
    EducationField: "Life Sciences",
    Gender: "Male",
    JobInvolvement: "3",
    JobLevel: "1",
    JobRole: "Sales Executive",
    JobSatisfaction: "3",
    MaritalStatus: "Single",
    NumCompaniesWorked: "1",
    OverTime: "No",
    PercentSalaryHike: "11",
    PerformanceRating: "3",
    RelationshipSatisfaction: "3",
    StandardHours: "80",
    TotalWorkingYears: "3",
    TrainingTimesLastYear: "2",
    WorkLifeBalance: "3",
    YearsAtCompany: "2",
    YearsInCurrentRole: "2",
    YearsSinceLastPromotion: "1",
    YearsWithCurrManager: "2",
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/predict", formData);
      const predictedSalary = parseFloat(response.data.predicted_salary).toFixed(2);
      setPrediction(predictedSalary);
      onPredict(predictedSalary, formData);
    } catch (err) {
      console.error("Prediction failed:", err);
    }
  };

  const renderField = (key, value) => {
    const isNumeric = !isNaN(value) && value !== "";
    const isDropdown = [
      "Attrition", "BusinessTravel", "Department", "EducationField", "Gender",
      "JobInvolvement", "JobLevel", "JobRole", "JobSatisfaction", "MaritalStatus",
      "OverTime", "PerformanceRating", "RelationshipSatisfaction", "WorkLifeBalance"
    ].includes(key);

    const options = {
      Attrition: ["Yes", "No"],
      BusinessTravel: ["Travel_Rarely", "Travel_Frequently", "Non-Travel"],
      Department: ["Sales", "Research & Development", "Human Resources"],
      EducationField: [
        "Life Sciences", "Medical", "Marketing", "Technical Degree", "Human Resources", "Other"
      ],
      Gender: ["Male", "Female"],
      JobInvolvement: ["1", "2", "3", "4"],
      JobLevel: ["1", "2", "3", "4", "5"],
      JobRole: [
        "Sales Executive", "Research Scientist", "Laboratory Technician", "Manufacturing Director",
        "Healthcare Representative", "Manager", "Sales Representative", "Research Director", "Human Resources"
      ],
      JobSatisfaction: ["1", "2", "3", "4"],
      MaritalStatus: ["Single", "Married", "Divorced"],
      OverTime: ["Yes", "No"],
      PerformanceRating: ["1", "2", "3", "4"],
      RelationshipSatisfaction: ["1", "2", "3", "4"],
      WorkLifeBalance: ["1", "2", "3", "4"],
    };

    return (
      <div key={key} className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
        {isDropdown ? (
          <select
            name={key}
            value={value}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner"
          >
            {options[key].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="number"
            name={key}
            value={value}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-inner"
            min="0"
          />
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white via-[#fdf9f3] to-[#f4e8ff] p-8 rounded-3xl shadow-2xl border border-gray-200">
      <h2 className="text-4xl text-center mb-6 text-indigo-700 font-[Dancing_Script]">👨‍💼 Enter Employee Details</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
        {Object.entries(formData).map(([key, value]) => renderField(key, value))}
        <div className="md:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 px-8 rounded-xl text-xl shadow-md transition-all duration-300"
          >
            🔍 Predict Salary
          </button>
        </div>
      </form>

      {prediction && (
        <div className="mt-8 text-center text-2xl font-bold text-green-600">
          💰 Predicted Salary: ₹{prediction}
        </div>
      )}
    </div>
  );
};

export default EmployeeForm;
