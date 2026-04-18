import os
import urllib.parse

import requests
from dotenv import load_dotenv


def _opencage(address: str):
    load_dotenv()
    api_key = os.getenv("OPENCAGE_API_KEY")
    if not api_key:
        return None, None

    query = urllib.parse.quote(address + ", India")
    url = f"https://api.opencagedata.com/geocode/v1/json?q={query}&key={api_key}"
    try:
        res = requests.get(url, timeout=15).json()
    except (requests.RequestException, ValueError):
        return None, None

    if res.get("results"):
        loc = res["results"][0]["geometry"]
        return loc["lat"], loc["lng"]
    return None, None


def _nominatim(address: str):
    """Fallback when OpenCage is unset or returns nothing (no API key required)."""
    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": f"{address}, India", "format": "json", "limit": 1}
    headers = {"User-Agent": "HackHelixDeliveryPredict/1.0 (local dev)"}
    try:
        r = requests.get(url, params=params, headers=headers, timeout=15)
        r.raise_for_status()
        data = r.json()
    except (requests.RequestException, ValueError):
        return None, None

    if data and len(data) > 0:
        return float(data[0]["lat"]), float(data[0]["lon"])
    return None, None


def get_coordinates(address: str):
    lat, lon = _opencage(address)
    if lat is not None and lon is not None:
        return lat, lon
    return _nominatim(address)
