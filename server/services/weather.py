import os
import requests
from dotenv import load_dotenv

load_dotenv()

def get_weather_condition(lat, lon):
    api_key = os.getenv("WEATHER_API_KEY")

    if not api_key:
        return None

    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}"

    try:
        response = requests.get(url)

        if response.status_code != 200:
            raise Exception(f"API error: {response.status_code}")

        data = response.json()

        main_weather = data["weather"][0]["main"].lower()

        # Simplify weather condition
        if "cloud" in main_weather:
            return "cloudy"
        elif "fog" in main_weather or "mist" in main_weather or "haze" in main_weather:
            return "fog"
        elif "rain" in main_weather or "drizzle" in main_weather or "thunder" in main_weather:
            return "rain"
        elif "clear" in main_weather:
            return "clear"
        else:
            return "clear"  # default fallback

    except Exception as error:
        print("Error fetching weather:", str(error))
        return None