from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib


# --------------------------------------------------
# FastAPI App
# --------------------------------------------------

app = FastAPI(
    title="Sahaayak ML Service",
    description="AI service for demand forecasting and workforce allocation",
    version="1.0.0"
)


# --------------------------------------------------
# Model Paths
# --------------------------------------------------

DEMAND_MODEL_PATH = "demand_forecasting_model.pkl"
WORKFORCE_MODEL_PATH = "workforce_allocation_model.pkl"


# --------------------------------------------------
# Load Models
# --------------------------------------------------

try:
    demand_model = joblib.load(DEMAND_MODEL_PATH)
    print("Demand forecasting model loaded successfully.")
except Exception as e:
    demand_model = None
    print(f"Error loading demand forecasting model: {e}")


try:
    workforce_model = joblib.load(WORKFORCE_MODEL_PATH)
    print("Workforce allocation model loaded successfully.")
except Exception as e:
    workforce_model = None
    print(f"Error loading workforce allocation model: {e}")


# --------------------------------------------------
# Root Endpoint
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "success": True,
        "service": "Sahaayak ML Service",
        "version": "1.0.0",
        "endpoints": [
            "/health",
            "/forecast",
            "/allocate",
            "/docs"
        ]
    }


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "success": True,
        "service": "Sahaayak ML Service",
        "status": "running",
        "demand_model_loaded": demand_model is not None,
        "workforce_model_loaded": workforce_model is not None
    }


# ==================================================
# DEMAND FORECASTING
# ==================================================


class ForecastRequest(BaseModel):
    city: str
    state: str
    service: str
    date: str

    workers_available: int = 10
    workers_assigned: int = 0
    bookings: int = 0
    completed_jobs: int = 0
    cancelled_jobs: int = 0
    pending_jobs: int = 0
    avg_response_minutes: float = 20.0


@app.post("/forecast")
def forecast_demand(request: ForecastRequest):

    if demand_model is None:
        raise HTTPException(
            status_code=500,
            detail="Demand forecasting model is not loaded."
        )

    try:
        date = pd.to_datetime(request.date)

        day_of_week = date.dayofweek
        is_weekend = 1 if day_of_week >= 5 else 0
        month = date.month

        input_data = pd.DataFrame([
            {
                "day_of_week": day_of_week,
                "is_weekend": is_weekend,
                "month": month,
                "city": request.city,
                "state": request.state,
                "service": request.service,
                "workers_available": request.workers_available,
                "workers_assigned": request.workers_assigned,
                "bookings": request.bookings,
                "completed_jobs": request.completed_jobs,
                "cancelled_jobs": request.cancelled_jobs,
                "pending_jobs": request.pending_jobs,
                "avg_response_minutes": request.avg_response_minutes
            }
        ])

        prediction = demand_model.predict(input_data)

        predicted_bookings = max(
            0,
            float(prediction[0])
        )

        predicted_bookings = round(
            predicted_bookings,
            2
        )

        return {
            "success": True,
            "city": request.city,
            "state": request.state,
            "service": request.service,
            "date": request.date,
            "predicted_bookings": predicted_bookings
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# ==================================================
# WORKFORCE ALLOCATION
# ==================================================


class AllocationRequest(BaseModel):
    city: str
    state: str
    service: str

    predicted_bookings: float
    available_workers: int

    workers_per_booking: float = 1.0


@app.post("/allocate")
def allocate_workforce(request: AllocationRequest):

    if workforce_model is None:
        raise HTTPException(
            status_code=500,
            detail="Workforce allocation model is not loaded."
        )

    try:

        # ------------------------------------------
        # Calculate basic demand requirement
        # ------------------------------------------

        required_workers = int(
            np.ceil(
                request.predicted_bookings
                * request.workers_per_booking
            )
        )

        # ------------------------------------------
        # Prepare ML input
        # ------------------------------------------

        input_data = pd.DataFrame([
            {
                "day_of_week": 0,
                "is_weekend": 0,
                "month": 1,
                "city": request.city,
                "state": request.state,
                "service": request.service,
                "workers_available": request.available_workers,
                "workers_assigned": 0,
                "bookings": request.predicted_bookings,
                "completed_jobs": 0,
                "cancelled_jobs": 0,
                "pending_jobs": request.predicted_bookings,
                "avg_response_minutes": 20.0,
                "next_day_bookings": request.predicted_bookings
            }
        ])

        # ------------------------------------------
        # ML Prediction
        # ------------------------------------------

        ml_prediction = workforce_model.predict(
            input_data
        )

        ml_recommended_workers = max(
            0,
            float(ml_prediction[0])
        )

        ml_recommended_workers = int(
            np.ceil(
                ml_recommended_workers
            )
        )

        # ------------------------------------------
        # Final recommendation
        # ------------------------------------------

        recommended_workers = min(
            ml_recommended_workers,
            request.available_workers
        )

        # Ensure at least the basic calculated
        # requirement is considered when appropriate.
        recommended_workers = min(
            max(
                recommended_workers,
                min(
                    required_workers,
                    request.available_workers
                )
            ),
            request.available_workers
        )

        # ------------------------------------------
        # Shortage / surplus
        # ------------------------------------------

        worker_shortage = max(
            0,
            required_workers - request.available_workers
        )

        worker_surplus = max(
            0,
            request.available_workers - required_workers
        )

        return {
            "success": True,
            "city": request.city,
            "state": request.state,
            "service": request.service,
            "predicted_bookings": request.predicted_bookings,
            "required_workers": required_workers,
            "available_workers": request.available_workers,
            "recommended_workers": recommended_workers,
            "worker_shortage": worker_shortage,
            "worker_surplus": worker_surplus,
            "ml_recommended_workers": ml_recommended_workers
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )