import pandas as pd
import numpy as np
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error


# --------------------------------------------------
# Configuration
# --------------------------------------------------

DATASET_PATH = "sahaayak_ml_training_dataset_2_years.csv"
MODEL_PATH = "workforce_allocation_model.pkl"


# --------------------------------------------------
# Load Dataset
# --------------------------------------------------

print("Loading dataset...")

df = pd.read_csv(DATASET_PATH)

print(f"Total rows: {len(df)}")


# --------------------------------------------------
# Prepare Date
# --------------------------------------------------

df["date"] = pd.to_datetime(df["date"])

df = df.sort_values("date").reset_index(drop=True)


# --------------------------------------------------
# Target
# --------------------------------------------------
# recommended_workers is the workforce requirement
# generated for each city/service/day in the dataset.

target = "recommended_workers"


# --------------------------------------------------
# Features
# --------------------------------------------------

features = [
    "day_of_week",
    "is_weekend",
    "month",
    "city",
    "state",
    "service",
    "workers_available",
    "workers_assigned",
    "bookings",
    "completed_jobs",
    "cancelled_jobs",
    "pending_jobs",
    "avg_response_minutes",
    "next_day_bookings"
]

X = df[features]
y = df[target]


# --------------------------------------------------
# Chronological Train/Test Split
# --------------------------------------------------

split_index = int(len(df) * 0.80)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]


print(f"Training data: {len(X_train)}")
print(f"Testing data: {len(X_test)}")


# --------------------------------------------------
# Categorical Features
# --------------------------------------------------

categorical_features = [
    "city",
    "state",
    "service"
]


# --------------------------------------------------
# Numerical Features
# --------------------------------------------------

numerical_features = [
    "day_of_week",
    "is_weekend",
    "month",
    "workers_available",
    "workers_assigned",
    "bookings",
    "completed_jobs",
    "cancelled_jobs",
    "pending_jobs",
    "avg_response_minutes",
    "next_day_bookings"
]


# --------------------------------------------------
# Preprocessing
# --------------------------------------------------

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        ),
        (
            "numerical",
            "passthrough",
            numerical_features
        )
    ]
)


# --------------------------------------------------
# ML Model
# --------------------------------------------------

model = RandomForestRegressor(
    n_estimators=200,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)


# --------------------------------------------------
# Complete ML Pipeline
# --------------------------------------------------

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# --------------------------------------------------
# Train Model
# --------------------------------------------------

print("Training workforce allocation model...")

pipeline.fit(X_train, y_train)

print("Model training completed.")


# --------------------------------------------------
# Evaluate Model
# --------------------------------------------------

predictions = pipeline.predict(X_test)

predictions = np.maximum(predictions, 0)

mae = mean_absolute_error(y_test, predictions)

rmse = np.sqrt(
    mean_squared_error(y_test, predictions)
)


print("\nWORKFORCE ALLOCATION MODEL PERFORMANCE")
print("---------------------------------------")
print(f"MAE  : {mae:.2f}")
print(f"RMSE : {rmse:.2f}")


# --------------------------------------------------
# Sample Predictions
# --------------------------------------------------

results = pd.DataFrame({
    "actual_workers": y_test.values[:10],
    "predicted_workers": predictions[:10]
})

print("\nSample predictions:")
print(results)


# --------------------------------------------------
# Save Model
# --------------------------------------------------

joblib.dump(
    pipeline,
    MODEL_PATH
)

print(
    f"\nModel saved successfully as: {MODEL_PATH}"
)