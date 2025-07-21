import React from "react";

const graphs = [
  {
    file: "loss_plot.png",
    label: "Training Loss",
  },
  {
    file: "predicted_vs_actual.png",
    label: "Predicted vs Actual Salary",
  },
  {
    file: "residuals_histogram.png",
    label: "Residuals Histogram",
  },
  {
    file: "residuals_vs_predicted.png",
    label: "Residuals vs Predicted",
  },
  {
    file: "boxplot_absolute_errors.png",
    label: "Absolute Error Boxplot",
  },
  {
    file: "distribution_actual_vs_predicted.png",
    label: "Distribution Comparison",
  },
];

const ModelInsights = () => {
  return (
    <div className="my-10 p-8 rounded-3xl shadow-xl bg-white/10 backdrop-blur-md">
      <h2 className="text-4xl font-bold text-center text-yellow-300 mb-10 font-[Dancing_Script] drop-shadow-md">
        📊 Model Performance Visualizations
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {graphs.map((g) => (
          <div
            key={g.file}
            className="bg-white/20 rounded-2xl shadow-lg p-4 backdrop-blur-md hover:scale-[1.02] transition-transform duration-300"
          >
            <img
              src={`http://localhost:8000/static/${g.file}`}
              alt={g.label}
              className="rounded-xl w-full h-auto shadow-md"
            />
            <p className="text-center text-lg mt-3 font-semibold text-white font-[Dancing_Script]">
              {g.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelInsights;
