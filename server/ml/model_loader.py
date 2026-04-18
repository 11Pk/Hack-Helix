import joblib

model = joblib.load("models/delivery_model.pkl")
columns = joblib.load("models/columns.pkl")
scaler = joblib.load("models/scaler.pkl")