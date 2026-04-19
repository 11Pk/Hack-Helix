
from pydantic import BaseModel, Field
from typing import Optional


class DeliveryRequest(BaseModel):
    # Existing/raw inputs (kept for backward compatibility)
    pickup_location: Optional[str] = Field(None, example="Patiala")
    drop_location: Optional[str] = Field(None, example="Mohali")
    current_location: Optional[str] = Field(None, example="Rajpura")

    delivery_time: str = Field(..., example="18:30")   # HH:MM
    weather: Optional[str] = Field(None, example="Rainy")

    customer_id: Optional[str] = Field(None, example="C102")
    area_type: Optional[str] = Field(None, example="Urban")

    # Frontend payload aliases (minimal backend-only support)
    delivery_man_address: Optional[str] = Field(None, example="Rajpura")
    customer_address: Optional[str] = Field(None, example="Mohali")