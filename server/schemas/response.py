# app/schemas/response.py

from pydantic import BaseModel


class PredictionResponse(BaseModel):
    prediction: int
    success_probability: float
    failure_probability: float

    derived_distance_km: float
    derived_time_of_day: str
    derived_traffic_level: str