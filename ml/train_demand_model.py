import pandas as pd
import numpy as np
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error


# ============================================================
# 1. LOAD DATASET
# ============================================================

DATA_FILE = "sahaayak_ml_training_dataset_2_years.csv"

df = pd.read_csv(DATA_FILE)

print("Dataset loaded successfully.")
print(f"Total rows: {len(df)}")


# ============================================================
# 2. PREPARE DATE
# ============================================================

df["date"] = pd.to_datetime(df["date"])

# Sort chronologically
df = df.sort_values("date").reset_index(drop=True)


# ============================================================
# 3. DEFINE FEATURES AND TARGET
# ============================================================

# We want to predict:
# "How many bookings are expected tomorrow?"

target = "next_day_bookings"

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
    "avg_response_minutes"
]

X = df[features]
y = df[target]


# ============================================================
# 4. TIME-BASED TRAIN/TEST SPLIT
# ============================================================

# IMPORTANT:
# For forecasting, we should NOT randomly shuffle the data.
# We train on older data and test on newer data.

split_index = int(len(df) * 0.8)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]

print("\nTraining data:", len(X_train))
print("Testing data:", len(X_test))


# ============================================================
# 5. CATEGORICAL + NUMERICAL FEATURES
# ============================================================

categorical_features = [
    "city",
    "state",
    "service"
]

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
    "avg_response_minutes"
]


# ============================================================
# 6. PREPROCESSING
# ============================================================

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


# ============================================================
# 7. RANDOM FOREST MODEL
# ============================================================

model = RandomForestRegressor(
    n_estimators=200,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)


# ============================================================
# 8. CREATE ML PIPELINE
# ============================================================

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# ============================================================
# 9. TRAIN MODEL
# ============================================================

print("\nTraining demand forecasting model...")

pipeline.fit(X_train, y_train)

print("Model training completed.")


# ============================================================
# 10. MAKE PREDICTIONS
# ============================================================

predictions = pipeline.predict(X_test)

# Demand cannot be negative
predictions = np.maximum(predictions, 0)


# ============================================================
# 11. MODEL EVALUATION
# ============================================================

mae = mean_absolute_error(y_test, predictions)

rmse = np.sqrt(
    mean_squared_error(y_test, predictions)
)

print("\n==============================")
print("MODEL PERFORMANCE")
print("==============================")

print(f"MAE  : {mae:.2f}")
print(f"RMSE : {rmse:.2f}")

print("==============================")


# ============================================================
# 12. SHOW SAMPLE PREDICTIONS
# ============================================================

results = pd.DataFrame({
    "actual_bookings": y_test.values,
    "predicted_bookings": np.round(predictions, 2)
})

print("\nSample predictions:")
print(results.head(20))


# ============================================================
# 13. SAVE MODEL
# ============================================================

MODEL_FILE = "demand_forecasting_model.pkl"

joblib.dump(pipeline, MODEL_FILE)

print(f"\nModel saved successfully as: {MODEL_FILE}")