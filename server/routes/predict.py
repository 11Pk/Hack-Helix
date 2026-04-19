# from typing import Optional

# from fastapi import APIRouter, HTTPException
# from schemas.request import DeliveryRequest
# from ml.predictor import predict_delivery
# from services.geocode import get_coordinates
# from services.distance import calculate_distance
# from services.time_service import get_time_of_day
# from services.weather import get_weather_condition
# from services.traffic_level import get_traffic_level
# from services.traffic_delay_factor import get_traffic_factor
# from services.road_type import get_road_type, get_road_factor
# from services.customer_behaviour import customer_behavior

# router = APIRouter()


# def _distance_category(distance_km: float) -> str:
#     if distance_km < 5:
#         return "small"
#     if distance_km <= 15:
#         return "medium"
#     return "long"


# def _area_from_address(address: str) -> str:
#     lower_address = (address or "").lower()
#     if any(token in lower_address for token in ["sector", "market", "mall", "office", "industrial", "it park"]):
#         return "office"
#     if any(token in lower_address for token in ["colony", "residential", "apartment", "society", "vihar", "nagar"]):
#         return "residential"
#     return "mixed"


# def _risk_score(distance_category: str, traffic_level: str, road_type: str) -> int:
#     distance_map = {"small": 1, "medium": 2, "long": 3}
#     traffic_map = {"low": 1, "medium": 2, "high": 3}
#     road_map = {"highway": 1, "city": 2, "local": 3}
#     return distance_map[distance_category] + traffic_map[traffic_level] + road_map[road_type]


# def _predict_from_request(data: DeliveryRequest):
#     current_address = data.delivery_man_address or data.current_location
#     customer_address = data.customer_address or data.drop_location

#     if not current_address or not customer_address:
#         raise HTTPException(
#             status_code=400,
#             detail="Both delivery man address and customer address are required.",
#         )

#     current_lat, current_lon = get_coordinates(current_address)
#     customer_lat, customer_lon = get_coordinates(customer_address)

#     if None in [current_lat, current_lon, customer_lat, customer_lon]:
#         raise HTTPException(status_code=400, detail="Unable to geocode one or more addresses.")

#     distance_km = calculate_distance(current_lat, current_lon, customer_lat, customer_lon)
#     distance_category = _distance_category(distance_km)

#     time_of_day = get_time_of_day(data.delivery_time).lower()
#     area_type = (data.area_type or _area_from_address(customer_address)).lower()

#     weather = (data.weather or get_weather_condition(customer_lat, customer_lon) or "clear").lower()
#     if weather == "foggy":
#         weather = "fog"
#     if weather not in {"clear", "fog", "rain"}:
#         weather = "clear"

#     traffic_level = get_traffic_level(time_of_day, weather, area_type)
#     traffic_delay_factor = get_traffic_factor(traffic_level)

#     road_type = get_road_type(area_type)
#     road_quality_factor = get_road_factor(road_type)
#     effective_distance = round(distance_km * traffic_delay_factor * road_quality_factor, 2)

#     customer_failure_rate, customer_home_prob = customer_behavior(area_type, time_of_day)
#     risk_score = _risk_score(distance_category, traffic_level, road_type)

#     features = {
#         "lat": float(customer_lat),
#         "lon": float(customer_lon),
#         "distance_km": float(distance_km),
#         "traffic_delay_factor": float(traffic_delay_factor),
#         "road_quality_factor": float(road_quality_factor),
#         "effective_distance": float(effective_distance),
#         "customer_failure_rate": float(customer_failure_rate),
#         "customer_home_prob": float(customer_home_prob),
#         "risk_score": float(risk_score),
#         "customer_id": data.customer_id or "UNKNOWN",
#         "time_of_day": time_of_day,
#         "weather": weather,
#         "area_type": area_type,
#         "distance_category": distance_category,
#         "traffic_level": traffic_level,
#         "road_type": road_type,
#     }

#     return predict_delivery(features)


# @router.post("/predict")
# def predict(data: DeliveryRequest):
#     return _predict_from_request(data)


# @router.get("/predict")
# def predict_query(
#     delivery_man_address: str,
#     customer_address: str,
#     delivery_time: str,
#     customer_id: Optional[str] = None,
#     delivery_id: Optional[str] = None,
# ):
#     """Returns JSON with delivery_failure_score (and failure_probability); same logic as POST /predict."""
#     cid = customer_id or delivery_id
#     data = DeliveryRequest(
#         delivery_man_address=delivery_man_address,
#         customer_address=customer_address,
#         delivery_time=delivery_time,
#         customer_id=cid,
#     )
#     return _predict_from_request(data)

from typing import Optional

from fastapi import APIRouter, HTTPException
from schemas.request import DeliveryRequest
from ml.predictor import predict_delivery
from services.geocode import get_coordinates
from services.distance import calculate_distance
from services.time_service import get_time_of_day
from services.weather import get_weather_condition
from services.traffic_level import get_traffic_level
from services.traffic_delay_factor import get_traffic_factor
from services.road_type import get_road_type, get_road_factor
from services.customer_behaviour import customer_behavior

router = APIRouter()


def _distance_category(distance_km: float) -> str:
    if distance_km < 5:
        return "small"
    if distance_km <= 15:
        return "medium"
    return "long"


def _area_from_address(address: str) -> str:
    lower_address = (address or "").lower()

    if any(token in lower_address for token in [
        "sector", "market", "mall", "office",
        "industrial", "it park"
    ]):
        return "office"

    if any(token in lower_address for token in [
        "colony", "residential", "apartment",
        "society", "vihar", "nagar"
    ]):
        return "residential"

    return "mixed"


def _risk_score(distance_category: str, traffic_level: str, road_type: str) -> int:
    distance_map = {"small": 1, "medium": 2, "long": 3}
    traffic_map = {"low": 1, "medium": 2, "high": 3}
    road_map = {"highway": 1, "city": 2, "local": 3}

    return (
        distance_map[distance_category]
        + traffic_map[traffic_level]
        + road_map[road_type]
    )


def _predict_from_request(data: DeliveryRequest):

    current_address = data.delivery_man_address or data.current_location
    customer_address = data.customer_address or data.drop_location

    if not current_address or not customer_address:
        raise HTTPException(
            status_code=400,
            detail="Both delivery man address and customer address are required."
        )

    # Geocoding
    current_lat, current_lon = get_coordinates(current_address)
    customer_lat, customer_lon = get_coordinates(customer_address)

    if None in [current_lat, current_lon, customer_lat, customer_lon]:
        raise HTTPException(
            status_code=400,
            detail="Unable to geocode one or more addresses."
        )

    # Distance
    distance_km = calculate_distance(
        current_lat, current_lon,
        customer_lat, customer_lon
    )

    distance_category = _distance_category(distance_km)

    # Time
    time_of_day = get_time_of_day(data.delivery_time).lower()

    # Area Type
    area_type = (data.area_type or _area_from_address(customer_address)).lower()

    # Weather
    weather = (
        data.weather
        or get_weather_condition(customer_lat, customer_lon)
        or "clear"
    ).lower()

    if weather == "foggy":
        weather = "fog"

    if weather not in {"clear", "fog", "rain"}:
        weather = "clear"

    # Traffic
    traffic_level = get_traffic_level(time_of_day, weather, area_type)
    traffic_delay_factor = get_traffic_factor(traffic_level)

    # Road Type
    road_type = get_road_type(area_type)
    road_quality_factor = get_road_factor(road_type)

    # Effective Distance
    effective_distance = round(
        distance_km * traffic_delay_factor * road_quality_factor, 2
    )

    # Customer Behaviour
    customer_failure_rate, customer_home_prob = customer_behavior(
        area_type, time_of_day
    )

    # Risk Score
    risk_score = _risk_score(
        distance_category,
        traffic_level,
        road_type
    )

    # Final Features for Model
    features = {
        "lat": float(customer_lat),
        "lon": float(customer_lon),
        "distance_km": float(distance_km),
        "traffic_delay_factor": float(traffic_delay_factor),
        "road_quality_factor": float(road_quality_factor),
        "effective_distance": float(effective_distance),
        "customer_failure_rate": float(customer_failure_rate),
        "customer_home_prob": float(customer_home_prob),
        "risk_score": float(risk_score),
        "customer_id": data.customer_id or "UNKNOWN",
        "time_of_day": time_of_day,
        "weather": weather,
        "area_type": area_type,
        "distance_category": distance_category,
        "traffic_level": traffic_level,
        "road_type": road_type,
    }

    # Prediction
    result = predict_delivery(features)

    # Round probabilities to 2 decimal places
    if "success_probability" in result:
        result["success_probability"] = round(
            result["success_probability"], 2
        )

    if "failure_probability" in result:
        result["failure_probability"] = round(
            result["failure_probability"], 2
        )

    if "delivery_failure_score" in result:
        result["delivery_failure_score"] = round(
            result["delivery_failure_score"], 2
        )

    return result


@router.post("/predict")
def predict(data: DeliveryRequest):
    return _predict_from_request(data)


@router.get("/predict")
def predict_query(
    delivery_man_address: str,
    customer_address: str,
    delivery_time: str,
    customer_id: Optional[str] = None,
    delivery_id: Optional[str] = None,
):
    """
    Returns JSON with delivery_failure_score
    (and failure_probability)
    """

    cid = customer_id or delivery_id

    data = DeliveryRequest(
        delivery_man_address=delivery_man_address,
        customer_address=customer_address,
        delivery_time=delivery_time,
        customer_id=cid,
    )

    return _predict_from_request(data)
