import React, { useEffect, useState } from "react";
import {
  Bar,
  Line,
  Scatter,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

const ChartsDisplay = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/metrics")
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error("Error fetching metrics:", err));
  }, []);

  if (!metrics) return <div>Loading charts...</div>;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "white",
          font: {
            family: "Dancing Script",
            size: 16,
          },
        },
      },
      title: {
        display: true,
        text: "",
        color: "white",
        font: {
          family: "Dancing Script",
          size: 20,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  const errorChart = {
    labels: ["MAE", "RMSE"],
    datasets: [
      {
        label: "Error Metrics",
        data: [metrics.mae, metrics.rmse],
        backgroundColor: ["#ff4d88", "#3399ff"],
      },
    ],
  };

  const lineChart = {
    labels: metrics.actuals.map((_, i) => `Employee ${i + 1}`),
    datasets: [
      {
        label: "Actual",
        data: metrics.actuals,
        borderColor: "#ff4d88",
        backgroundColor: "#ff4d88",
        tension: 0.3,
      },
      {
        label: "Predicted",
        data: metrics.predictions,
        borderColor: "#3399ff",
        backgroundColor: "#3399ff",
        tension: 0.3,
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: "Predicted vs Actual",
        data: metrics.actuals.map((act, i) => ({
          x: act,
          y: metrics.predictions[i],
        })),
        backgroundColor: "#FFD700",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const scatterOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: "Predicted vs Actual Salary",
        color: "white",
        font: {
          family: "Dancing Script",
          size: 20,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Actual Salary",
          color: "white",
          font: { family: "Dancing Script", size: 16 },
        },
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        title: {
          display: true,
          text: "Predicted Salary",
          color: "white",
          font: { family: "Dancing Script", size: 16 },
        },
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "'Dancing Script', cursive",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <div style={chartCardStyle}>
        <h3 style={titleStyle}>Error Metrics</h3>
        <div style={chartSize}>
          <Bar data={errorChart} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: false } } }} />
        </div>
      </div>

      <div style={chartCardStyle}>
        <h3 style={titleStyle}>Actual vs Predicted Trend</h3>
        <div style={chartSize}>
          <Line data={lineChart} options={chartOptions} />
        </div>
      </div>

      <div style={chartCardStyle}>
        <div style={chartSize}>
          <Scatter data={scatterData} options={scatterOptions} />
        </div>
      </div>

      <div style={r2Style}>
        R² Score: <strong>{metrics.r2_score?.toFixed(4)}</strong>
      </div>
    </div>
  );
};

const chartCardStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(12px)",
  borderRadius: "20px",
  padding: "1rem",
  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  width: "400px",
};

const chartSize = {
  height: "260px",
  width: "100%",
};

const titleStyle = {
  color: "white",
  textAlign: "center",
  fontSize: "1.4rem",
  marginBottom: "0.5rem",
};

const r2Style = {
  fontFamily: "'Dancing Script', cursive",
  fontSize: "1.5rem",
  color: "#fff",
  textShadow: "1px 1px 3px #000",
};

export default ChartsDisplay;
