import pandas as pd
from ml.model_loader import model, columns, scaler

def predict_delivery(features_dict):

    df = pd.DataFrame([features_dict])

    df = pd.get_dummies(df)

    df = df.reindex(columns=columns, fill_value=0)

    df_scaled = scaler.transform(df)

    pred = model.predict(df_scaled)[0]
    prob = model.predict_proba(df_scaled)[0][1]
    failure_prob = float(round(1 - prob, 3))

    return {
        "prediction": int(pred),
        "success_probability": float(round(prob, 3)),
        "failure_probability": failure_prob,
        "delivery_failure_score": failure_prob,
    }