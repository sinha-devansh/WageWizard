from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = tf.keras.models.load_model("wagewizard_model.h5", compile=False)

class EmployeeData(BaseModel):
    Age: int
    Attrition: str
    BusinessTravel: str
    Department: str
    Education: int
    EducationField: str
    Gender: str
    JobInvolvement: int
    JobLevel: int
    JobRole: str
    JobSatisfaction: int
    MaritalStatus: str
    NumCompaniesWorked: int
    OverTime: str
    PercentSalaryHike: int
    PerformanceRating: int
    RelationshipSatisfaction: int
    StandardHours: int
    TotalWorkingYears: int
    TrainingTimesLastYear: int
    WorkLifeBalance: int
    YearsAtCompany: int
    YearsInCurrentRole: int
    YearsSinceLastPromotion: int
    YearsWithCurrManager: int


def preprocess_input(data: EmployeeData):
    d = data.dict()
    d["Gender"] = 1 if d["Gender"] == "Male" else 0
    d["Attrition"] = 1 if d["Attrition"] == "Yes" else 0
    d["OverTime"] = 1 if d["OverTime"] == "Yes" else 0
    
    business_travel_map = {"Non-Travel": 0, "Travel_Rarely": 1, "Travel_Frequently": 2}
    d["BusinessTravel"] = business_travel_map.get(d["BusinessTravel"], 0)

    department_map = {"Sales": 0, "Research & Development": 1, "Human Resources": 2}
    d["Department"] = department_map.get(d["Department"], 0)

    education_field_map = {
        "Life Sciences": 0, "Medical": 1, "Marketing": 2,
        "Technical Degree": 3, "Human Resources": 4, "Other": 5
    }
    d["EducationField"] = education_field_map.get(d["EducationField"], 5)

    job_role_map = {
        "Sales Executive": 0, "Research Scientist": 1, "Laboratory Technician": 2,
        "Manufacturing Director": 3, "Healthcare Representative": 4,
        "Manager": 5, "Sales Representative": 6, "Research Director": 7, "Human Resources": 8
    }
    d["JobRole"] = job_role_map.get(d["JobRole"], 0)

    marital_status_map = {"Single": 0, "Married": 1, "Divorced": 2}
    d["MaritalStatus"] = marital_status_map.get(d["MaritalStatus"], 0)

    return np.array([list(d.values())], dtype=np.float32)


@app.post("/predict")
def predict(input_data: EmployeeData):
    input_array = preprocess_input(input_data)
    prediction = model.predict(input_array)[0][0]
    return {"predicted_salary": float(prediction)}

import json
import os

@app.get("/metrics")
async def get_metrics():
    metrics_file = "metrics.json"
    if os.path.exists(metrics_file):
        with open(metrics_file, "r") as f:
            return json.load(f)
    else:
        return {"error": "Metrics file not found"}


from fastapi.staticfiles import StaticFiles

# Serve graph images from current directory (adjust if you use another folder)
app.mount("/static", StaticFiles(directory="."), name="static")
