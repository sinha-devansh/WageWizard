# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json
import joblib

# FastAPI imports
from fastapi import FastAPI
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from sklearn.preprocessing import LabelEncoder, RobustScaler
import tensorflow as tf
from tensorflow.keras import layers

app = FastAPI()

# ✅ Load dataset
data = pd.read_csv('WA_Fn-UseC_-HR-Employee-Attrition.csv')
data = data[(data['TotalWorkingYears'] <= 30) & (data['TotalWorkingYears'] >= 0)]

# ✅ Drop irrelevant columns
data = data.drop(columns=[
    'StockOptionLevel', 'DailyRate', 'HourlyRate', 'EnvironmentSatisfaction',
    'Over18', 'DistanceFromHome', 'MonthlyRate', 'EmployeeCount', 'EmployeeNumber'
])

# ✅ Encode categorical variables with LabelEncoder
encoder = LabelEncoder()
categorical_cols = ['BusinessTravel', 'Department', 'Attrition', 'Gender', 'EducationField', 'JobRole', 'MaritalStatus', 'OverTime']
for col in categorical_cols:
    data[col] = encoder.fit_transform(data[col])

# ✅ Features and Target
X = data.drop(columns=['MonthlyIncome'])
Y = data['MonthlyIncome']

# ✅ Normalize features
scaler = RobustScaler()
X = scaler.fit_transform(X)

# Save scaler for later use in API endpoint
joblib.dump(scaler, "scaler.pkl")

# ✅ Train-test split
from sklearn.model_selection import train_test_split
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

# ✅ Build TensorFlow model
model = tf.keras.Sequential([
    layers.Input(shape=(X_train.shape[1],)),
    layers.Dense(256),
    layers.LeakyReLU(alpha=0.1),
    layers.Dropout(0.2),

    layers.Dense(128),
    layers.LeakyReLU(alpha=0.1),
    layers.Dropout(0.2),

    layers.Dense(64),
    layers.LeakyReLU(alpha=0.1),
    layers.Dropout(0.1),

    layers.Dense(1)
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='mse',
    metrics=['mae']
)

# ✅ Early stopping
early_stop = tf.keras.callbacks.EarlyStopping(
    monitor='val_loss',
    patience=10,
    restore_best_weights=True
)

# ✅ Train model
history = model.fit(
    X_train, Y_train,
    validation_split=0.1,
    epochs=200,
    batch_size=32,
    callbacks=[early_stop],
    verbose=1
)

# ✅ Predict on test set
y_pred = model.predict(X_test).flatten()

# ✅ Evaluation metrics
mae = mean_absolute_error(Y_test, y_pred)
rmse = np.sqrt(mean_squared_error(Y_test, y_pred))
r2 = r2_score(Y_test, y_pred)

print(f"🔎 Mean Absolute Error (MAE): ₹{mae:.2f}")
print(f"🔎 Root Mean Squared Error (RMSE): ₹{rmse:.2f}")
print(f"📈 R² Score (Accuracy-style): {r2:.4f}")

# ✅ Save metrics
metrics = {
    "mae": mae,
    "rmse": rmse,
    "r2": r2
}
with open("metrics.json", "w") as f:
    json.dump(metrics, f)

# Visualizations
import seaborn as sns

# 1️⃣ Loss Plot
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title("Loss over Epochs")
plt.xlabel("Epochs")
plt.ylabel("Loss")
plt.legend()
plt.grid(True)
plt.savefig("loss_plot.png")
plt.close()

# 2️⃣ Predicted vs Actual
plt.scatter(Y_test, y_pred, alpha=0.5)
plt.plot([Y_test.min(), Y_test.max()], [Y_test.min(), Y_test.max()], color='red', linestyle='--')
plt.xlabel("Actual Salary")
plt.ylabel("Predicted Salary")
plt.title("Predicted vs Actual Monthly Income")
plt.grid(True)
plt.savefig("predicted_vs_actual.png")
plt.close()

# 3️⃣ Residuals Histogram
residuals = Y_test - y_pred
sns.histplot(residuals, kde=True, bins=30)
plt.xlabel("Residual (Actual - Predicted)")
plt.title("Residuals Distribution")
plt.grid(True)
plt.savefig("residuals_histogram.png")
plt.close()

# 4️⃣ Residuals vs Predicted
plt.scatter(y_pred, residuals, alpha=0.5)
plt.axhline(0, color='red', linestyle='--')
plt.xlabel("Predicted Salary")
plt.ylabel("Residuals")
plt.title("Residuals vs Predicted")
plt.grid(True)
plt.savefig("residuals_vs_predicted.png")
plt.close()

# 5️⃣ Boxplot of Absolute Errors
abs_errors = np.abs(Y_test - y_pred)
sns.boxplot(y=abs_errors)
plt.ylabel("Absolute Error")
plt.title("Boxplot of Absolute Prediction Errors")
plt.grid(True)
plt.savefig("boxplot_absolute_errors.png")
plt.close()

# 6️⃣ Distribution: Actual vs Predicted
sns.kdeplot(Y_test, label='Actual', fill=True)
sns.kdeplot(y_pred, label='Predicted', fill=True)
plt.xlabel("Monthly Income")
plt.title("Distribution: Actual vs Predicted Income")
plt.legend()
plt.grid(True)
plt.savefig("distribution_actual_vs_predicted.png")
plt.close()

# ✅ Save model
model.save("wagewizard_model.h5")


# --------- FastAPI endpoint to serve model metrics ---------
@app.get("/metrics")
def get_model_metrics():
    # Load test data again (or you can keep a separate test CSV if needed)
    data = pd.read_csv('WA_Fn-UseC_-HR-Employee-Attrition.csv')
    data = data[(data['TotalWorkingYears'] <= 30) & (data['TotalWorkingYears'] >= 0)]

    # Drop irrelevant columns (same as before)
    data = data.drop(columns=[
        'StockOptionLevel', 'DailyRate', 'HourlyRate', 'EnvironmentSatisfaction',
        'Over18', 'DistanceFromHome', 'MonthlyRate', 'EmployeeCount', 'EmployeeNumber'
    ])

    # Encode categorical variables with LabelEncoder again to maintain consistency
    encoder = LabelEncoder()
    categorical_cols = ['BusinessTravel', 'Department', 'Attrition', 'Gender', 'EducationField', 'JobRole', 'MaritalStatus', 'OverTime']
    for col in categorical_cols:
        data[col] = encoder.fit_transform(data[col])

    X = data.drop(columns=['MonthlyIncome'])
    y_true = data['MonthlyIncome'].values

    # Load scaler and transform features
    scaler = joblib.load("scaler.pkl")
    X_scaled = scaler.transform(X)

    # Predict using the trained model
    y_pred = model.predict(X_scaled).flatten()

    # Calculate metrics
    r2 = r2_score(y_true, y_pred)
    mae = mean_absolute_error(y_true, y_pred)
    rmse = mean_squared_error(y_true, y_pred, squared=False)

    return {
        "r2": round(r2, 4),
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "actual": y_true.tolist(),
        "predicted": y_pred.tolist()
    }
